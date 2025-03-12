import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, FlatList, StatusBar, Dimensions, Platform, ImageBackground, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Frequency from 'react-native-frequency';
import MusicControl, { Command } from 'react-native-music-control'
import ReactNativeBlobUtil from 'react-native-blob-util';
import moment from 'moment';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import BackgroundTimer from 'react-native-background-timer';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import AppContext from '../Context/AppContext';

const { width, height } = Dimensions.get("window")

export default class PlayerView extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            selectedFrequenciesType: 1,
            FrequenciesTotalTime: 180,
            callType: '',   //  SmallPlayerView  SelectItem
            txtId: '',
            txtTitle: '',
            txtFrequencies: '',
            txtSubTitle: '',
            isPlaying: false,
            dataArray: [],
            playDataArray: [],
            playIndex: 0,
            isFavorite: 0,
            playRepeat: 2
        }
        this.timer = null
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let callType = this.props.navigation.getParam('callType', '');
        const playRepeat = await AsyncStorage.getItem('playFrequencyRepeat')
        this.setState({
            callType: callType,
            playRepeat: playRepeat ? playRepeat : 0,
        }, () => {
            this.setData();
        });
        if (this.timer) {
            BackgroundTimer.clearInterval(this.timer);
            this.timer = BackgroundTimer.setInterval(() => {
                this.setState({ foo: true })
            }, 1000)
        }

    }

    componentWillReceiveProps(nextProps){
        let trifeData = this.props.navigation.getParam('rifeData', '');
        let nrifeData = nextProps.navigation.getParam('rifeData', '');

        if(trifeData?.id != nrifeData?.id){
            this.setState({
                callType: callType,
                playRepeat: playRepeat ? playRepeat : 0,
            }, () => {
                this.setData();
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        BackgroundTimer.clearInterval(this.timer);
    }

    handleBackButton = () => {
        this.backButtonClick()
        return true;
    }

    handleOnNavigateBack = (foo) => {
        this.setData();
    }

    backButtonClick() {
        this.props.navigation.goBack()
    }

    setData() {
        let id = this.props.navigation.getParam('id', '');
        let title = this.props.navigation.getParam('title', '');
        let strFrequencies = this.props.navigation.getParam('strFrequencies', '');
        let playData = this.props.navigation.getParam('playData', []);
        global.PLAY_ID = id
        global.PLAY_TITLE = title
        global.PLAY_FREQUENCIES = strFrequencies
        global.PLAY_DATA = playData
        global.PLAY_SUB_TITLE = ''
         this.setState({
            txtId: global.PLAY_ID,
            txtTitle: global.PLAY_TITLE,
            txtFrequencies: global.PLAY_FREQUENCIES,
            txtSubTitle: global.PLAY_SUB_TITLE,
            isPlaying: global.IS_PLAY,
            dataArray: global.PLAY_DATA,
            playDataArray: [],
        }, () => {
            // this.onPlayClick()
            this.checkIsFavorite()
            if(global.IS_PLAY){
                this.playFrequency(global.PLAY_DATA[global.PLAY_INDEX])
            }
        })

    }

    checkIsFavorite() {
        var isFavorite = 0
        for (var i = 0; i < global.FAVORITES_DATA.length; ++i) {
            item = global.FAVORITES_DATA[i];
            if (item.id == this.state.txtId && item.title == this.state.txtTitle) {
                isFavorite = 1
                break;
            }
        }
        this.setState({ isFavorite: isFavorite })
    }

    onStopClick() {
        global.IS_PLAY = false
        global.PLAY_SUB_TITLE = ''
        global.CURRENT_SECONDS = 0
        global.SMALL_VIEW_SHOW = false
        global.SMALL_VIEW_IS_PLAY = false
        global.SMALL_VIEW_TEXT = ''
        const { setPlayDetail } = this.context;
        setPlayDetail({
            isPlay: false,
        });
        this.setState({
            txtSubTitle: '',
            isPlaying: false,
            playDataArray: [],
        }, () => {
            Frequency.stop()
            BackgroundTimer.clearInterval(global.INTERVAL);
        })
    }

    onPreviousClick() {
        if (this.state.isPlaying) {
            global.IS_PLAY = false
            global.PLAY_SUB_TITLE = ''
            global.CURRENT_SECONDS = 0
            this.setState({
                txtSubTitle: '',
                isPlaying: false,
            }, () => {
                Frequency.stop()
                BackgroundTimer.clearInterval(global.INTERVAL);
                var playIndex = this.state.playIndex - 1
                if (playIndex > -1) {
                    global.PLAY_INDEX = playIndex
                    this.setState({ playIndex: playIndex }, () => {
                        this.playFrequency(this.state.dataArray[playIndex])
                    })
                }
            })
        } else {
            var playIndex = this.state.playIndex - 1
            if (playIndex > -1) {
                global.PLAY_INDEX = playIndex
                this.setState({ playIndex: playIndex }, () => {
                    this.playFrequency(this.state.dataArray[playIndex])
                })
            }
        }

    }

    onPlayClick() {
        global.CURRENT_SECONDS = 0
        if (this.state.isPlaying) {
            global.IS_PLAY = false
            global.PLAY_SUB_TITLE = ''
            global.SMALL_VIEW_IS_PLAY = false
            this.setState({
                txtSubTitle: '',
                isPlaying: false,
            }, () => {
                Frequency.stop()
                BackgroundTimer.clearInterval(global.INTERVAL);
            })
        } else {
            if (this.state.dataArray.length > 0) {
                this.playFrequency(this.state.dataArray[this.state.playIndex])
            }
        }
    }

    onNextClick() {
        let playIndex = this.state.playIndex;
        if (this.state.playIndex == this.state.dataArray.length - 1 && this.state.playRepeat == 2) {
            playIndex = 0
        } else {
            playIndex++;
        }

        if (this.state.isPlaying) {
            global.IS_PLAY = false
            global.PLAY_SUB_TITLE = ''
            global.CURRENT_SECONDS = 0
            this.setState({
                txtSubTitle: '',
                isPlaying: false,
            }, () => {
                Frequency.stop()
                BackgroundTimer.clearInterval(global.INTERVAL);
                if (this.state.dataArray.length > playIndex) {
                    global.PLAY_INDEX = playIndex
                    this.setState({ playIndex: playIndex }, () => {
                        this.playFrequency(this.state.dataArray[playIndex])
                    })
                }
            })
        } else {
            if (this.state.dataArray.length > playIndex) {
                global.PLAY_INDEX = playIndex
                this.setState({ playIndex: playIndex }, () => {
                    this.playFrequency(this.state.dataArray[playIndex])
                })
            }
        }
    }

    itemClick(dataArray, index) {
        global.CURRENT_SECONDS = 0
        if (dataArray == this.state.txtSubTitle) {
            this.onStopClick()
        } else {
            global.PLAY_INDEX = index
            this.setState({ playIndex: index }, () => {
                this.playFrequency(dataArray)
            })
        }
    }

    handleUserSupcription() {
        if (global.TOTAL_PLAY_TIME > 1800 && !global.IS_SUBSCRIBE) {
            var currentDate = moment();
            this.onStopClick()
            AsyncStorage.setItem('temp_date_time', JSON.stringify(currentDate));
            BackgroundTimer.clearInterval(global.INTERVAL)
            return this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
        }
    }

    playFrequency(dataArray) {
        this.handleUserSupcription()
        var frequencyName = dataArray
        global.IS_PLAY = true
        global.PLAY_SUB_TITLE = frequencyName
        const { setPlayDetail } = this.context;
        setPlayDetail({
            isPlay: true,
            name: global.PLAY_SUB_TITLE,
            rifeData: { ...this.state }
        });
        this.setState({
            txtSubTitle: global.PLAY_SUB_TITLE,
            isPlaying: global.IS_PLAY,
            playDataArray: dataArray,
        }, () => {
            frequencyName = frequencyName.replace(' Hz', '')
            BackgroundTimer.clearInterval(global.INTERVAL);
            global.INTERVAL = BackgroundTimer.setInterval(() => {
                global.CURRENT_SECONDS = global.CURRENT_SECONDS + 1
                this.setState({ currentSeconds: CURRENT_SECONDS })
                global.TOTAL_PLAY_TIME = global.TOTAL_PLAY_TIME + 1
                AsyncStorage.setItem('total_play_time', JSON.stringify(global.TOTAL_PLAY_TIME));
                this.handleUserSupcription()
                if (global.CURRENT_SECONDS > this.state.FrequenciesTotalTime) {
                    global.CURRENT_SECONDS = 0;
                    if (this.state.playRepeat == 2 || this.state.playRepeat == 0) {
                        this.onNextClick()
                    } else {
                        this.playFrequency(dataArray)
                    }
                }
            }, 1000)
            Frequency.playFrequency(parseFloat(frequencyName), this.state.FrequenciesTotalTime * 1000)
                .then(response => {
                    console.log("response ==>", response)
                    // global.CURRENT_SECONDS = 0
                    // this.setState({ foo: true })
                }).catch(error => {
                    console.log("error ==>", error)
                });
            global.PLAYER_USED = 0
            if (global.PLAY_SOUND != null) {
                global.PLAY_SOUND.stop()
                global.PLAY_SOUND = null
            }
            MusicControl.setNowPlaying({
                title: global.PLAY_SUB_TITLE,
                artwork: '../Images/Logo.png'
            })
            MusicControl.enableBackgroundMode(true);
            MusicControl.enableControl('play', true)
            MusicControl.enableControl('pause', true)
            MusicControl.enableControl('stop', true)
            MusicControl.on(Command.play, () => {
                this.onPlayClick()
            })
            MusicControl.on(Command.pause, () => {
                this.onPlayClick()
            })
            MusicControl.on(Command.stop, () => {
                this.onStopClick()
            })

            global.SMALL_VIEW_SHOW = true
            global.SMALL_VIEW_IS_PLAY = true
            global.SMALL_VIEW_TEXT = this.state.txtTitle + ' - ' + frequencyName + ' Hz'

            if (global.FREQUENCIES_TAB_IS_PLAY) {
                global.FREQUENCIES_TAB_IS_PLAY = false
            }

            AsyncStorage.getItem('recentlyPlayedDataArray', (err, recentlyPlayedDataArray) => {
                var oldPlayedDataArray = JSON.parse(recentlyPlayedDataArray)
                if (oldPlayedDataArray != null && oldPlayedDataArray != undefined) {
                    oldPlayedDataArray = oldPlayedDataArray.reverse()
                    var item = []
                    var checkFlag = 0
                    var dataArray = []
                    for (var i = 0; i < oldPlayedDataArray.length; ++i) {
                        if (i < 3) {
                            item = oldPlayedDataArray[i];
                            if (item.id == this.state.txtId && item.title == this.state.txtTitle) {
                                checkFlag = 1
                            } else if (i > oldPlayedDataArray.length - 3) {
                                dataArray = [{ 'id': item.id, 'title': item.title, 'frequencies': item.frequencies }, ...dataArray];
                            }
                        }
                    }
                    if (checkFlag == 0) {
                        dataArray = [{ 'id': this.state.txtId, 'title': this.state.txtTitle, 'frequencies': this.state.txtFrequencies }, ...dataArray];
                        AsyncStorage.setItem('recentlyPlayedDataArray', JSON.stringify(dataArray));
                    }
                } else {
                    var dataArray = []
                    dataArray.push({ 'id': this.state.txtId, 'title': this.state.txtTitle, 'frequencies': this.state.txtFrequencies })
                    AsyncStorage.setItem('recentlyPlayedDataArray', JSON.stringify(dataArray));
                }
            });
        })
    }

    renderItem = ({ item, index }) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableHighlight
                onPress={() => { this.itemClick(item, index) }}
                underlayColor={global.TRANSPARENT_COLOR}
                style={[]}>
                <View style={[index == 0 ? Common.marginTop7 : Common.marginTop0, Common.paddingHorizontal15, Common.paddingVertical7, Common.justifyCenter]}>
                    <Text style={[AppCommon.h4, item == this.state.txtSubTitle ? Colors.defaultFnColor : Colors.whiteFnColor]}>{item} Hz</Text>
                </View>
            </TouchableHighlight>
        )
    }

    getTime(seconds = 0, call_type = '') {
        var time = ''
        var divisor_for_minutes = seconds % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        if (minutes > 9) {
            time = time + minutes + ':'
        } else {
            time = time + '0' + minutes + ':'
        }
        if (seconds > 9) {
            time = time + seconds
        } else {
            time = time + '0' + seconds
        }
        return time
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
                data_Array.push({ name: 'frequency_id', data: this.state.txtId.toString() });
                ReactNativeBlobUtil.fetch('POST', global.SAVE_FAVORITE_PROGRAM, {
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

    onRepeat() {
        let playRepeat = this.state.playRepeat
        if (playRepeat == 0) {
            playRepeat = 1
        } else if (playRepeat == 1) {
            playRepeat = 2
        } else {
            playRepeat = 0
        }
        this.setState({ playRepeat })
        AsyncStorage.setItem('playFrequencyRepeat', playRepeat.toString())
    }

    handleProgressBarChange(values) {
        global.CURRENT_SECONDS = values[0]
    }

    render() {
        var current_time = global.CURRENT_SECONDS
        current_time = this.getTime(current_time)
        var total_time = this.state.FrequenciesTotalTime
        total_time = total_time - global.CURRENT_SECONDS
        total_time = this.getTime(total_time)
        const progressBarValues = [global.CURRENT_SECONDS];

        return (
            <View style={[AppCommon.mainContainer, Colors.fullLightBlackBgColor]}>
                <Notification screen='PlayerView' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.fullLightBlackBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.fullLightBlackBgColor} barStyle="light-content" />
                    : null}
                <TouchableHighlight
                    style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.marginLeft20, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                    underlayColor={global.TRANSPARENT_COLOR}
                    onPress={() => { this.backButtonClick() }}>
                    <Image style={[AppCommon.icon22]} source={require('../Images/chevron_2.png')} />
                </TouchableHighlight>
                <View style={[Common.marginTop10, Common.marginHorizontal20, Common.flexRow, Common.justifyCenter]}>
                </View>
                <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                    <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                        <ProgressImage
                            source={this.state.albumArray?.image_path ? { uri: this.state.albumArray?.image_path } : require('../Images/freaquecy.png')}
                            style={[AppCommon.albumsListItemImage, Common.borderRadius10, Colors.lightGreyBgColor]}
                            imageStyle={[AppCommon.albumsListItemImage, Common.borderRadius10, Colors.lightGreyBgColor]}>
                        </ProgressImage>
                    </View>
                    <View style={[Common.justifyCenter, Common.alignItmCenter, Common.marginTop20]}>
                        <Text style={[AppCommon.h1Big2, Colors.whiteFnColor, Input.fontBold]}>{this.state.txtTitle}</Text>
                    </View>
                </View>

                <View style={[Common.marginTop15, Common.marginHorizontal10, Common.height40, Common.flexRow, Common.justifyCenter, Common.alignItmFEnd]}>
                    <Text style={[AppCommon.h4, Input.fontBold, Colors.defaultFnColor]}>{this.state.txtSubTitle ? this.state.txtSubTitle : ''}</Text>
                    <Text style={[AppCommon.h5, Input.fontBold, Colors.defaultFnColor]}>{this.state.txtSubTitle ? 'Hz' : ''}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableHighlight
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => this.onRepeat()}>
                        <View style={[Common.flexRow, Common.justifyFStart, Common.alignItmCenter, { marginRight: global.IS_IPAD ? 30 : 20 }]}>
                            {this.state.playRepeat == 0 && <Image style={[AppCommon.icon22]} source={require('../Images/repeat.png')} />}
                            {this.state.playRepeat == 1 && <View style={{ position: 'relative' }}>
                                <ImageBackground style={[AppCommon.icon22]} source={require('../Images/repeat_on.png')} >
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={[Colors.whiteFnColor]}>1</Text>
                                    </View>
                                </ImageBackground>
                            </View>}
                            {this.state.playRepeat == 2 && <Image style={[AppCommon.icon22]} source={require('../Images/repeat_on.png')} />}
                        </View>

                    </TouchableHighlight>
                </View>
                <View style={[Common.marginHorizontal20]}>
                    <MultiSlider
                        values={progressBarValues}
                        min={0}
                        max={this.state.FrequenciesTotalTime}
                        step={1}
                        sliderLength={width - global.Gap_15 - (global.IS_IPAD ? 20 : 10) - (global.IS_IPAD ? 20 : 15)}
                        onValuesChange={this.handleProgressBarChange}
                        selectedStyle={{ backgroundColor: '#03A9F4' }}
                        customMarker={() =>
                            <View style={[AppCommon.icon10, Common.borderRadius20, { backgroundColor: '#03A9F4' }]}>
                            </View>
                        }
                    />
                </View>
                <View style={[Common.marginTop5, Common.marginHorizontal20, Common.flexRow, Common.justifySBetween]}>
                    <View style={[]}>
                        <Text style={[AppCommon.h5, Colors.lightGreyFnColor]}>{current_time}</Text>
                    </View>
                    <View style={[]}>
                        <Text style={[AppCommon.h5, Colors.lightGreyFnColor]}>{total_time}</Text>
                    </View>
                </View>
                <View style={[Common.marginTop20, Common.marginHorizontal20, Common.flexRow, Common.justifyCenter]}>
                    <TouchableHighlight
                        style={[]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.onPreviousClick() }}>
                        <Image style={[AppCommon.icon30]} source={require('../Images/previous.png')} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Common.marginLeft40]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.onPlayClick() }}>
                        <Image style={[AppCommon.icon30]} source={this.state.isPlaying ? require('../Images/pause.png') : require('../Images/play.png')} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Common.marginLeft40]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.onNextClick() }}>
                        <Image style={[AppCommon.icon30]} source={require('../Images/next.png')} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[Common.positionAbs, AppCommon.icon30, Common.justifyCenter, Common.alignItmCenter, Common.right0]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.favoriteClick() }}>
                        <Image style={[AppCommon.icon20, Common.marginTop2]} source={this.state.isFavorite == 1 ? require('../Images/heart.png') : require('../Images/heart_2.png')} />
                    </TouchableHighlight>
                </View>
                <View style={[Common.marginTop20]}></View>
                <FlatList
                    style={[Common.marginTop15, Common.marginHorizontal20, Common.borderRadius10, Colors.drakGreyBgColor]}
                    ref={ref => this.flatList = ref}
                    data={this.state.dataArray}
                    numColumns={1}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                />
                <View style={[Common.marginTop20]}></View>
            </View>
        );
    }
}

