import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, FlatList, StatusBar, Dimensions, Platform, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBlobUtil from 'react-native-blob-util';

import LoaderSecond from '../Components/LoaderSecond';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import HeadBar from './HeadBar';
import SmallPlayerView from '../Components/SmallPlayerView';
import WithSmallPlay from '../Hoc/WithSmallPlay';

class AlbumsDetails extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            callType: '',
            albumArray: {},
            tracksArray: [],
            isFavorite: 0,
        }
        this.showPlayerView = this.showPlayerView.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const albumArray = this.props.navigation.getParam('albumDetail', '')
        this.setState({
            albumArray,
        }, () => {
            this.checkIsFavorite()
            this.getTracksData()
        });
    }

    componentWillReceiveProps(nextProps) {
        const albumArray = nextProps.navigation.getParam('albumDetail', '')
        if (albumArray?.id != this.props.albumArray?.id) {
            this.setState({
                albumArray: albumArray,
            }, () => {
                this.checkIsFavorite()
                this.getTracksData()
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }


    handleOnNavigateBack = (foo) => {
        this.props.navigation.goBack()
    }

    backButtonClick() {
        if (this.props.navigation.getParam('callType', '') == 'AlbumsList') {
            this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
        } else {
            this.handleCloseScreen()
        }
    }

    handleCloseScreen = () => {
        const { handleCloseAlbumDetail } = this.props
        if (handleCloseAlbumDetail) {
            handleCloseAlbumDetail()
        } else {
            this.props.navigation.goBack()
        }
    }

    checkIsFavorite() {
        var isFavorite = 0
        for (var i = 0; i < global.FAVORITES_ALBUMS.length; ++i) {
            const item = global.FAVORITES_ALBUMS[i];
            if (item.id == this.state.albumArray?.id) {
                isFavorite = 1
                break;
            }
        }
        this.setState({ isFavorite: isFavorite })
    }

    getTracksData(hideLoading = false) {
        if (hideLoading == false) {
            this.setState({ isLoading: true });
        } var query_string = ''
        query_string += "?albumid=" + this.state.albumArray?.id;
        query_string += "&user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_TRACK + query_string);
        console.log('getTracksData ==>', url)
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['tracks'];
                if (resultArray.length > 0) {
                    this.setState({
                        tracksArray: resultArray,
                        isLoading: false,
                    }, () => {
                        // this.setState(state => ({
                        //     tracksArray: [...state.tracksArray, ...resultArray],
                        //     isLoading: false,
                        //     listsRefresh: false
                        // }));
                    });
                } else {
                    this.setState({ tracksArray: [], isLoading: false });
                }
            }).catch(error => {
                this.setState({ tracksArray: [], isLoading: false });
            });
    }

    renderItem = ({ item, index }) => {
        const { navigate } = this.props.navigation;

        return (
            <TouchableHighlight
                onPress={() => { this.playClick(index) }}
                underlayColor={global.TRANSPARENT_COLOR}
                style={[]}>
                <View style={[index == 0 ? Common.marginTop7 : Common.marginTop0, Common.flexRow, Common.alignItmCenter, Common.paddingHorizontal15, Common.paddingVertical7]}>
                    <View style={[]}>
                        <Text style={[AppCommon.h4, Colors.whiteFnColor]}>{index + 1}</Text>
                    </View>
                    <View style={[Common.flex09, Common.paddingLeft10]}>
                        <Text style={[AppCommon.h4, global.PLAY_SUB_TITLE == item.name ? Colors.defaultFnColor : Colors.whiteFnColor]}>{item.name}</Text>
                        <Text style={[AppCommon.h5, Colors.lightGreyFnColor]}>5:00</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    playClick(playIndex = 0) {
        this.props.navigation.navigate('QiCoilPlayer', { albumDetail: this.state.albumArray, playData: this.state.tracksArray, playIndex })
    }

    showPlayerView() {
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
                this.props.navigation.navigate('QiCoilPlayer', {
                    callType: 'SmallPlayerView',
                    transition: 'bottomUp',
                    onNavigateBack: this.handleOnNavigateBack.bind(this),
                });
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
    }

    favoriteClick() {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            var isFavorite = this.state.isFavorite == 1 ? 0 : 1
            this.setState({ isFavorite: isFavorite }, () => {
                var authorization = ""
                if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
                    authorization += "Bearer " + global.USER_DATA.token
                }
                var data_Array = [];
                data_Array.push({ name: 'is_favorite', data: isFavorite.toString() });
                data_Array.push({ name: 'albumid', data: this.state.albumArray?.id?.toString() });
                ReactNativeBlobUtil.fetch('POST', global.SAVE_FAVORITE_ALBUMS, {
                    'Content-Type': 'multipart/form-data', 'Authorization': authorization,
                }, data_Array).then((response) => {
                    response = response.json();
                    let resultArray = response['favorite'];
                    if (resultArray.length > 0) {
                        var dataArray = resultArray[0];
                        if (dataArray.fetch_flag != "1") {
                            isFavorite = this.state.isFavorite == 1 ? 0 : 1
                            this.setState({ isFavorite: isFavorite })
                        }
                    } else {
                        isFavorite = this.state.isFavorite == 1 ? 0 : 1
                        this.setState({ isFavorite: isFavorite })
                    }
                }).catch((error) => {
                    isFavorite = this.state.isFavorite == 1 ? 0 : 1
                    this.setState({ isFavorite: isFavorite })
                });
            })
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
    }


    render() {
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <HeadBar screen='QicoilPlayer' {...this.props} />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.fullLightBlackBgColor]}>
                    </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.fullLightBlackBgColor} barStyle="light-content" />
                    : null}
                <View style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.flexRow, Common.justifySBetween]}>
                    <TouchableHighlight
                        style={[Common.marginLeft20, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.backButtonClick() }}>
                        <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/left_arrow.png')} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Common.marginRight20, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.favoriteClick() }}>
                        <Image style={[AppCommon.icon20, Common.marginTop2]} source={this.state.isFavorite == 1 ? require('../Images/heart.png') : require('../Images/heart_2.png')} />
                    </TouchableHighlight>
                </View>
                <View style={[Common.marginTop15, Common.justifyCenter, Common.alignItmCenter]}>
                    <ProgressImage
                        source={this.state.albumArray?.image_path ? { uri: this.state.albumArray?.image_path } : require('../Images/album_default.png')}
                        style={[AppCommon.albumsListItemImage, Common.borderRadius10, Colors.lightGreyBgColor]}
                        imageStyle={[AppCommon.albumsListItemImage, Common.borderRadius10, Colors.lightGreyBgColor]}>
                    </ProgressImage>
                </View>
                <View style={[Common.marginTop15, Common.marginHorizontal40, Common.justifyCenter, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h1, Input.fontBold, Input.textCenter, Colors.whiteFnColor,]}>{this.state.albumArray?.title}</Text>
                </View>
                <View style={[Common.marginTop15, Common.marginHorizontal40, Common.justifyCenter, Common.alignItmCenter]}>
                    <TouchableHighlight
                        onPress={() => { this.playClick(0) }}
                        underlayColor={global.TRANSPARENT_COLOR}
                        style={[]}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.50 }}
                            end={{ x: 1.7, y: 1.0 }}
                            style={[Common.width160, Common.height45, Common.borderRadius25]}
                            colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                            <View style={[Common.flexRow, Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
                                <Image style={[AppCommon.icon18, Colors.whiteTnColor]} source={require('../Images/play.png')} />
                                <Text style={[Common.marginLeft7, AppCommon.h4, Input.fontBold, Colors.whiteFnColor,]}>PLAY</Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>
                <View style={[Common.marginTop15, Common.marginHorizontal40, Common.justifyCenter, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h5, Input.textCenter, Colors.lightGreyFnColor]}>{this.state.tracksArray.length} Tracks, {this.state.tracksArray.length * 5} min</Text>
                </View>
                <FlatList
                    style={[Common.marginTop15, Common.marginHorizontal20, Common.borderRadius10, Colors.drakGreyBgColor, {
                        flexGrow: 0,
                        minHeight: 150,
                    }]}
                    ref={ref => this.flatList = ref}
                    data={this.state.tracksArray}
                    numColumns={1}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                />
                <View style={[Common.marginTop20]}></View>
                {this.props.playDetail?.name ? <SmallPlayerView playDetail={this.props.playDetail} {...this.props} /> : <View />}
            </View>
        );
    }
}

export default WithSmallPlay(AlbumsDetails)