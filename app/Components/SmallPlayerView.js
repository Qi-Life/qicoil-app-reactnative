import React, { Component } from 'react';
import { AppState, Platform, View, Text, SafeAreaView, TouchableHighlight, TouchableWithoutFeedback, Alert, Dimensions, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import Frequency from 'react-native-frequency';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';
import BackgroundTimer from 'react-native-background-timer';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';
import AppContext from '../Context/AppContext';

const { width, height } = Dimensions.get("window")

class SmallPlayerView extends React.Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        functions = new Functions();
        string = new String();
        this.state = {
            isPlay: true,
            FrequenciesTotalTime: 300,
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props?.playDetail != nextProps?.playDetail){
            this.setState({
                isPlay: nextProps?.playDetail
            })
        }
    }

    closeSmallPlayerView() {
        global.IS_PLAY = false
        global.PLAY_SUB_TITLE = ''
        global.CURRENT_SECONDS = 0
        global.SMALL_VIEW_SHOW = false
        global.SMALL_VIEW_IS_PLAY = false
        global.SMALL_VIEW_TEXT = ''
        Frequency.stop()
        BackgroundTimer.clearInterval(global.INTERVAL);
        this.setState({ isPlay: false });
        if (global.PLAY_SOUND != null) {
            global.PLAY_SOUND.stop()
            global.PLAY_SOUND = null
        }
        global.PLAYER_USED = 0
        global.ALBUM_DATA = []
        global.PLAY_ALBUM_IMAGE = ''
        const { setPlayDetail } = this.context;
        setPlayDetail({
            name: '',
            image: '',
        });
    }

    onPlayClick() {
        if (global.PLAYER_USED == 0) {
            if (global.SMALL_VIEW_IS_PLAY) {
                global.IS_PLAY = false
                global.PLAY_SUB_TITLE = ''
                // global.CURRENT_SECONDS = 0
                global.SMALL_VIEW_IS_PLAY = false
                Frequency.stop()
                BackgroundTimer.clearInterval(global.INTERVAL);
                this.setState({ isPlay: false });
            } else {
                if (global.PLAY_DATA.length > 0) {
                    this.playFrequency(global.PLAY_DATA[global.PLAY_INDEX])
                }
            }
        } else {
            if (global.PLAY_SOUND == null) {
                BackgroundTimer.clearInterval(global.INTERVAL);
                this.playAlbum(global.PLAY_INDEX)
            } else {
                if (global.SMALL_VIEW_IS_PLAY) {
                    this.pauseSong()
                } else {
                    this.playSong()
                }
            }
        }

    }

    playFrequency(dataArray) {
        var frequencyName = dataArray
        frequencyName = frequencyName.replace(' Hz', '')
        BackgroundTimer.clearInterval(global.INTERVAL);
        global.INTERVAL = BackgroundTimer.setInterval(() => {
            global.CURRENT_SECONDS = global.CURRENT_SECONDS + 1
        }, 1000)
        Frequency.playFrequency(parseFloat(frequencyName), this.state.FrequenciesTotalTime * 1000)
            .then(response => {
                // console.log("response ==>", response)
                global.CURRENT_SECONDS = 0
            }).catch(error => {
                // console.log("error ==>", error)
            });
        global.IS_PLAY = true
        global.SMALL_VIEW_IS_PLAY = true
        if (global.FREQUENCIES_TAB_IS_PLAY) {
            global.FREQUENCIES_TAB_IS_PLAY = false
        }
        this.setState({ isPlay: true });
    }

    playSong() {
        if (global.PLAY_SOUND != null) {
            global.SMALL_VIEW_IS_PLAY = true
            global.IS_PLAY = true
            this.setState({
                isPlay: true,
            }, () => {
                global.PLAY_SOUND?.play();
                global.INTERVAL = BackgroundTimer.setInterval(() => {
                    global.CURRENT_SECONDS = global.CURRENT_SECONDS + 1
                    this.setState({ currentSeconds: CURRENT_SECONDS })
                }, 1000)
            })
        }
    }

    pauseSong() {
        if (global.PLAY_SOUND != null) {
            global.IS_PLAY = false
            global.SMALL_VIEW_IS_PLAY = false
            this.setState({
                isPlay: false,
            }, () => {
                global.PLAY_SOUND.pause();
                BackgroundTimer.clearInterval(global.INTERVAL);
            })
        }
    }

    navigateToAlbumDetail = () => {
        if(this.props.playDetail?.rifeData|| this.props.playDetail?.albumArray){
            if(global.PLAY_SOUND){
                this.props.navigation.navigate('AlbumsDetails', { albumDetail: this.props.playDetail?.albumArray })
            }else{
                const {txtId, txtTitle, txtFrequencies, dataArray} = this.props.playDetail?.rifeData
                this.props.navigation.navigate('PlayerView', {
                    callType: 'SelectItem',
                    id: txtId,
                    title: txtTitle,
                    strFrequencies: txtFrequencies,
                    playData: dataArray,
                    transition: 'bottomUp',
                });
            }
        }
    }

    render() {
        var selectedFrequenciesView = []
        if (global.SMALL_VIEW_FREQUENCIES_TYPE == 1) {
            selectedFrequenciesView.push(
                <View style={[]} >
                    <Image style={[AppCommon.icon40]} source={global.SMALL_VIEW_IS_PLAY ? require('../Images/Sine_Selected.png') : require('../Images/Sine.png')} />
                </View>
            );
        } else if (global.SMALL_VIEW_FREQUENCIES_TYPE == 2) {
            selectedFrequenciesView.push(
                <View style={[]} >
                    <Image style={[AppCommon.icon40]} source={global.SMALL_VIEW_IS_PLAY ? require('../Images/Square_Selected.png') : require('../Images/Square.png')} />
                </View>
            );
        } else if (global.SMALL_VIEW_FREQUENCIES_TYPE == 3) {
            selectedFrequenciesView.push(
                <View style={[]} >
                    <Image style={[AppCommon.icon40]} source={global.SMALL_VIEW_IS_PLAY ? require('../Images/Triangle_Selected.png') : require('../Images/Triangle.png')} />
                </View>
            );
        } else if (global.SMALL_VIEW_FREQUENCIES_TYPE == 4) {
            selectedFrequenciesView.push(
                <View style={[]} >
                    <Image style={[AppCommon.icon40]} source={global.SMALL_VIEW_IS_PLAY ? require('../Images/Saw_Selected.png') : require('../Images/Saw.png')} />
                </View>
            );
        }
        if (global.PLAYER_USED == 1) {
            selectedFrequenciesView = []
            var image_path = this.props.playDetail?.image
            selectedFrequenciesView.push(
                <ProgressImage
                    source={image_path ? { uri: image_path } : require('../Images/album_default.png')}
                    style={[AppCommon.icon40, Common.borderRadius5]}
                    imageStyle={[AppCommon.icon40, Common.borderRadius5]}>
                </ProgressImage>
            );
        }
        var bottom = global.Gap_5
        if (this.props.screen == 'AlbumsList' || this.props.screen == 'AlbumsDetails') {
            bottom = bottom + global.Gap_15
        }



        return (<TouchableWithoutFeedback
            onPress={this.navigateToAlbumDetail}
            style={global.SMALL_VIEW_SHOW ? [] : [Common.displayNone]}
            underlayColor={global.TRANSPARENT_COLOR}>
            <View style={global.SMALL_VIEW_SHOW ? [AppCommon.smallPlayerViewView, { bottom: bottom }] : [Common.displayNone]} >
                {selectedFrequenciesView}
                <View style={[Common.marginHorizontal10, { width: width - (global.Gap_10 * 8) - (global.IS_IPAD ? 60 : 40) - ((global.IS_IPAD ? 34 : 24) * 2) }]}>
                    <Text style={[AppCommon.h4, this.state.isPlay ? Colors.defaultFnColor : Colors.lightGreyFnColor]}>{this.props?.playDetail?.name}</Text>
                </View>
                <TouchableHighlight
                    onPress={() => { this.onPlayClick() }}
                    style={[Common.paddingVertical5, Common.paddingHorizontal5, Common.justifyCenter, Common.alignItmCenter]}
                    underlayColor={global.TRANSPARENT_COLOR}>
                    <Image style={[AppCommon.icon24]} source={this.state.isPlay ? require('../Images/pause.png') : require('../Images/play.png')} />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => { this.closeSmallPlayerView() }}
                    style={[Common.marginLeft5, Common.paddingVertical5, Common.paddingHorizontal5, Common.justifyCenter, Common.alignItmCenter]}
                    underlayColor={global.TRANSPARENT_COLOR}>
                    <Image style={[AppCommon.icon24]} source={require('../Images/close_2.png')} />
                </TouchableHighlight>
            </View>
        </TouchableWithoutFeedback>)

    }
}

export default SmallPlayerView;
