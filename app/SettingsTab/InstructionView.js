import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, ImageBackground, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, BackHandler } from 'react-native';
import Pdf from 'react-native-pdf';

import Notification from '../Components/Notification';
import Loader from '../Components/Loader';
import LoaderSecond from '../Components/LoaderSecond';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const { width, height } = Dimensions.get("window")
const GuideFile = require('../Doc/Instructions.pdf');

export default class InstructionView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.backButtonClick()
        return true;
    }

    backButtonClick() {
        this.props.navigation.goBack()
    }

    handleOnNavigateBack = (foo) => {
        this.setState({ foo })
    }


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='InstructionView' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.lightBlackBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={[Colors.lightBlackBgColor]} barStyle="light-content" />
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
                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.fontBold]}>Instructions</Text>
                        </View>
                    </View>
                </ImageBackground>
                <Pdf
                    source={GuideFile}
                    onLoadComplete={(numberOfPages, filePath) => { }}
                    onPageChanged={(page, numberOfPages) => { }}
                    onError={(error) => { }}
                    onPressLink={(uri) => { }}
                    style={[Common.flex1]}
                />
            </View>
        );
    }
}

