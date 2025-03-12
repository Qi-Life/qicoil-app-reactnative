
import React, { Component } from 'react';
import { TouchableHighlight, Text, BackHandler, View, Image, FlatList, ImageBackground, StatusBar, Dimensions, Alert, TextInput, ScrollView, SectionList } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Frequency from 'react-native-frequency';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

import Notification from '../Components/Notification';
import Loader from '../Components/Loader';
import LoaderSecond from '../Components/LoaderSecond';
import SmallPlayerView from '../Components/SmallPlayerView';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import frequencyDataJson from '../Networking/frequency.json';
import BackgroundTimer from 'react-native-background-timer';
import WithSmallPlay from '../Hoc/WithSmallPlay';



const { width, height } = Dimensions.get("window")

class FrequenciesTab extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            showView: 'SearchTab',  // SearchTab // FrequenciesTab 
            listsRefresh: false,
            keyword: '',
            frequenciesCache: [],
            frequenciesArray: [],
            recentlySearchesDataArray: [],
            selectLetter: '#',
            groupby: '',
            selectedFrequenciesType: 1,
            frequenciesValue: 284.95,
            firstSelectValue: 284,
            firstSliderValueMin: 5,
            firstSliderValueMix: 22000,
            secondSliderValueMin: 279.95,
            secondSliderValueMix: 289.95,
            isPlay: false,
            selectRange: 'All', // All || 5-500 hz || 500-1k || 1k-3k || 3k-11k || 11k-28k
        }
        this.offset = 1;
        this.onEndReachedCalledDuringMomentum = false;
        this.sliderValuesChange = this.sliderValuesChange.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({ showView: 'SearchTab', selectLetter: '', groupby: '', keyword: '', isPlay: global.FREQUENCIES_TAB_IS_PLAY, isLoading: true }, () => {
            this.getRecentlySearches()
            this.getFavorites();
            this.getFrequenciesCache()
        })
    }

    getFrequenciesCache = (letter = '#') => {
        if (!letter || letter == '#') {
            letter = undefined
        }
        AsyncStorage.getItem('frequencies_cache', (err, data) => {
            if (err) {
                this.setState({
                    isLoading: false
                })
            } else {
                let frequenciesData = JSON.parse(data)
                frequencyData = this.enhanceFrequencies(frequenciesData?.data, letter)
                this.setState({
                    frequenciesCache: Object.values(frequencyData),
                    frequenciesArray: Object.values(frequencyData),
                    isLoading: false
                })
            }

        })
    }

    enhanceFrequencies = (data, letter) => {
        try {
            return data.reduce((r, e) => {
                // get first letter of name of current element
                let title = e.title[0];
                if (/^-?\d+$/.test(title) == false) {
                    if (letter && letter.toLocaleLowerCase() != title.toLowerCase()) {
                        return r
                    }
                    // if there is no property in accumulator with this letter create it
                    if (!r[title]) r[title] = { title, data: [e] }
                    // if there is push current element to children array for that letter
                    else r[title].data.push(e);
                    // return accumulator
                }
                return r;
            }, {})
        } catch (error) {
            AsyncStorage.setItem('frequencies_cache', JSON.stringify({
                data: frequencyDataJson.frequencies,
                lastUpdated: ''
            }))
            return []
        }

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
                this.setState({
                    frequenciesArray: this.enhanceFrequencies(resultArray)
                })

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
            const newItem = { 'id': dataArray.id, 'title': dataArray.title, 'frequencies': dataArray.frequencies }
            let oldSearchArr = this.state.recentlySearchesDataArray
            oldSearchArr = oldSearchArr.filter(item => item.id !== newItem.id);
            const updatedItems = [newItem, ...oldSearchArr].slice(0, 4);
            this.setState({
                recentlySearchesDataArray: updatedItems
            })
            AsyncStorage.setItem('recentlySearchesDataArray', JSON.stringify(updatedItems))
        }
        this.openPlayerView(dataArray.id, dataArray.title, dataArray.frequencies)
    }

    _getMe() {
        const self = this
        return fetch(global.USER_ME, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.USER_DATA.token
            })
        }).then(res => {
            if (!res.ok && res.status == 404) {
                Alert.alert(
                    'Error message',
                    'Your session has expired, please login',
                )
                logoutData();
                return undefined;
            }
            return res.json()
        }).catch(error => {
            return undefined
        })
    }

    async openPlayerView(id, title, strFrequencies = '') {
        const userProfile = await this._getMe();
        if (!userProfile) {
            return this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
        }
        const userCategoryIds = userProfile?.category_ids?.split(',')
        global.IS_SUBSCRIBE = !!userCategoryIds?.includes("1")
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
                    BackgroundTimer.clearInterval(global.INTERVAL);
                    global.PLAY_SOUND.stop();
                }
                global.CURRENT_SECONDS = 0
                var frequenciesArray = strFrequencies.split("/").filter(item => +item < 22000 && +item > 0);
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
        this.offset = 1;
        if (letter != '#') {
            groupby = letter
        }
        const frequenciesData = letter == '#' ? this.state.frequenciesCache : this.state.frequenciesCache.filter(item => item.title.toLowerCase() == letter.toLowerCase())
        this.setState({
            selectLetter: letter,
            frequenciesArray: frequenciesData
        }, () => {
            this.sectionListRef.scrollToLocation({
                animated: true,
                itemIndex: 0,
                sectionIndex: 0,
                viewPosition: 0
            })
        })
    }

    handleSearch = () => {
        let searchData = [];
        this.state.frequenciesCache.map((item, index) => {
            item.data.map(_item => {
                if (_item.title.toLowerCase().includes(this.state.keyword.toLowerCase())) {
                    searchData.push(_item)
                }
            })

        })
        searchData = this.enhanceFrequencies(searchData)
        this.setState({
            isLoading: false,
            frequenciesArray: Object.values(searchData)
        })
    }

    sliderRangeChange(callType) {
        this.stopFrequency()
        if (callType == 'All') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 284.95,
                firstSelectValue: 284,
                firstSliderValueMin: 5,
                firstSliderValueMix: 28001,
                secondSliderValueMin: 279.95,
                secondSliderValueMix: 289.95,
            });
        } else if (callType == '5-500 hz') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 252.50,
                firstSelectValue: 252,
                firstSliderValueMin: 5,
                firstSliderValueMix: 501,
                secondSliderValueMin: 247.50,
                secondSliderValueMix: 257.50,
            });
        } else if (callType == '500-1k') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 750.00,
                firstSelectValue: 750,
                firstSliderValueMin: 500,
                firstSliderValueMix: 1001,
                secondSliderValueMin: 745.00,
                secondSliderValueMix: 755.00,
            });
        } else if (callType == '1k-3k') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 2000.00,
                firstSelectValue: 2000,
                firstSliderValueMin: 1000,
                firstSliderValueMix: 3001,
                secondSliderValueMin: 1995.00,
                secondSliderValueMix: 2005.00,
            });;
        } else if (callType == '3k-11k') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 7000.00,
                firstSelectValue: 7000,
                firstSliderValueMin: 3000,
                firstSliderValueMix: 11001,
                secondSliderValueMin: 6995.00,
                secondSliderValueMix: 7005.00,
            });
        } else if (callType == '11k-28k') {
            this.setState({
                selectRange: callType,
                frequenciesValue: 19500.00,
                firstSelectValue: 19500,
                firstSliderValueMin: 11000,
                firstSliderValueMix: 28001,
                secondSliderValueMin: 19495.00,
                secondSliderValueMix: 19505.00,
            });
        }
    }

    frequenciesValuesChange(callType) {
        this.stopFrequency()
        var frequenciesValue = this.state.frequenciesValue
        var secondSliderValueMin = 0.00
        var secondSliderValueMix = 0.00
        if (this.state.selectRange == 'All') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 279.95
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 279.95
            }
            if (frequenciesValue < 5) {
                frequenciesValue = 5.00
            } else if (frequenciesValue > 22000) {
                frequenciesValue = 22000.00
            }
        } else if (this.state.selectRange == '5-500 hz') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 4.95
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 4.95
            }
            if (frequenciesValue < 5) {
                frequenciesValue = 5.00
            } else if (frequenciesValue > 500) {
                frequenciesValue = 500.00
            }
        } else if (this.state.selectRange == '500-1k') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 5
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 5
            }
            if (frequenciesValue < 500) {
                frequenciesValue = 500.00
            } else if (frequenciesValue > 1000) {
                frequenciesValue = 1000.00
            }
        } else if (this.state.selectRange == '1k-3k') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 20
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 20
            }
            if (frequenciesValue < 1000) {
                frequenciesValue = 1000.00
            } else if (frequenciesValue > 3000) {
                frequenciesValue = 3000.00
            }
        } else if (this.state.selectRange == '3k-11k') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 80
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 80
            }
            if (frequenciesValue < 3000) {
                frequenciesValue = 3000.00
            } else if (frequenciesValue > 11000) {
                frequenciesValue = 11000.00
            }
        } else if (this.state.selectRange == '11k-22k') {
            if (callType == 'plus') {
                frequenciesValue = frequenciesValue + 170
            } else if (callType == 'minus') {
                frequenciesValue = frequenciesValue - 170
            }
            if (frequenciesValue < 11000) {
                frequenciesValue = 11000.00
            } else if (frequenciesValue > 22000) {
                frequenciesValue = 22000.00
            }
        }
        let strFrequenciesValue = frequenciesValue.toFixed(2)
        let strArray = strFrequenciesValue.split(".");
        firstSelectValue = parseFloat(strArray[0])
        secondSliderValueMin = frequenciesValue - 5
        secondSliderValueMix = frequenciesValue + 5
        this.setState({
            frequenciesValue: frequenciesValue,
            firstSelectValue: firstSelectValue,
            secondSliderValueMin: secondSliderValueMin,
            secondSliderValueMix: secondSliderValueMix,
        });
    }

    sliderValuesChange(callType, value) {
        this.stopFrequency()
        var frequenciesValue = 0.00
        var firstSelectValue = 0.00
        var secondSliderValueMin = 0.00
        var secondSliderValueMix = 0.00
        var tempFirstSelectValue = 0
        var tempSecondSelectValue = 0
        var tempArray
        if (callType == 'first') {
            if (parseFloat(value) >= 22000) {
                firstSelectValue = 22000
                tempSecondSelectValue = 0
            } else {
                firstSelectValue = parseFloat(value)
                tempArray = this.state.frequenciesValue.toString().split(".");
                if (tempArray.length > 1) {
                    tempSecondSelectValue = parseFloat(tempArray[1] / 100)
                }
                tempSecondSelectValue = 0
            }
            frequenciesValue = firstSelectValue + tempSecondSelectValue
            secondSliderValueMin = frequenciesValue - 5
            secondSliderValueMix = frequenciesValue + 5
        } else {
            if (parseFloat(value) >= 22000) {
                firstSelectValue = 22000
                frequenciesValue = 22000.00
                secondSliderValueMin = 27995.00 - 5
                secondSliderValueMix = 28005.00 + 5
            } else {
                tempArray = value.toString().split(".");
                tempFirstSelectValue = parseFloat(tempArray[0])
                firstSelectValue = tempFirstSelectValue
                frequenciesValue = parseFloat(value)
                secondSliderValueMin = parseFloat(value) - 5
                secondSliderValueMix = parseFloat(value) + 5
            }

        }
        this.setState({
            frequenciesValue: frequenciesValue,
            firstSelectValue: firstSelectValue,
            secondSliderValueMin: secondSliderValueMin,
            secondSliderValueMix: secondSliderValueMix,
        });
    }

    playClick() {
        if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
            if (global.IS_SUBSCRIBE == false) {
                if (global.TOTAL_PLAY_TIME > 1799) {
                    this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
                    return
                }
            }
        }
        if (this.state.isPlay) {
            this.stopFrequency()
        } else {
            Frequency.playFrequency(parseFloat(this.state.frequenciesValue), 180000)
                .then(response => {
                    // console.log("response ==>", response)
                    // 60000
                    global.FREQUENCIES_TAB_IS_PLAY = false
                    this.setState({ isPlay: false });
                })
                .catch(error => {
                    // console.log("error ==>", error)
                });
            global.PLAYER_USED = 0
            if (global.PLAY_SOUND != null) {
                global.PLAY_SOUND.stop()
                global.PLAY_SOUND = null
            }
            if (global.IS_PLAY) {
                global.IS_PLAY = false
                global.PLAY_SUB_TITLE = ''
                global.SMALL_VIEW_SHOW = false
                global.SMALL_VIEW_IS_PLAY = false
                global.SMALL_VIEW_TEXT = ''
                clearInterval(global.INTERVAL);
            }
            global.FREQUENCIES_TAB_IS_PLAY = true
            this.setState({ isPlay: true });
        }

    }

    stopFrequency() {
        if (this.state.isPlay) {
            Frequency.stop()
            global.FREQUENCIES_TAB_IS_PLAY = false
            this.setState({ isPlay: false });
        }
    }

    changeShowView(showView) {
        this.setState({ showView: showView });
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20; // Adjust this value as needed
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };


    render() {
        if (this.state.showView == 'SearchTab') {
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
                alphabetTop = global.Gap_50 + global.Gap_50 + global.Gap_50 + global.Gap_20
                alphabetHeight = height - alphabetTop - global.Tab_Bar_Height - global.Gap_40 - global.Gap_20
            } else {
                alphabetTop = global.Gap_50 + global.Gap_50 + global.Gap_40 + global.Gap_20
                alphabetHeight = height - alphabetTop - global.Tab_Bar_Height - global.Gap_10 - global.Gap_20
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

            const styles = {

            }

            return (
                <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                    <Notification screen='SearchTab' />
                    <LoaderSecond visible={this.state.isLoading} />
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
                                        this.setState({ keyword: keyword, isLoading: true }, () => {
                                            this.handleSearch(keyword)
                                        })
                                    }}
                                    value={this.state.keyword}
                                />
                            </View>
                        </View>
                        <View style={[Platform.OS == 'ios' ? Common.marginTop10 : Common.marginTop5, Common.flexRow, Common.justifyCenter, Common.alignItmCenter, Common.height40]}>
                            <TouchableHighlight
                                onPress={() => { this.changeShowView('SearchTab') }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.paddingVertical5, Common.marginRight5]}>
                                <View style={[Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Input.fontBold, this.state.showView == 'SearchTab' ? Colors.whiteFnColor : Colors.drakGreyFnColor]}>PROGRAMS</Text>
                                    {this.state.showView == 'SearchTab' ?
                                        <LinearGradient
                                            start={{ x: 0.0, y: 0.50 }}
                                            end={{ x: 1.3, y: 1.0 }}
                                            style={[Common.marginTop5, { width: "60%", height: (global.IS_IPAD ? 5 : 3) }]}
                                            colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                                        </LinearGradient>
                                        :
                                        <View style={[Common.marginTop5, { height: (global.IS_IPAD ? 5 : 3) }]}></View>
                                    }
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => { this.changeShowView('FrequenciesTab') }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.marginLeft30, Common.paddingVertical5, Common.marginRight5]}>
                                <View style={[Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Input.fontBold, this.state.showView == 'FrequenciesTab' ? Colors.whiteFnColor : Colors.drakGreyFnColor]}>FREQUENCIES</Text>
                                    {this.state.showView == 'FrequenciesTab' ?
                                        <LinearGradient
                                            start={{ x: 0.0, y: 0.50 }}
                                            end={{ x: 1.3, y: 1.0 }}
                                            style={[Common.marginTop5, { width: "60%", height: (global.IS_IPAD ? 5 : 3) }]}
                                            colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                                        </LinearGradient>
                                        :
                                        <View style={[Common.marginTop5, { height: (global.IS_IPAD ? 5 : 3) }]}></View>
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                    </ImageBackground>
                    <View style={[Platform.OS == 'ios' ? Common.marginTop0 : Common.marginTop5, Common.marginHorizontal15]}>
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
                    <View style={{ flex: 1 }}>
                        <SectionList
                            ref={ref => this.sectionListRef = ref}
                            sections={this.state.frequenciesArray}
                            keyExtractor={(item, index) => item + index}
                            style={[Common.marginHorizontal15]}
                            renderItem={({ item, index }) => {
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
                            }}
                            renderSectionHeader={({ section }) => (
                                <View>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Common.marginHorizontal10, Common.marginTop15, { fontWeight: 'bold' }]}>{section.title}</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View style={[Common.positionAbs, Common.right15, Common.zIndex9999, {
                        top: alphabetTop,
                        height: alphabetHeight,
                    }]}>
                        {alphabetView}
                    </View>
                    {global.SMALL_VIEW_TEXT ? <SmallPlayerView screen='SearchTab' playDetail={this.props.playDetail} {...this.props} /> : <View />}
                </View >
            )
        } else {
            var frequenciesValue = this.state.frequenciesValue
            frequenciesValue = frequenciesValue.toFixed(2)
            return (
                <View style={[AppCommon.mainContainer, Colors.fullLightBlackBgColor]}>
                    <Notification screen='FrequenciesTab' />
                    <Loader visible={this.state.isLoading} />
                    {Platform.OS == 'ios' ?
                        <StatusBar translucent backgroundColor={Colors.fullLightBlackBgColor} barStyle="light-content" />
                        : null}
                    <View style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.marginHorizontal20, Common.flexRow, Common.justifyCenter]}>
                    </View>
                    <View style={[Common.marginTop50, Common.flexRow, Common.justifyCenter, Common.alignItmCenter, Common.height40]}>
                        <TouchableHighlight
                            onPress={() => { this.changeShowView('SearchTab') }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={[Common.paddingVertical5, Common.marginRight5]}>
                            <View style={[Common.alignItmCenter]}>
                                <Text style={[AppCommon.h4, Input.fontBold, this.state.showView == 'SearchTab' ? Colors.whiteFnColor : Colors.drakGreyFnColor]}>PROGRAMS</Text>
                                {this.state.showView == 'SearchTab' ?
                                    <LinearGradient
                                        start={{ x: 0.0, y: 0.50 }}
                                        end={{ x: 1.3, y: 1.0 }}
                                        style={[Common.marginTop5, { width: "60%", height: (global.IS_IPAD ? 5 : 3) }]}
                                        colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                                    </LinearGradient>
                                    :
                                    <View style={[Common.marginTop5, { height: (global.IS_IPAD ? 5 : 3) }]}></View>
                                }
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => { this.changeShowView('FrequenciesTab') }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={[Common.marginLeft30, Common.paddingVertical5, Common.marginRight5]}>
                            <View style={[Common.alignItmCenter]}>
                                <Text style={[AppCommon.h4, Input.fontBold, this.state.showView == 'FrequenciesTab' ? Colors.whiteFnColor : Colors.drakGreyFnColor]}>FREQUENCIES</Text>
                                {this.state.showView == 'FrequenciesTab' ?
                                    <LinearGradient
                                        start={{ x: 0.0, y: 0.50 }}
                                        end={{ x: 1.3, y: 1.0 }}
                                        style={[Common.marginTop5, { width: "60%", height: (global.IS_IPAD ? 5 : 3) }]}
                                        colors={[global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
                                    </LinearGradient>
                                    :
                                    <View style={[Common.marginTop5, { height: (global.IS_IPAD ? 5 : 3) }]}></View>
                                }
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[Common.marginTop20, Common.justifyCenter, Common.alignItmCenter, { height: (global.IS_IPAD ? 150 : 100) }]}>
                        {/* {this.state.isPlay ?
                        progressImageView
                        : null} */}
                    </View>
                    <ScrollView style={[Common.marginTop20, { width: width }]} alwaysBounceVertical={false} contentInsetAdjustmentBehavior="always" vertical={true} bounces={true}>
                        <View style={[AppCommon.container]}>
                            <View style={[Common.flexRow, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    style={[Common.paddingHorizontal10, Common.paddingVertical10]}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    onPress={() => { this.frequenciesValuesChange('minus') }}>
                                    <Image style={[AppCommon.icon24]} source={require('../Images/chevron_3.png')} />
                                </TouchableHighlight>
                                <View style={[Common.marginHorizontal10, Common.flexRow, Common.alignItmFEnd]}>
                                    <Text style={[AppCommon.extraBigFont, Input.fontBold, this.state.isPlay ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>{frequenciesValue}</Text>
                                    <Text style={[Common.marginLeft1, AppCommon.h3, Input.fontBold, this.state.isPlay ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>Hz</Text>
                                </View>
                                <TouchableHighlight
                                    style={[Common.paddingHorizontal10, Common.paddingVertical10]}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    onPress={() => { this.frequenciesValuesChange('plus') }}>
                                    <Image style={[AppCommon.icon24]} source={require('../Images/chevron_4.png')} />
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop20, Common.flexRow, Common.justifySEvenly, Common.alignItmCenter, Common.border2, Common.borderRadius5, Colors.lightGreyBorder]}>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('All') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == 'All' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>All</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('5-500 hz') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == '5-500 hz' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>5-500 hz</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('500-1k') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == '500-1k' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>500-1k</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('1k-3k') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == '1k-3k' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>1k-3k</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('3k-11k') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == '3k-11k' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>3k-11k</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => { this.sliderRangeChange('11k-22k') }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingVertical7]}>
                                    <Text style={[AppCommon.h5, this.state.selectRange == '11k-22k' ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>11k-22k</Text>
                                </TouchableHighlight>

                            </View>
                            <View style={[Common.marginTop20, Common.justifyCenter, Common.alignItmCenter]}>
                                <MultiSlider
                                    values={[this.state.firstSelectValue]}
                                    min={this.state.firstSliderValueMin}
                                    max={this.state.firstSliderValueMix}
                                    step={1}
                                    sliderLength={width - global.Gap_15 - global.Gap_15 - (global.IS_IPAD ? 30 : 20) - (global.IS_IPAD ? 30 : 20)}
                                    onValuesChange={(values) => this.sliderValuesChange('first', values[0])}
                                    selectedStyle={[Common.height7, Common.borderRadius10, Colors.lightGreyBgColor]}
                                    unselectedStyle={[Common.height7, Common.borderRadius10, Colors.lightGreyBgColor]}
                                    customMarker={() =>
                                        <View style={[AppCommon.icon20, Common.marginTop5, Common.borderRadius20, Colors.lightGreyBgColor]}>
                                        </View>
                                    }
                                />
                            </View>
                            <View style={[Common.justifyCenter, Common.justifyCenter, Common.alignItmCenter, { marginTop: -global.Gap_10 }]}>
                                <Text style={[AppCommon.h4, Colors.lightGreyFnColor]}>Hz</Text>
                            </View>
                            <View style={[Common.marginTop0, Common.justifyCenter, Common.alignItmCenter]}>
                                <MultiSlider
                                    values={[this.state.frequenciesValue]}
                                    min={this.state.secondSliderValueMin}
                                    max={this.state.secondSliderValueMix}
                                    step={0.01}
                                    sliderLength={width - global.Gap_15 - global.Gap_15 - (global.IS_IPAD ? 30 : 20) - (global.IS_IPAD ? 30 : 20)}
                                    onValuesChange={(values) => this.sliderValuesChange('second', values[0])}
                                    selectedStyle={[Common.height7, Common.borderRadius10, Colors.lightGreyBgColor]}
                                    unselectedStyle={[Common.height7, Common.borderRadius10, Colors.lightGreyBgColor]}
                                    customMarker={() =>
                                        <View style={[AppCommon.icon20, Common.marginTop5, Common.borderRadius20, Colors.lightGreyBgColor]}>
                                        </View>
                                    }
                                />
                            </View>
                            <View style={[Common.justifyCenter, Common.justifyCenter, Common.alignItmCenter, { marginTop: -global.Gap_10 }]}>
                                <Text style={[AppCommon.h4, Colors.lightGreyFnColor]}>Fine Tune Hz</Text>
                            </View>
                            <View style={[Common.marginTop40, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.playClick() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.height45, Common.width150, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.defaultBorder, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.defaultFnColor, Input.fontBold]}>{this.state.isPlay ? 'STOP' : 'PLAY'}</Text>
                                </TouchableHighlight>
                            </View>
                        </View >
                    </ScrollView>
                </View >
            );
        }
    }
}


export default WithSmallPlay(FrequenciesTab)