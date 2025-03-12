import React, { Component } from 'react';
import { TouchableHighlight, View, Image, FlatList, StatusBar, Dimensions, Platform, BackHandler, StyleSheet } from 'react-native';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';
import SmallPlayerView from '../Components/SmallPlayerView';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';
import AlbumDetails from './AlbumsDetails'

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import HeadBar from './HeadBar';
import WithSmallPlay from '../Hoc/WithSmallPlay';

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingRight: 20,
        marginVertical: 30,
    },
});


class AlbumsList extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            callType: '',
            subCategory: {},
        }
        this.showPlayerView = this.showPlayerView.bind(this);
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const subCategory = this.props.navigation.getParam('subCategory', '')
        if (subCategory)
            this.getAlbumsData(subCategory)
    }

    backButtonClick() {
        this.props.navigation.goBack()
    }

    handleOnNavigateBack = (foo) => {
        this.setState({ foo })
    }

    getAlbumsData(subCategory) {
        this.setState({ isLoading: true });
        var query_string = ''
        query_string += "?category=" + subCategory.categoryId;
        query_string += "&subcategory=" + subCategory.id;
        query_string += "&user_id=" + global.USER_DATA.id;
        var url = encodeURI(GET_ALBUMS + query_string);

        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['album'];
                if (resultArray.length > 0) {
                    this.setState({
                        albumsArray: resultArray,
                        isLoading: false,
                        refreshList: false
                    }, () => {

                    });
                } else {
                    this.setState({ albumsArray: [], isLoading: false, refreshList: false });
                }
            }).catch(error => {
                this.setState({ albumsArray: [], isLoading: false, refreshList: false });
            });
    }

    renderItem = ({ item, index }) => {
        var viewWidth = (width - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15) - (global.IS_IPAD ? 20 : 15)) / 2
        var showLockImage = true
        if (item.is_free == '1') {
            showLockImage = false
        }
        return (
            <TouchableHighlight
                onPress={() => { this.openAlbumsDetails(item) }}
                underlayColor={global.TRANSPARENT_COLOR}
                style={[]}>
                <View style={[Common.marginLeft15, Common.borderRadius10, Common.overflowHidden, Colors.lightGreyBgColor, { width: viewWidth, marginTop: index < 2 ? 0 : 15 }]}>
                    <ProgressImage
                        source={item.image_path_256x256 ? { uri: item.image_path_256x256 } : require('../Images/album_default.png')}
                        style={[AppCommon.albumsListItemImage]}
                        imageStyle={[AppCommon.albumsListItemImage]}>
                        {showLockImage ?
                            <View style={[]}>
                                <Image source={require('../Images/lock.png')} style={[AppCommon.icon40, { tintColor: '#424244' }]} />
                            </View>
                            :
                            null}
                    </ProgressImage>
                </View>
            </TouchableHighlight>
        )
    }

    openAlbumsDetails(dataArray) {
        if (dataArray.is_free == '1' || dataArray?.lock == false) {
            this.props.navigation.navigate('AlbumsDetails', { albumDetail: dataArray })
        } else {
            if (dataArray.categoryId == '2') {
                this.props.navigation.navigate('MasterQuantumSubView', { transition: 'bottomUp' });
            } else if (dataArray.categoryId == '3') {
                this.props.navigation.navigate('HigherQuantumSubView', { transition: 'bottomUp' });
            }
        }
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

    onPressClose = () => {
        this.props.handleCloseAlbumlist()
    }

    handleCloseAlbumDetail = () => {
        this.props.handleCloseAlbumDetail()
    }

    render() {
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <HeadBar screen="AlbumsList"  {...this.props} />
                <LoaderSecond visible={this.state.isLoading} />
                <View style={[Common.marginTop10]}></View>
                <TouchableHighlight
                    style={[Common.marginLeft20, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                    underlayColor={global.TRANSPARENT_COLOR}
                    onPress={() => { this.backButtonClick() }}>
                    <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/left_arrow.png')} />
                </TouchableHighlight>
                <View style={[Common.marginTop10]}></View>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ref={ref => this.flatList = ref}
                    data={this.state.albumsArray}
                    numColumns={2}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={global.SMALL_VIEW_SHOW ? [Common.marginTop60] : []}></View>
                { this.props.playDetail?.name ? <SmallPlayerView playDetail={this.props.playDetail} {...this.props}/> : <View /> }
            </View>
        );
    }
}

export default WithSmallPlay(AlbumsList)