import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, StatusBar, Dimensions, Alert, Platform, BackHandler, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound'
import MusicControl, { Command } from 'react-native-music-control'
import Frequency from 'react-native-frequency';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import BackgroundTimer from 'react-native-background-timer';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import HeadBar from './HeadBar';
import AppContext from '../Context/AppContext';

const { width, height } = Dimensions.get("window")

export default class QiCoilPlayer extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            FrequenciesTotalTime: 300,
            callType: '',   //  SmallPlayerView  SelectItem
            txtSubTitle: '',
            isPlaying: false,
            dataArray: [],
            albumArray: undefined,
            playIndex: 0,
            playRepeat: 0
        }
        this.timer = null
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        const playRepeat = await AsyncStorage.getItem('playAlbumRepeat')
        const albumArray = this.props.navigation.getParam('albumDetail', '')
        const playData = this.props.navigation.getParam('playData', [])
        const playIndex = this.props.navigation.getParam('playIndex', 0)
        Frequency.stop()
        this.setState({
            playRepeat: playRepeat ? playRepeat : 0,
            albumArray: albumArray,
            dataArray: playData,
            playIndex
        }, () => {
            this.setData();
        });
        this.timer = BackgroundTimer.setInterval(() => {
            this.setState({ foo: true })
        }, 1000)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        BackgroundTimer.clearInterval(this.timer);
    }

    handleBackButton = () => {
        this.props.navigation.goBack()
    }

    setData() {
        const { setPlayDetail } = this.context;
        setPlayDetail({
            name: global.PLAY_SUB_TITLE,
            image: global.ALBUM_DATA.image_path,
            albumArray: this.state.albumArray
        });

        if (this.props.callType == "SmallPlayerView") {
            this.setState({
                txtSubTitle: global.PLAY_SUB_TITLE,
                isPlaying: global.IS_PLAY,
                dataArray: global.PLAY_DATA,
                albumArray: global.ALBUM_DATA,
            }, () => {
            })
        } else {
            let playIndex = this.state.playIndex || 0;
            let albumArray = this.state.albumArray || [];

            let playData = this.state.dataArray || [];
            global.PLAY_INDEX = playIndex
            global.ALBUM_DATA = albumArray
            global.PLAY_DATA = playData
            global.PLAY_SUB_TITLE = ''
            global.IS_PLAY = false
            this.playAlbum(playIndex)
        }
    }

    onStopClick() {
        global.IS_PLAY = false
        global.PLAY_SUB_TITLE = ''
        global.CURRENT_SECONDS = 0
        global.SMALL_VIEW_SHOW = false
        global.SMALL_VIEW_IS_PLAY = false
        global.SMALL_VIEW_TEXT = ''
        this.setState({
            txtSubTitle: '',
            isPlaying: false,
        }, () => {
            global.PLAY_SOUND.stop()
            global.PLAY_SOUND = null
            console.log('stop click')
            BackgroundTimer.clearInterval(global.INTERVAL);
        })
    }

    onPreviousClick() {
        var playIndex = this.state.playIndex - 1
        if (playIndex > -1) {
            if (this.state.isPlaying) {
                global.IS_PLAY = false
                global.PLAY_SUB_TITLE = ''
                global.CURRENT_SECONDS = 0
                this.setState({
                    txtSubTitle: '',
                    isPlaying: false,
                }, () => {
                    global.PLAY_SOUND.stop()
                    global.PLAY_SOUND = null
                    BackgroundTimer.clearInterval(global.INTERVAL);
                    global.PLAY_INDEX = playIndex
                    this.setState({ playIndex: playIndex }, () => {
                        this.playAlbum(playIndex)
                    })
                })
            } else {
                var playIndex = this.state.playIndex - 1
                if (playIndex > -1) {
                    global.PLAY_INDEX = playIndex
                    this.setState({ playIndex: playIndex }, () => {
                        this.playAlbum(playIndex)
                    })
                }
            }
        }
    }

    onPlayClick() {
        if (global.PLAY_SOUND == null) {
            BackgroundTimer.clearInterval(global.INTERVAL);
            this.playAlbum(global.PLAY_INDEX)
        } else {
            if (global.IS_PLAY) {
                this.pauseSong()
            } else {
                this.playSong()
            }
        }
    }

    playSong() {
        const self = this;
        if (global.PLAY_SOUND != null) {
            global.IS_PLAY = true
            this.setState({
                isPlaying: true,
                FrequenciesTotalTime: Math.floor(global.PLAY_SOUND.getDuration())
            }, () => {
                global.PLAY_SOUND.play();
                global.INTERVAL = BackgroundTimer.setInterval(() => {
                    if (global.PLAY_SOUND) {
                        global.PLAY_SOUND.getCurrentTime((seconds) => {
                            global.CURRENT_SECONDS = Math.floor(seconds) + 1
                            if (global.CURRENT_SECONDS >= this.state.FrequenciesTotalTime) {
                                if (self.state.playRepeat == 0) {
                                    self.onStopClick()
                                } else if (self.state.playRepeat == 1) {
                                    self._repeadSound()
                                } else {
                                    self.onNextClick()
                                }
                            }
                        });
                    }
                }, 1000)
            })
        }
    }

    _repeadSound() {
        global.CURRENT_SECONDS = 0
        global.PLAY_SOUND.setCurrentTime(0)
        global.PLAY_SOUND.play()
        global.PLAY_SOUND.setNumberOfLoops(-1);
    }

    pauseSong() {
        if (global.PLAY_SOUND != null) {
            global.IS_PLAY = false
            global.SMALL_VIEW_IS_PLAY = false
            this.setState({
                isPlaying: false,
            }, () => {
                global.PLAY_SOUND.pause();
                BackgroundTimer.clearInterval(global.INTERVAL);
            })
        }
        const { setPlayDetail } = this.context;
        setPlayDetail({
            isPlay: false,
        });
    }

    onNextClick() {
        let playIndex = this.state.playIndex;
        if (this.state.playIndex == this.state.dataArray.length - 1) {
            playIndex = 0
        } else if (this.state.playIndex < this.state.dataArray.length - 1) {
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
                BackgroundTimer.clearInterval(global.INTERVAL);
                global.PLAY_SOUND.stop()
                global.PLAY_SOUND = null
                global.PLAY_INDEX = playIndex
                this.setState({ playIndex: playIndex }, () => {
                    this.playAlbum(playIndex)
                })
            })
        } else {
            BackgroundTimer.clearInterval(global.INTERVAL);
            global.CURRENT_SECONDS = 0
            if (this.state.dataArray.length > playIndex) {
                global.PLAY_INDEX = playIndex
                this.setState({ playIndex: playIndex }, () => {
                    this.playAlbum(playIndex)
                })
            }
        }
    }

    playAlbum(index = 0) {
        if (global.FREQUENCIES_TAB_IS_PLAY) {
            global.FREQUENCIES_TAB_IS_PLAY = false
        }

        const self = this
        if (global.PLAY_SOUND != null) {
            global.PLAY_SOUND.stop()
            global.PLAY_SOUND = null
            global.CURRENT_SECONDS = 0
            BackgroundTimer.clearInterval(global.INTERVAL);
        }
        this.setState({ isLoading: true })
        var txtSubTitle = ''
        var album_path = ''
        this.state.dataArray.map((data, i) => {
            if (i == index) {
                txtSubTitle = data.name
                album_path = data.audio_file
            }
        })
        var album_image = ''
        if (this.state.albumArray) {
            album_image = this.state.albumArray.image_path
        }
        global.PLAY_SOUND = new Sound(album_path, '', (error) => {
            if (error) {
                this.setState({ isLoading: false })
                // console.log('error ==> ', error);
                Alert.alert('NOTIFICATION', error.message, [{
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }]);
                return;
            } else {
                this.setState({ isLoading: false })
                global.PLAYER_USED = 1
                global.PLAY_SOUND.play();
                global.IS_PLAY = true
                global.PLAY_SUB_TITLE = txtSubTitle
                global.PLAY_ALBUM_IMAGE = album_image
                const { setPlayDetail } = this.context;
                setPlayDetail({
                    name: global.PLAY_SUB_TITLE,
                    image: global.ALBUM_DATA.image_path,
                    albumArray: this.state.albumArray
                });
                global.CURRENT_SECONDS = 0
                global.PLAY_INDEX = index
                MusicControl.setNowPlaying({
                    title: global.PLAY_SUB_TITLE,
                    artwork: global.PLAY_ALBUM_IMAGE
                })
                MusicControl.enableBackgroundMode(true);
                MusicControl.enableControl('play', true)
                MusicControl.enableControl('pause', true)
                MusicControl.enableControl('nextTrack', true)
                MusicControl.enableControl('previousTrack', true)
                MusicControl.enableControl('stop', true)

                MusicControl.on(Command.play, () => {
                    this.onPlayClick()
                })
                MusicControl.on(Command.pause, () => {
                    this.onPlayClick()
                })
                MusicControl.on(Command.nextTrack, () => {
                    this.onNextClick()
                })
                MusicControl.on(Command.previousTrack, () => {
                    this.onPreviousClick()
                })
                MusicControl.on(Command.stop, () => {
                    this.onStopClick()
                })

                global.SMALL_VIEW_SHOW = true
                global.SMALL_VIEW_IS_PLAY = true
                global.SMALL_VIEW_TEXT = txtSubTitle

                this.setState({
                    isPlaying: global.IS_PLAY,
                    txtSubTitle: global.PLAY_SUB_TITLE,
                    FrequenciesTotalTime: Math.floor(global.PLAY_SOUND.getDuration()),

                }, () => {
                    BackgroundTimer.clearInterval(global.INTERVAL);
                    global.INTERVAL = BackgroundTimer.setInterval(() => {
                        if (global.PLAY_SOUND) {
                            global.PLAY_SOUND.getCurrentTime((seconds) => {
                                global.CURRENT_SECONDS = Math.floor(seconds) + 1
                                if (global.CURRENT_SECONDS >= this.state.FrequenciesTotalTime) {
                                    if (self.state.playRepeat == 0) {
                                        self.onStopClick()
                                    } else if (self.state.playRepeat == 1) {
                                        self._repeadSound()
                                    } else {
                                        self.onNextClick()
                                    }
                                }
                            });
                        }
                    }, 1000)
                })

                AsyncStorage.getItem('recentlyPlayedAlbumsArray', (err, recentlyPlayedAlbumsArray) => {
                    var oldPlayedAlbumsArray = JSON.parse(recentlyPlayedAlbumsArray)
                    if (oldPlayedAlbumsArray != null && oldPlayedAlbumsArray != undefined) {
                        oldPlayedAlbumsArray = oldPlayedAlbumsArray.reverse()
                        var item = []
                        var checkFlag = 0
                        var dataArray = []
                        for (var i = 0; i < oldPlayedAlbumsArray.length; ++i) {
                            if (i < 4) {
                                item = oldPlayedAlbumsArray[i];
                                if (item.id == this.state.albumArray.id) {
                                    checkFlag = 1
                                } else if (i > oldPlayedAlbumsArray.length - 4) {
                                    dataArray = [item, ...dataArray];
                                }
                            }
                        }
                        if (checkFlag == 0) {
                            dataArray = [this.state.albumArray, ...dataArray];
                            AsyncStorage.setItem('recentlyPlayedAlbumsArray', JSON.stringify(dataArray));
                        }
                    } else {
                        var dataArray = []
                        dataArray.push(this.state.albumArray)
                        AsyncStorage.setItem('recentlyPlayedAlbumsArray', JSON.stringify(dataArray));
                    }
                });
            }
        });
    }


    getTime(seconds = 0) {
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
        AsyncStorage.setItem('playAlbumRepeat', playRepeat.toString())
    }

    handleProgressBarChange = (values) => {
        global.CURRENT_SECONDS = values[0]
        if (global.PLAY_SOUND) {
            global.PLAY_SOUND.setCurrentTime(values[0]);
            if (global.IS_PLAY) {
                global.PLAY_SOUND.play();
            }
        }
    }

    render() {
        var current_time = global.CURRENT_SECONDS
        current_time = this.getTime(current_time)
        var total_time = this.state.FrequenciesTotalTime
        total_time = total_time - global.CURRENT_SECONDS
        total_time = this.getTime(total_time)
        var categoryName = ''
        var subCategoryName = ''
        var image_path = ''
        if (this.state.albumArray) {
            categoryName = this.state.albumArray.categoryName
            subCategoryName = this.state.albumArray.subCategoryName
            image_path = this.state.albumArray.image_path
        }
        const progressBarValues = [global.CURRENT_SECONDS];

        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <HeadBar screen='QicoilPlayer' {...this.props} cb={this.handleCb} />
                <Notification screen='QiCoilPlayer' />
                <LoaderSecond visible={this.state.isLoading} />
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.fullLightBlackBgColor} barStyle="light-content" />
                    : null}
                <View style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.flexRow, Common.justifySBetween]}>
                    <TouchableHighlight
                        style={[Common.marginLeft20, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.handleBackButton() }}>
                        <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/left_arrow.png')} />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => { this.handleBackButton() }}
                        underlayColor={global.TRANSPARENT_COLOR}
                        style={[Common.zIndex9, Common.marginTop10, Common.flex01, Common.flexRow, Common.justifyFStart, Common.alignItmFStart]}>
                        <View style={[Common.flexRow, Common.justifyFStart, Common.alignItmCenter,]}>
                            <Image style={[AppCommon.icon22]} source={require('../Images/chevron_2.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                    <ProgressImage
                        source={image_path ? { uri: image_path } : require('../Images/album_default.png')}
                        style={[AppCommon.qiCoilPlayerImage, Colors.lightGreyBgColor]}
                        imageStyle={[AppCommon.qiCoilPlayerImage, Colors.lightGreyBgColor]}>
                    </ProgressImage>
                </View>
                <View style={[Common.marginTop20, Common.marginHorizontal10, Common.alignItmCenter]}>
                    <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>{this.state.txtSubTitle}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableHighlight
                        style={[Common.marginLeft40]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => this.onRepeat()}>
                        <View style={[Common.flexRow, Common.justifyFStart, Common.alignItmCenter, Common.marginTop10, { marginRight: global.IS_IPAD ? 30 : 20 }]}>
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
                        onValuesChange={this.handleProgressBarChange}
                        selectedStyle={{ backgroundColor: '#00bcd4' }}
                        sliderLength={width - global.Gap_15 - (global.IS_IPAD ? 20 : 10) - (global.IS_IPAD ? 20 : 15)}
                        customMarker={() =>
                            <View style={[AppCommon.icon10, Common.borderRadius20, { backgroundColor: '#00bcd4' }]}>
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
                <View style={[Common.marginHorizontal20, Common.flexRow, Common.justifyCenter]}>
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
                </View>
                <View style={[Common.marginTop20]}></View>
            </View>
        );
    }
}

