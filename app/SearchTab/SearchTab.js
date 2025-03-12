
import React, { Component } from 'react';
import { TouchableHighlight, Text, BackHandler, View, SafeAreaView, Image, FlatList, StatusBar, RefreshControl, Dimensions, Alert, TextInput, ScrollView, ImageBackground } from 'react-native';
import { AlphabetList } from "react-native-section-alphabet-list";
import AsyncStorage from '@react-native-community/async-storage';
import Frequency from 'react-native-frequency';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';
import SmallPlayerView from '../Components/SmallPlayerView';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const { width, height } = Dimensions.get("window")

export default class SearchTab extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            listsRefresh: false,
            keyword: '',
            frequenciesArray: [],
            recentlySearchesDataArray: [],
            selectLetter: '#',
            groupby: '',
        }
        this.offset = 1;
        this.onEndReachedCalledDuringMomentum = false;
        this.showPlayerView = this.showPlayerView.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({ selectLetter: '#', groupby: '', keyword: '', }, () => {
            this.getRecentlySearches()
            this.getFrequencies();
            this.getFavorites()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selectLetter: '#', groupby: '', keyword: '', }, () => {
            this.getRecentlySearches()
            this.getFrequencies(1, true);
            this.getFavorites()
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
        this.getRecentlySearches()
        // this.getFrequencies();
        this.getFavorites()
    }

    getRecentlySearches() {
        AsyncStorage.getItem('recentlySearchesDataArray', (err, recentlySearchesDataArray) => {
            var oldSearchesDataArray = JSON.parse(recentlySearchesDataArray)
            if (oldSearchesDataArray != null && oldSearchesDataArray != undefined) {
                this.setState({ recentlySearchesDataArray: oldSearchesDataArray })
            } else {
                this.setState({ recentlySearchesDataArray: [] })
            }
        });
    }

    getFavorites() {
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
                let resultArray = response['favorite'];
                if (resultArray.length > 0) {
                    global.FAVORITES_DATA = resultArray
                    this.setState({ favoritesDataArray: resultArray })
                } else {
                    global.FAVORITES_DATA = []
                    this.setState({ favoritesDataArray: [] });
                }
            }).catch(error => {
                global.FAVORITES_DATA = []
                this.setState({ favoritesDataArray: [] });
            });
    }

    searchItemClick(dataArray) {
        this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
    }

    clearClick() {
        AsyncStorage.setItem('recentlySearchesDataArray', '', () => {
            this.getRecentlySearches()
        });
    }

    getFrequencies(page = 1, hideLoading = false) {
        if (hideLoading == false) {
            this.setState({ isLoading: true });
        }
        var query_string = ''
        query_string += "?page_no=" + page;
        query_string += "&keyword=" + this.state.keyword;
        query_string += "&groupby=" + this.state.groupby;
        query_string += "&category=1";
        var url = encodeURI(GET_FREQUENCIES + query_string);
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => {
                let resultArray = response['frequencies'];
                if (resultArray.length > 0) {
                    this.offset = page + 1;
                    if (page == 1) {
                        this.setState({
                            frequenciesArray: resultArray,
                            isLoading: false,
                            refreshList: false
                        }, () => {

                        });
                    } else {
                        this.setState(state => ({
                            frequenciesArray: [...state.frequenciesArray, ...resultArray],
                            isLoading: false,
                            listsRefresh: false
                        }));
                    }
                } else {
                    if (page == 1) {
                        this.setState({ frequenciesArray: [], isLoading: false, refreshList: false });
                    } else {
                        this.setState({ isLoading: false, refreshList: false });
                    }
                }
            }).catch(error => {
                this.setState({ frequenciesArray: [], isLoading: false, refreshList: false });
            });
    }

    renderItem = ({ item, index }) => {
        return (
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

    itemClick(dataArray) {
        if (this.state.keyword) {
            AsyncStorage.getItem('recentlySearchesDataArray', (err, recentlySearchesDataArray) => {
                var oldSearchesDataArray = JSON.parse(recentlySearchesDataArray)
                var tempDataArray = []
                if (oldSearchesDataArray != null && oldSearchesDataArray != undefined) {
                    var item = []
                    var checkFlag = 0
                    oldSearchesDataArray = oldSearchesDataArray.reverse()
                    for (var i = 0; i < oldSearchesDataArray.length; ++i) {
                        if (i < 4) {
                            item = oldSearchesDataArray[i];
                            if (item.id == dataArray.id) {
                                checkFlag = 1
                            } else if (i > oldSearchesDataArray.length - 4) {
                                tempDataArray = [{ 'id': item.id, 'title': item.title, 'frequencies': item.frequencies }, ...tempDataArray];
                            }
                        }
                    }
                    if (checkFlag == 0) {
                        tempDataArray = [{ 'id': dataArray.id, 'title': dataArray.title, 'frequencies': dataArray.frequencies }, ...tempDataArray];
                        AsyncStorage.setItem('recentlySearchesDataArray', JSON.stringify(tempDataArray), () => {
                            this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
                        });
                    } else {
                        this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
                    }
                } else {
                    tempDataArray.push({ 'id': dataArray.id, 'title': dataArray.title, 'frequencies': dataArray.frequencies })
                    AsyncStorage.setItem('recentlySearchesDataArray', JSON.stringify(tempDataArray), () => {
                        this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
                    });
                }
            });
        } else {
            this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
        }
    }

    openPlayerView(id, title, strFrequencies = '') {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            if (global.IS_SUBSCRIBE == false) {
                if (global.TOTAL_PLAY_TIME > 1799) {
                    this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
                    return
                }
            }
            if (strFrequencies && strFrequencies != undefined) {
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
                var frequenciesArray = strFrequencies.split("/");
                this.props.navigation.navigate('PlayerView', {
                    callType: 'SelectItem',
                    id: id,
                    title: title,
                    strFrequencies: strFrequencies,
                    playData: frequenciesArray,
                    transition: 'bottomUp',
                    onNavigateBack: this.handleOnNavigateBack.bind(this),
                });
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
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
                global.TAB_INDEX = 1
                this.props.navigation.navigate('QiCoilTabNavigator', {
                    callType: 'SmallPlayerView',
                    openPlayer: true,
                    transition: 'bottomUp',
                    onNavigateBack: this.handleOnNavigateBack.bind(this),
                });
            }
        } else {
            this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
    }

    handleEnd = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.getFrequencies(this.offset);
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    refreshList() {
        this.offset = 1;
        this.setState({ refreshList: true, frequenciesArray: [] }, () => {
            this.getFrequencies(1);
        });
        this.setState({ refreshList: false });
    }

    ListEmptyView = () => {
        return (
            <View style={[Common.marginTop10, Common.paddingHorizontal30, Common.flex1, Common.flexColumn, Common.justifyCenter, Common.alignItmCenter]}>
                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Frequencies Found</Text>
            </View>
        );
    }

    alphabetItemClick(letter) {
        var groupby = ''
        if (letter != '#') {
            groupby = letter
        }
        this.setState({ selectLetter: letter, groupby: groupby }, () => {
            this.getFrequencies()
        });
    }

    render() {
        var recentlySearchesDataView = []
        if (this.state.recentlySearchesDataArray.length > 0) {
            this.state.recentlySearchesDataArray.forEach(function (item) {
                recentlySearchesDataView.push(
                    <TouchableHighlight
                        onPress={() => { this.searchItemClick(item); }}
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
            recentlySearchesDataView.push(
                <View style={[Common.paddingVertical25, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h4, Colors.whiteFnColor]}>No Recently Searches Found</Text>
                </View>
            );
        }
        var alphabetTop = 0
        var alphabetHeight = 0
        if (global.FULL_DISPLAY) {
            alphabetTop = global.Gap_50 + global.Gap_50 + global.Gap_50
            alphabetHeight = height - alphabetTop - global.Tab_Bar_Height - global.Gap_40
        } else {
            alphabetTop = global.Gap_50 + global.Gap_50 + global.Gap_40
            alphabetHeight = height - alphabetTop - global.Tab_Bar_Height - global.Gap_10
        }
        var alphabetView = []
        var alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var alphabetLetterViewhHeight = alphabetHeight / 27
        alphabet.forEach(function (letter, index) {
            alphabetView.push(
                <TouchableHighlight
                    onPress={() => { this.alphabetItemClick(letter); }}
                    underlayColor={global.TRANSPARENT_COLOR}
                    style={[Common.paddingHorizontal5, Common.justifyCenter, Common.alignItmCenter, { height: alphabetLetterViewhHeight }]}>
                    <Text style={[AppCommon.h5, this.state.selectLetter == letter ? Colors.defaultFnColor : Colors.whiteFnColor]}>{letter}</Text>
                </TouchableHighlight>
            );
        }.bind(this));
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='SearchTab' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.lightBlackBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.lightBlackBgColor} barStyle="light-content" />
                    : null}
                <ImageBackground
                    source={require('../Images/TopBarBG.png')}
                    style={[AppCommon.topViewImage, Common.alignItmCenter]}
                    imageStyle={[AppCommon.topViewImage,]}>
                    <View style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.flexRow, Common.alignItmCenter, Common.marginHorizontal15, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius10, Colors.whiteBgColor]}>
                        <View style={[Common.justifyCenter]}>
                            <Image source={require('../Images/search.png')} style={[AppCommon.icon20, Colors.blackTnColor]} />
                        </View>
                        <View style={[Common.marginLeft10, Common.width90pr, Common.alignItmCenter, Common.justifySBetween]}>
                            <TextInput
                                style={[AppCommon.searchInput, Common.width95pr]}
                                ref='txtSearch'
                                keyboardType="default"
                                returnKeyType="go"
                                autoCapitalize='none'
                                placeholder="Search"
                                maxLength={250}
                                placeholderTextColor={global.BLACK_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { }}
                                onChangeText={(keyword) => {
                                    this.setState({ keyword: keyword }, () => {
                                        this.getFrequencies()
                                    })
                                }}
                                value={this.state.keyword}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <View style={[Common.marginTop15, Common.marginHorizontal15]}>
                    <View style={[Common.flexRow, Common.justifySBetween]}>
                        <View style={[]}>
                            <Text style={[AppCommon.h4, Input.fontBold, Colors.whiteFnColor]}>Recent Searches</Text>
                        </View>
                        <TouchableHighlight
                            onPress={() => { this.clearClick(); }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={[]}>
                            <Text style={[AppCommon.h5, Input.fontBold, Colors.greyFnColor]}>CLEAR</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[Common.marginTop15]}>
                        {recentlySearchesDataView}
                    </View>
                </View >
                <View style={[Common.marginHorizontal15, Common.marginVertical15]}>
                    <Text style={[AppCommon.h4, Input.fontBold, Colors.whiteFnColor]}>Frequencies</Text>
                </View>
                <FlatList
                    ref={ref => this.flatList = ref}
                    style={[Common.marginHorizontal15]}
                    data={this.state.frequenciesArray}
                    numColumns={1}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.state.frequenciesArray.length < 1 && this.state.isLoading == false ? this.ListEmptyView : null}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    // ListHeaderComponent={this.renderListHeader}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    onEndReached={() => { this.handleEnd() }}
                    refreshControl={
                        <RefreshControl
                            tintColor={global.DEFAULT_COLOR}
                            refreshing={this.state.listsRefresh}
                            onRefresh={this.refreshList.bind(this)}
                        />
                    }
                />
                <View style={[Common.positionAbs, Common.right15, Common.zIndex9999, {
                    top: alphabetTop,
                    height: alphabetHeight,
                }]}>
                    {alphabetView}
                </View>
                <SmallPlayerView screen='SearchTab' showPlayerView={this.showPlayerView} />
            </View >
        );
    }
}