import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, Platform, NativeModules, BackHandler, StatusBar, ImageBackground, Dimensions, Alert, ScrollView, Linking } from 'react-native';
import { WebView } from "react-native-webview";
import Share from 'react-native-share';

import Notification from '../Components/Notification';
import Loader from '../Components/LoaderSecond';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

export default class OpenWebView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: true,
            title: '',
            url: '',
            showShareButton: false,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let title = this.props.navigation.getParam('title', '');
        let url = this.props.navigation.getParam('url', '');
        let showShareButton = this.props.navigation.getParam('showShareButton', false);
        this.setState({
            title: title,
            url: url,
            showShareButton: showShareButton,
        }, () => {
            this.isLoadingTimer = setTimeout(function () {
                this.setState({ isLoading: false })
            }.bind(this), 5000);
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.backButtonClick();
        return true;
    };

    handleOnNavigateBack = foo => {
        this.setState({ foo });
    };

    backButtonClick() {
        this.props.navigation.goBack();
    }

    openShare() {
        Linking.openURL(this.state.url);
        // var message = "Invoice PDF"
        // message += " \n"
        // message += " \n"
        // message += this.state.url
        // Share.open({
        //     title: this.state.title,
        //     message: message,
        //     url: this.state.url,
        //     subject: 'Trade 2 Trade',
        // });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='OpenWebView' />
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
                        <TouchableHighlight
                            onPress={() => { this.backButtonClick() }}
                            underlayColor={global.TRANSPARENT_COLOR}
                            style={[Common.zIndex9, Common.flex01, Common.flexRow, Common.justifyFStart, Common.alignItmFStart]}>
                            <View style={[Common.flexRow, Common.justifyFStart, Common.alignItmCenter]}>
                                <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/left_arrow.png')} />
                            </View>
                        </TouchableHighlight>
                        <View style={[AppCommon.topBarTitle]}>
                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.fontBold]}>{this.state.title}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <WebView
                    ref={r => this.webview = r}
                    // javaScriptEnabled={true}
                    // domStorageEnabled={true}
                    // injectedJavaScript={() => this.setState({ isLoading: false })}
                    onError={() => this.setState({ isLoading: false })}
                    onLoad={() => { this.setState({ isLoading: false }) }}
                    //onMessage={m => this.onMessage(m)}
                    source={{ uri: this.state.url }}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={true}
                />
            </View>
        );
    }
}