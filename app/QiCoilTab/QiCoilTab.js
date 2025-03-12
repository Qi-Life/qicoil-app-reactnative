
import React, { Component } from 'react';
import {
    TouchableHighlight, Text, BackHandler, View, Image, ActivityIndicator,
    FlatList, StatusBar, Dimensions, Alert, TextInput, ScrollView, ImageBackground, SectionList
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';

import SmallPlayerView from '../Components/SmallPlayerView';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

import HeadBar from './HeadBar';
import LoaderSecond from '../Components/LoaderSecond';
import WithSmallPlay from '../Hoc/WithSmallPlay';

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

class QiCoilTab extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            listsRefresh: false,
            subCategoriesArray: [],
            current_categories_id: '2',
            flatListData: [],
            keyword: '',
            showSearchView: false,
            albumSearchResults: [],
            trachSearchResults: [],
            subUnlockIds: [],
            refreshing: false,
            isShowAlbumList: false,
            thisAlbumDetail: undefined
        }
        this.searchData = debounce(this.searchData, 200);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.handleSubcategory();
    }

    componentWillReceiveProps(nextProps) {
        const { navigation } = nextProps;
        const catId = navigation.getParam('current_categories_id');
        if (catId && catId !== this.state.current_categories_id) {
            // Params have changed
            this.handleCb(catId)
        }
    }


    handleCb = (catId) => {
        this.setState({ current_categories_id: catId }, () => {
            this.handleSubcategory(true);
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    async handleSubcategory() {
        try {
            const me = await this.getMe()
            if (me) {
                global.USER_DATA.album_ids = me?.album_ids
                global.USER_DATA.category_ids = me?.category_ids
            }
        } catch (error) {
            global.USER_DATA.album_ids = []
            global.USER_DATA.category_ids = []
        }

        Promise.all([this.getSubCategories(), this.getSubUnLock()]).then((values) => {
            let subCategoriesArray = values[0].length > 0 ? values[0] : []
            const subUnlockIds = values[1]?.map(item => item.subCategoryId);
            subCategoriesArray = subCategoriesArray.map(item => {
                item.lock = !subUnlockIds.includes(item.id)
                return item;
            })

            this.setState({
                subCategoriesArray,
                isLoading: false,
                refreshList: false,
                subUnlockIds,
                refreshing: false
            }, () => {
                this.setFlatListData()
            });
        })

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

    getSubUnLock() {
        const album_ids = global.USER_DATA.album_ids
        const query_string = album_ids?.split(',').map(function (el, idx) {
            return 'ids[]=' + el;
        }).join('&');

        const url = encodeURI(GET_ALBUMS + '?' + query_string);

        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                return response?.album || []
            }).catch(error => error);
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
        const current_categories_id = this.state.current_categories_id

        this.state.subCategoriesArray.map((item, index) => {
            if (item.categoryId == current_categories_id) {

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

    navigateAlbumList = (dataArray) => {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            if (dataArray.is_free == '1' || !dataArray.lock) {
                this.props.navigation.navigate('AlbumsList', { subCategory: dataArray })
            } else {
                if (dataArray.categoryId == '2') {
                    this.props.navigation.navigate('MasterQuantumSubView', { transition: 'bottomUp' });
                } else if (dataArray.categoryId == '3') {
                    this.props.navigation.navigate('HigherQuantumSubView', { transition: 'bottomUp' });
                } else if (dataArray?.categoryId == '4') {
                    this.OpenWebView("INNER CIRCLE", global.QLIFE_STORE)
                } else {
                    /** Lyme Remission*/
                    if(dataArray?.unlockUrl){
                        this.OpenWebView(dataArray.name, dataArray?.unlockUrl)
                    }else{
                        this.OpenWebView(dataArray.name, global.QLIFE_STORE)
                    }
                }
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
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
            this.setState({
                albumArray: dataArray,
                isShowAlbumList: false,
                isShowAlbumDetail: true,
                showSearchView: false,
                isShowPlayer: false
            })
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
        const renderEmptyComponent = () => (
            <Text style={[AppCommon.h4, Colors.blackFnColor, Common.marginVertical10, Common.marginLeft15]}>No items to display</Text>
        );

        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <HeadBar screen='QiCoilTab' {...this.props} cb={this.handleCb} />
                <LoaderSecond visible={this.state.isLoading} />
                <FlatList
                    ref={ref => this.flatList = ref}
                    style={[]}
                    data={this.state.flatListData}
                    numColumns={2}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                />
                <View style={[Common.marginTop5]}></View>
                {this.props.playDetail?.name ? <SmallPlayerView playDetail={this.props.playDetail} {...this.props}/> : <View />}
            </View >
        );
    }
}

export default withNavigationFocus(WithSmallPlay(QiCoilTab))