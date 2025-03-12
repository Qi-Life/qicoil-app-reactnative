
import React, { Component } from 'react';
import {
    TouchableHighlight, Text, BackHandler, View, Image, ActivityIndicator,
    FlatList, StatusBar, Dimensions, Alert, TextInput, ScrollView, ImageBackground, SectionList
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';
import SmallPlayerView from '../Components/SmallPlayerView';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import WithHeadBar from '../Hoc/WithHeadBar';
import AppContext from '../Context/AppContext';

const { width, height } = Dimensions.get("window")

const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        const context = this;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

class HeadBar extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            listsRefresh: false,
            categoriesArray: [],
            current_categories_id: this.props.current_categories_id,
            keyword: '',
            showSearchView: false,
            albumSearchResults: [],
            trachSearchResults: [],
            subUnlockIds: [],
            refreshing: false,
        }
        this.searchData = debounce(this.searchData, 200);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.getCategories();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    getMe() {
        return fetch(global.USER_ME, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.USER_DATA?.token
            })
        }).then(res => res.json()).catch(error => error)
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
        this.setState({ foo })
        // this.getData();
    }

    getCategories(hideLoading = false) {
        if (hideLoading == false) {
            this.setState({ isLoading: true });
        }
        var query_string = ''
        query_string += "?user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_CATEGORIES + query_string);
        // console.log('getCategories ==>', url)
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['categories'];
                if (resultArray.length > 0) {
                    this.setState({
                        categoriesArray: resultArray,
                        isLoading: false,
                        refreshList: false
                    }, () => {
                    });
                } else {
                    this.setState({ categoriesArray: [], isLoading: false, refreshList: false });
                }
            }).catch(error => {
                this.setState({ categoriesArray: [], isLoading: false, refreshList: false });
            });
    }

    getSubCategories(hideLoading = false) {
        if (hideLoading == false) {
            this.setState({ isLoading: true });
        }
        var query_string = ''
        query_string += "?user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_SUB_CATEGORIES + query_string);
        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                return response?.subcategories
            }).catch(error => {
                return error
            });
    }

    setFlatListData() {
        var flatListData = []
        this.state.subCategoriesArray.map((item, index) => {
            if (item.categoryId == this.state.current_categories_id) {
                item.lock = !this.state.subUnlockIds.includes(item.id)
                flatListData.push(item)
            }
        })
        this.setState({ flatListData: flatListData });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.handleSubcategory();
    }

    navigateAlbumList = (item) => {
        this.props.navigation.navigate('AlbumsList', { subCategory: item })
    }

    renderItem = ({ item, index }) => {
        var viewWidth = (width - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15)) / 2
        var showLockImage = true
        if (item.is_free == '1' || item.lock == false) {
            showLockImage = false
        }
        return (
            <TouchableHighlight
                onPress={() => this.navigateAlbumList(item)}
                underlayColor={global.TRANSPARENT_COLOR}
                style={[]}>
                <View style={[Common.marginLeft15, Common.marginTop15, Common.borderRadius10, Common.overflowHidden, Colors.lightGreyBgColor, { width: viewWidth }]}>
                    <ProgressImage
                        source={item.image ? { uri: item.image } : null}
                        style={[AppCommon.homeViewItemImage]}
                        imageStyle={[AppCommon.homeViewItemImage]}>
                        {showLockImage ?
                            <View style={[]}>
                                <Image source={require('../Images/lock.png')} style={[AppCommon.icon30, { tintColor: '#424244' }]} />
                            </View>
                            :
                            null}
                    </ProgressImage>
                </View>
            </TouchableHighlight>
        )
    }

    OpenWebView(title = '', url = '') {
        this.props.navigation.navigate('OpenWebView', {
            title: title,
            url: url,
            transition: 'bottomUp'
        });
    }

    showPlayerView = () => {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            if (global.PLAYER_USED == 0) {
                if (global.IS_SUBSCRIBE == false) {
                    if (global.TOTAL_PLAY_TIME > 1799) {
                        this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
                        return
                    }
                }
                this.props.navigation.navigate('PlayerView', {
                    callType: 'SmallPlayerView',
                    transition: 'bottomUp',
                    onNavigateBack: this.handleOnNavigateBack.bind(this),
                });
            } else {
                this.setState({
                    isShowPlayer: true,
                    isShowAlbumDetail: false,
                    isShowAlbumList: false,
                    callType: 'SmallPlayerView'
                })
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
    }

    openSearchView() {
        this.setState({ showSearchView: true, }, () => {
            this.refs.txtSearch.focus()
        });
    }

    closeSearchView() {
        this.setState({ showSearchView: false, keyword: '', albumSearchResults: [] }, () => {
            this.refs.txtSearch.blur()
        });
    }

    searchData() {
        this.setState({ isSearchLoading: true });
        Promise.all([this.searchAlbum(), this.searchTrack()]).then((values) => {
            this.setState({ isSearchLoading: false, albumSearchResults: values[0] ? values[0] : [], trachSearchResults: values[1] ? values[1] : [] });
        })
    }

    searchAlbum = () => {
        var query_string = ''
        query_string += "?keyword=" + this.state.keyword;
        query_string += "&user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_ALBUMS + query_string);
        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['album'];
                if (resultArray.length > 0) {
                    return resultArray.filter(item => item.title != '')
                } else {
                    return []
                }
            }).catch(error => {
                return []
            });
    }

    searchTrack = () => {
        var query_string = ''
        query_string += "?keyword=" + this.state.keyword;
        query_string += "&user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_TRACK + query_string);
        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['tracks'];
                if (resultArray.length > 0) {
                    return resultArray.filter(item => item.name != '')
                } else {
                    return []
                }
            }).catch(error => {
                return []
            });
    }

    openAlbumsDetails(dataArray) {
        if (dataArray.lock == false || dataArray.is_free == 1) {
            this.props.navigation.navigate('AlbumsDetails', { albumDetail: dataArray })
        } else {
            const categoryId = dataArray?.caftegoryId
            if (dataArray.categoryId == '2') {
                this.props.navigation.navigate('MasterQuantumSubView', { transition: 'bottomUp' });
            } else if (dataArray.categoryId == '3') {
                this.props.navigation.navigate('HigherQuantumSubView', { transition: 'bottomUp' });
            } else if (dataArray?.categoryId == '4') {
                this.OpenWebView("INNER CIRCLE", global.QLIFE_STORE)
            } else {
                this.OpenWebView("SPECIAL", dataArray?.qilifestore_url)
            }
        }
    }

    onPressCategory = (evt, catId, index) => {
        const btx = evt?.nativeEvent?.locationX
        if (index == 1) {
            this.scrollRef.scrollTo({
                x: 0,
                animated: true
            });
        } else if (index == this.state.categoriesArray?.length - 1) {
            this.scrollRef.scrollToEnd({
                animated: true
            });
        } else {
            if (this.state.current_categories_id < catId) {
                this.scrollRef.scrollTo({
                    x: btx + 50,
                    animated: true
                });
            }
            if (this.state.current_categories_id > catId) {
                this.scrollRef.scrollTo({
                    x: btx - 50,
                    animated: true
                });
            }
        }
        const { setCurrentCategoryId } = this.context;
        this.setState({
            current_categories_id:catId
        })
        setCurrentCategoryId(catId);

        this.props.navigation.navigate('QiCoilTabNavigator', {
            current_categories_id: catId,
        });
        
    }

    onChangePlayStatus = (status) => {
        this.setState({ playState: status })
    }

    onChangeInputSearch = (keyword) => {
        // Perform your search or any other desired action here
        this.setState({ keyword: keyword }, () => {
            if (keyword == '') {
                this.setState({
                    isSearchLoading: false,
                    albumSearchResults: [],
                    trachSearchResults: []
                })
            } else {
                this.searchData()
            }
        });
    }

    render() {
        var categoriesView = []
        console.log('____________', this.state.current_categories_id)
        return (
            <View>
                <Notification screen={this.props.screen} />
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.lightBlackBgColor} barStyle="light-content" />
                    : null}
                <ImageBackground
                    source={require('../Images/TopBarBG.png')}
                    style={[AppCommon.qiCoilTopViewImage, Common.alignItmCenter]}
                    imageStyle={[AppCommon.qiCoilTopViewImage,]}>
                    <View style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.flexRow, Common.alignItmCenter, Common.marginHorizontal15, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius10, Colors.whiteBgColor]}>
                        <View style={[Common.justifyCenter]}>
                            <Image source={require('../Images/search.png')} style={[AppCommon.icon20, Colors.blackTnColor]} />
                        </View>
                        <View style={[Common.marginLeft10, Common.width90pr, Common.alignItmCenter, Common.justifySBetween]}>
                            <TextInput
                                style={[AppCommon.searchInput, Common.width90pr]}
                                ref='txtSearch'
                                keyboardType="default"
                                returnKeyType="default"
                                autoCapitalize='none'
                                placeholder="Search"
                                maxLength={250}
                                placeholderTextColor={global.BLACK_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { }}
                                onFocus={() => {
                                    this.openSearchView()
                                }}
                                onChangeText={(keyword) => this.onChangeInputSearch(keyword)}
                                value={this.state.keyword}
                            />
                        </View>
                        <TouchableHighlight
                            onPress={() => { this.closeSearchView() }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={this.state.showSearchView ? [Common.positionAbs, Common.right5, Common.padding5] : [Common.displayNone]}>
                            <Image source={require('../Images/close.png')} style={[AppCommon.icon20, Colors.blackTnColor]} />
                        </TouchableHighlight>
                    </View>
                    <ScrollView
                        style={[Common.marginTop10, Common.height40]}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ref={ref => this.scrollRef = ref}
                    >
                        {this.state.categoriesArray && this.state.categoriesArray != undefined ?
                            this.state.categoriesArray.map((item, index) => {
                                var viewShow = true
                                if (item.id == '1') {
                                    viewShow = false
                                }
                                if (viewShow) {
                                    categoriesView.push(
                                        <TouchableHighlight
                                            ref={ref => this.categoryRef = ref}
                                            onPress={(evt) => this.onPressCategory(evt, item?.id, index)}
                                            underlayColor={global.TRANSPARENT_COLOR}
                                            style={[index == 1 ? Common.marginLeft15 : Common.marginLeft5, Common.paddingVertical5, Common.marginRight5]}>
                                            <View style={[]}>
                                                <Text style={[AppCommon.h4, Input.fontBold, this.state.current_categories_id == item.id ? Colors.whiteFnColor : Colors.drakGreyFnColor, { textTransform: 'uppercase' }]}>{item.name}</Text>
                                                {this.state.current_categories_id == item.id ?
                                                    <LinearGradient
                                                        start={{ x: 0.0, y: 0.50 }}
                                                        end={{ x: 1.3, y: 1.0 }}
                                                        style={[Common.marginTop5, { width: "100%", height: (global.IS_IPAD ? 5 : 3) }]}
                                                        colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                                                    </LinearGradient>
                                                    :
                                                    <View style={[Common.marginTop5, { height: (global.IS_IPAD ? 5 : 3) }]}></View>
                                                }
                                            </View>
                                        </TouchableHighlight>
                                    );
                                }
                            })
                            :
                            null}
                        {categoriesView}
                    </ScrollView>
                </ImageBackground>
                <View style={this.state.showSearchView ? [Common.zIndex9, Common.positionAbs, Common.left0, Common.right0, Common.marginHorizontal15, Common.height250, Colors.whiteBgColor, { top: (global.IS_IPAD ? 100 : 100) }] : [Common.displayNone]}>
                    <View style={{
                        flex: 1,
                        paddingTop: 22,
                        zIndex: 10,
                    }}>
                        {this.state.isSearchLoading ? <ActivityIndicator size="large" /> :
                            (this.state.albumSearchResults?.length || this.state.trachSearchResults?.length) ?
                                <SectionList
                                    sections={[
                                        {
                                            title: 'Albums', data: this.state.albumSearchResults
                                        },
                                        {
                                            title: 'Tracks',
                                            data: this.state.trachSearchResults,
                                        },
                                    ]}
                                    renderItem={({ item, index }) => <TouchableHighlight
                                        onPress={() => {
                                            this.openAlbumsDetails({
                                                ...item,
                                                image_path: item.name ? item.image : item.image_path,
                                                id: item.name ? item.album_id : item.id
                                            })
                                        }}
                                        underlayColor={global.TRANSPARENT_COLOR}
                                        style={[Common.marginHorizontal15]}>
                                        <Text style={[AppCommon.h4, Colors.blackFnColor, Common.marginVertical10, Common.marginLeft15]}>{item.name ? item.filename : item.title}</Text>
                                    </TouchableHighlight>}
                                    renderSectionHeader={({ section }) => (
                                        section.data.length > 0 ? (
                                            <Text style={[AppCommon.h4, Colors.blackFnColor, Common.marginHorizontal15, Common.marginVertical10, { fontWeight: 'bold' }]}>{section.title}</Text>
                                        ) : (null)
                                    )}
                                    keyExtractor={(item, index) => `basicListEntry-${index}`}
                                />
                                : <View><Text style={[AppCommon.h4, Colors.blackFnColor, Common.marginVertical10, Common.marginLeft15]}>No Item for display</Text></View>

                        }
                    </View>
                </View>
            </View >
        );
    }
}

export default WithHeadBar(HeadBar)