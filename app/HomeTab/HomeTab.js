
import React, { Component } from 'react';
import { TouchableHighlight, Text, BackHandler, View, Linking, AppState, Image, ImageBackground, StatusBar, Dimensions, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Frequency from 'react-native-frequency';
import Modal from 'react-native-modal';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment/moment';

import Notification from '../Components/Notification';
import Loader from '../Components/Loader';
import RateReview from '../Components/RateReview'
import SmallPlayerView from '../Components/SmallPlayerView';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import { logoutData } from '../Networking/Common';
import WithSmallPlay from '../Hoc/WithSmallPlay';

const { width, height } = Dimensions.get("window")

class HomeTab extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            recentlyPlayedAlbumsArray: [],
            favoritesAlbumsArray: [],
            recentlyPlayedDataArray: [],
            favoritesDataArray: [],
            showRateReview: false,
            appState: AppState.currentState
        }
        this.openRateReview = this.openRateReview.bind(this)
        this.closeRateReview = this.closeRateReview.bind(this)
        this.openHelpSupport = this.openHelpSupport.bind(this)
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        webFunctions.setSubcribe();
        global.TAB_INDEX = 0;
        this.setData()
        AsyncStorage.getItem('install_app_flag', (err, install_app_flag) => {
            if (install_app_flag == "0" || install_app_flag == null) {
                this.saveAnalyticsFirebase('Downloads', {});
                AsyncStorage.setItem('install_app_flag', JSON.stringify(1));
            }
        });
        // AsyncStorage.setItem('total_play_time', JSON.stringify(1800));
        AsyncStorage.getItem('total_play_time', (err, total_play_time) => {
            if (total_play_time == "0" || total_play_time == null || total_play_time == 'null') {
                global.TOTAL_PLAY_TIME = 0
            } else {
                global.TOTAL_PLAY_TIME = parseInt(total_play_time)
            }
        });
        AppState.addEventListener('change', this._handleAppStateChange);
        this.checkStoreRating()
    }

    _getMe() {
        return fetch(global.USER_ME, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.USER_DATA.token
            })
        }).then(res => {
            if(!res.ok && res.status == 404){
                Alert.alert(
                    'Error message',
                    'Your session has expired, please login',
                )
                logoutData();
                return this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
            }
            return res.json()
        }).catch(error => {
            return undefined
        })
    }

    _handleAppStateChange = async (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            await this.checkVersion()
        }
        this.setState({ appState: nextAppState });
    }


    componentWillReceiveProps(nextProps) {
        global.TAB_INDEX = 0;
        this.setData()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    async checkVersion() {
        const platform = Platform.OS
        const res = await fetch(`${GET_LAST_VERSION}?platform=${platform}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        const lastVersion = res?.data?.version.split('.').join('')
        const currentVersion = DeviceInfo.getVersion().replace('.', '') + DeviceInfo.getBuildNumber()
        const forceUpdate = res?.data?.forceUpdate

        if (lastVersion && +lastVersion > +currentVersion) {
            if (forceUpdate == 1) {
                Alert.alert(
                    'Update Require',
                    'We have lauched a new and improved app. Please update to continue using the app', [{
                        text: 'Update Now',
                        onPress: () => { this.handleUpdateApp() },
                    },], {
                    cancelable: false
                })
            } else {
                Alert.alert(
                    'App update',
                    'There is a new version of the app, would you like to update it now?', [{
                        text: 'SKIP',
                        onPress: () => { },
                        style: 'Cancel'
                    }, {
                        text: 'Update Now',
                        onPress: () => { this.handleUpdateApp() },
                    },], {
                    cancelable: false
                })
            }
        }
    }

    handleUpdateApp = () => {
        if (Platform.OS == 'android') {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.rife');  // open store if update is needed.
        } else {
            Linking.openURL('https://apps.apple.com/vn/app/qi-coil-quantum-rife/id1643112222?l=vi');  // open store if update is needed.
        }
    }

    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Are you sure to exit?', [{
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => { BackHandler.exitApp() },
            },], {
            cancelable: false
        }
        )
        return true;
    }

    handleOnNavigateBack = (foo) => {
        this.setData()
    }

    async checkStoreRating() {
        const rate_flag = await AsyncStorage.getItem('rate_flag')
        if (rate_flag) {
            return
        }

        let rateRepeatDate = await AsyncStorage.getItem('rateRepeatDate');
        if (!rateRepeatDate) {
            await AsyncStorage.setItem('rateRepeatDate', JSON.stringify({ count: 0, rateDate: new Date() }))
        } else {
            rateRepeatDate = JSON.parse(rateRepeatDate)
            const count = rateRepeatDate?.count
            const rateDate = rateRepeatDate?.rateDate
            const diffDate = moment(new Date()).diff(moment(rateDate), 'days')
            if ((count == 0 && diffDate == 1) || (count > 0 && diffDate == 3)) {
                await AsyncStorage.setItem('rateRepeatDate', JSON.stringify({ count: count + 1, rateDate: new Date() }))
                this.openRateReview()
            }
        }
    }

    async setData() {
        const userProfile = await this._getMe();
        const userAlbums = userProfile?.album_ids || []
        const userCategoryIds = userProfile?.category_ids?.split(',')
        const userSubCategoryIds = userProfile?.subcategory_ids?.split(',')
        

        // AsyncStorage.setItem('recentlyPlayedAlbumsArray', '');
        AsyncStorage.getItem('recentlyPlayedAlbumsArray', (err, recentlyPlayedAlbumsArray) => {
            var oldPlayedAlbumsArray = JSON.parse(recentlyPlayedAlbumsArray)
            if (oldPlayedAlbumsArray != null && oldPlayedAlbumsArray != undefined) {
                oldPlayedAlbumsArray = oldPlayedAlbumsArray.map(item => {
                    if(userAlbums?.includes(item.id) || userCategoryIds?.includes(item.categoryId) || userSubCategoryIds?.includes(item.subCategoryId)){
                        item.lock = false
                    }else{
                        item.lock = true
                    }
                    return item
                })
                this.setState({ recentlyPlayedAlbumsArray: oldPlayedAlbumsArray })
            }
        });
        // AsyncStorage.setItem('recentlyPlayedDataArray', '');
        AsyncStorage.getItem('recentlyPlayedDataArray', (err, recentlyPlayedDataArray) => {
            var oldPlayedDataArray = JSON.parse(recentlyPlayedDataArray)
            if (oldPlayedDataArray != null && oldPlayedDataArray != undefined) {
                this.setState({ recentlyPlayedDataArray: oldPlayedDataArray })
            }
        });
        this.getFavorites(userAlbums, userCategoryIds, userSubCategoryIds)
    }

    getFavorites(userAlbums, userCategoryIds, userSubCategoryIds) {
        var authorization = ""
        if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
            authorization += "Bearer " + global.USER_DATA.token
        }
        var query_string = ''
        var url = encodeURI(GET_FAVORITE_PROGRAM + query_string);

        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': authorization,
            })
        }).then(res => res.json())
            .then(response => {
                let favorite_frequencies = response['favorite'];
                if (favorite_frequencies.length > 0) {
                    favorite_frequencies = favorite_frequencies.filter(item =>item.frequencies != '').map(item => {
                        if(userAlbums?.includes(item.id) || userCategoryIds?.includes(item.categoryId) || userSubCategoryIds?.includes(item.subCategoryId)){
                            item.lock = false
                        }else{
                            item.lock = true
                        }
                        return item
                    })
                    global.FAVORITES_DATA = favorite_frequencies
                    this.setState({ favoritesDataArray: favorite_frequencies })
                } else {
                    global.FAVORITES_DATA = []
                    this.setState({ favoritesDataArray: [] });
                }
            }).catch(error => {
                global.FAVORITES_DATA = []
                this.setState({ favoritesDataArray: [], favoritesAlbumsArray: [] });
            });

        var authorization = ""
        if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
            authorization += "Bearer " + global.USER_DATA.token
        }
        var query_string = ''
        var url = encodeURI(GET_FAVORITE_ALBUMS + query_string);

        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': authorization,
            })
        }).then(res => res.json())
            .then(response => {
                let favorite_album = response['favorite'];
                if (favorite_album.length > 0) {
                    favorite_album = favorite_album.map(item => {
                        if(userAlbums?.includes(item.id) || userCategoryIds?.includes(item.categoryId) || userSubCategoryIds?.includes(item.subCategoryId)){
                            item.lock = false
                        }else{
                            item.lock = true
                        }
                        return item
                    })
                    global.FAVORITES_ALBUMS = favorite_album
                    this.setState({ favoritesAlbumsArray: favorite_album })
                } else {
                    global.FAVORITES_ALBUMS = []
                    this.setState({ favoritesAlbumsArray: [] });
                }
            }).catch(error => {
                global.FAVORITES_ALBUMS = []
                this.setState({ favoritesDataArray: [], favoritesAlbumsArray: [] });
            });
    }
    

    async saveAnalyticsFirebase(eventName = '', dataArray = {}) {
        await analytics().logEvent(eventName, dataArray)
    }

    itemClick(dataArray) {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            if (global.IS_SUBSCRIBE == false) {
                if (global.TOTAL_PLAY_TIME > 1799) {
                    this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
                    return
                }
            }
            if (dataArray.frequencies && dataArray.frequencies != undefined) {
                if (global.IS_PLAY) {
                    global.IS_PLAY = false
                    global.PLAY_SUB_TITLE = ''
                    global.SMALL_VIEW_SHOW = false
                    global.SMALL_VIEW_IS_PLAY = false
                    global.SMALL_VIEW_TEXT = ''
                    Frequency.stop()
                    clearInterval(global.INTERVAL);
                }
                global.CURRENT_SECONDS = 0
                var frequenciesArray = dataArray.frequencies.split("/");
                this.props.navigation.navigate('PlayerView', {
                    callType: 'SelectItem',
                    id: dataArray.id,
                    title: dataArray.title,
                    strFrequencies: dataArray.frequencies,
                    playData: frequenciesArray,
                    transition: 'bottomUp',
                    onNavigateBack: this.handleOnNavigateBack.bind(this),
                });
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
    }

     

    openAlbumsDetails(dataArray) {
        if (dataArray.categoryId == 7 || dataArray.lock == false) {
            this.props.navigation.navigate('AlbumsDetails', { albumDetail: dataArray })
        } else {
            if (dataArray.categoryId == '2') {
                this.props.navigation.navigate('MasterQuantumSubView', { transition: 'bottomUp' });
            } else if (dataArray.categoryId == '3') {
                this.props.navigation.navigate('HigherQuantumSubView', { transition: 'bottomUp' });
            } else if (dataArray?.categoryId == '4') {
                this.OpenWebView("INNER CIRCLE", global.QLIFE_STORE)
            } else  {
                this.OpenWebView("SPECIAL", dataArray?.qilifestore_url)
            }
        }
    }

    OpenWebView(title = '', url = '') {
        this.props.navigation.navigate('OpenWebView', {
            title: title,
            url: url,
            transition: 'bottomUp'
        });
    }

    openRateReview() {
        this.setState({ showRateReview: true })
    }

    closeRateReview() {
        this.setState({ showRateReview: false })
    }

    openHelpSupport() {
        this.setState({ showRateReview: false }, () => {
            this.props.navigation.navigate('HelpSupport', { callType: 'HomeTab', transition: 'bottomUp' });
        })
    }

    render() {
        var name = ''
        if (global.USER_DATA.name && global.USER_DATA.name != undefined) {
            name = ', ' + global.USER_DATA.name
        }
        var recentlyPlayedAlbumsView = []
        if (this.state.recentlyPlayedAlbumsArray.length > 0) {
            this.state.recentlyPlayedAlbumsArray.forEach(function (item, index) {
                var viewWidth = (width - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15)) / 2.5
                var showLockImage = true
                if (item.lock == false || item.categoryId == 7) {
                    showLockImage = false
                }
                recentlyPlayedAlbumsView.push(
                    <TouchableHighlight
                        onPress={() => { this.openAlbumsDetails(item) }}
                        underlayColor={global.TRANSPARENT_COLOR}
                        style={index == 0 ? [Common.marginLeft0] : [Common.marginLeft20]}>
                        <View style={[]}>
                            <View style={[Common.borderRadius10, Common.overflowHidden, Colors.lightGreyBgColor, { width: viewWidth }]}>
                                <ProgressImage
                                    source={item.image_path_256x256 ? { uri: item.image_path_256x256 } : require('../Images/album_default.png')}
                                    style={[AppCommon.recentlyPlayedAlbumsItemImage]}
                                    imageStyle={[AppCommon.recentlyPlayedAlbumsItemImage]}>
                                    {showLockImage ?
                                        <View style={[]}>
                                            <Image source={require('../Images/lock.png')} style={[AppCommon.icon40, { tintColor: '#424244' }]} />
                                        </View>
                                        :
                                        null}
                                </ProgressImage>
                                <View style={[Common.positionAbs, Common.left5, Common.bottom5]}>
                                    <Image style={[AppCommon.icon30]} source={require('../Images/Play_2.png')} />
                                </View>
                            </View>
                            <View style={[Common.marginTop10, { width: viewWidth }]}>
                                <Text style={[AppCommon.h5, Colors.whiteFnColor]}>{item.title}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
            }.bind(this));
        } else {
            recentlyPlayedAlbumsView.push(
                <View style={[Common.marginTop20, Common.alignItmCenter, Common.justifyCenter, { width: width }]}>
                    <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Recently Played Albums Found</Text>
                </View>
            );
        }
        var favoritesPlayedAlbumsView = []
        if (this.state.favoritesAlbumsArray.length > 0) {
            this.state.favoritesAlbumsArray.forEach(function (item, index) {
                var viewWidth = (width - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15)) / 2.5
                var showLockImage = true
                if (item.is_free == '1' || item.lock == false) {
                    showLockImage = false
                }
                favoritesPlayedAlbumsView.push(
                    <TouchableHighlight
                        onPress={() => { this.openAlbumsDetails(item) }}
                        underlayColor={global.TRANSPARENT_COLOR}
                        style={index == 0 ? [Common.marginLeft0] : [Common.marginLeft20]}>
                        <View style={[]}>
                            <View style={[Common.borderRadius10, Common.overflowHidden, Colors.lightGreyBgColor, { width: viewWidth }]}>
                                <ProgressImage
                                    source={item.image_path_256x256 ? { uri: item.image_path_256x256 } : require('../Images/album_default.png')}
                                    style={[AppCommon.recentlyPlayedAlbumsItemImage]}
                                    imageStyle={[AppCommon.recentlyPlayedAlbumsItemImage]}>
                                    {showLockImage ?
                                        <View style={[]}>
                                            <Image source={require('../Images/lock.png')} style={[AppCommon.icon40, { tintColor: '#424244' }]} />
                                        </View>
                                        :
                                        null}
                                </ProgressImage>
                                <View style={[Common.positionAbs, Common.left5, Common.bottom5]}>
                                    <Image style={[AppCommon.icon30]} source={require('../Images/Play_2.png')} />
                                </View>
                            </View>
                            <View style={[Common.marginTop10, { width: viewWidth }]}>
                                <Text style={[AppCommon.h5, Colors.whiteFnColor]}>{item.title}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
            }.bind(this));
        } else {
            favoritesPlayedAlbumsView.push(
                <View style={[Common.marginTop20, Common.alignItmCenter, Common.justifyCenter, { width: width }]}>
                    <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Favorites Albums Found</Text>
                </View>
            );
        }
        var recentlyPlayedDataView = []
        if (this.state.recentlyPlayedDataArray.length > 0) {
            this.state.recentlyPlayedDataArray.forEach(function (item) {
                recentlyPlayedDataView.push(
                    <TouchableHighlight
                        onPress={() => { this.itemClick(item); }}
                        underlayColor={global.TRANSPARENT_COLOR}
                        style={[Common.marginTop15]}>
                        <View style={[Common.flexRow, Common.alignItmCenter]}>
                            <View style={[]}>
                                <Image style={[AppCommon.icon30]} source={require('../Images/Play_2.png')} />
                            </View>
                            <View style={[Common.marginLeft10]}>
                                <Text style={[AppCommon.h5, Colors.whiteFnColor]}>{item.title}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
            }.bind(this));
        } else {
            recentlyPlayedDataView.push(
                <View style={[Common.marginTop20, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Recently Played Found</Text>
                </View>
            );
        }
        var favoritesPlayedDataView = []
        if (this.state.favoritesDataArray.length > 0) {
            this.state.favoritesDataArray.forEach(function (item) {
                if(item.title){
                    favoritesPlayedDataView.push(
                        <TouchableHighlight
                            onPress={() => { this.itemClick(item); }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={[Common.marginTop15]}>
                            <View style={[Common.flexRow, Common.alignItmCenter]}>
                                <View style={[]}>
                                    <Image style={[AppCommon.icon30]} source={require('../Images/Play_2.png')} />
                                </View>
                                <View style={[Common.marginLeft10]}>
                                    <Text style={[AppCommon.h5, Colors.whiteFnColor]}>{item.title}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    );
                }
                
            }.bind(this));
        } else {
            favoritesPlayedDataView.push(
                <View style={[Common.marginTop20, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Favorites Found</Text>
                </View>
            );
        }
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='HomeTab' />
                <Loader visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.lightBlackBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.lightBlackBgColor} barStyle="light-content" />
                    : null}
                <ImageBackground
                    source={require('../Images/TopBarBG.png')}
                    style={[AppCommon.topViewImage]}
                    imageStyle={[AppCommon.topViewImage,]}>
                    <View style={[global.FULL_DISPLAY ? Common.marginTop60 : Common.marginTop40, Common.marginHorizontal20]}>
                        <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Good Morning{name}</Text>
                    </View>
                </ImageBackground>
                <ScrollView style={[{ width: width }]} alwaysBounceVertical={false} contentInsetAdjustmentBehavior="always" vertical={true} bounces={true}>
                    <View style={[Common.marginTop15, Common.marginHorizontal15]}>
                        <View style={[]}>
                            <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Recently Played</Text>
                        </View>
                        <View style={[Common.marginTop20, Common.flexRow, Common.alignItmCenter]}>
                            <ScrollView
                                ref={(ref) => this.tiersScroll = ref}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                alwaysBounceHorizontal={false}
                                contentInsetAdjustmentBehavior="always"
                                bounces={true}
                                style={[]}>
                                {recentlyPlayedAlbumsView}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={[Common.marginTop40, Common.marginHorizontal15]}>
                        <View style={[]}>
                            <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Favorites</Text>
                        </View>
                        <View style={[Common.marginTop20, Common.flexRow, Common.alignItmCenter]}>
                            <ScrollView
                                ref={(ref) => this.tiersScroll = ref}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                alwaysBounceHorizontal={false}
                                contentInsetAdjustmentBehavior="always"
                                bounces={true}
                                style={[]}>
                                {favoritesPlayedAlbumsView}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={[Common.marginTop40, Common.marginHorizontal15]}>
                        <View style={[]}>
                            <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Recently Played</Text>
                        </View>
                        <View style={[]}>
                            {recentlyPlayedDataView}
                        </View>
                    </View>
                    <View style={[Common.marginTop40, Common.marginHorizontal15]}>
                        <View style={[]}>
                            <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Favorites</Text>
                        </View>
                        <View style={[]}>
                            {favoritesPlayedDataView}
                        </View>
                    </View>
                    <View style={[Common.marginTop20]}></View>
                </ScrollView>
                <Modal
                    backdropOpacity={0.5}
                    animationIn={"zoomIn"}
                    animationOut={"zoomOut"}
                    onBackButtonPress={() => { this.closeRateReview() }}
                    onBackdropPress={() => { this.closeRateReview() }}
                    isVisible={this.state.showRateReview}
                    style={[Common.margin0, Common.justifyCenter, Common.alignItmCenter]}>
                    <RateReview
                        closeRateReview={() => { this.closeRateReview() }}
                        openHelpSupport={() => { this.openHelpSupport() }}
                    />
                </Modal>
                { this.props.playDetail?.name ? <SmallPlayerView playDetail={this.props.playDetail} {...this.props}/> : <View /> }
            </View >
        );
    }
}

export default WithSmallPlay(HomeTab)