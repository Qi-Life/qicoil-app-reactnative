import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, FlatList, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, ImageBackground, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Notification from '../Components/Notification';
import Loader from '../Components/Loader';
import LoaderSecond from '../Components/LoaderSecond';
import { WebView } from "react-native-webview";

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const { width, height } = Dimensions.get("window")

export default class HelpSupport extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            callType: '',
            txtname: '',
            txtemail: '',
            txtmessage: '',
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let callType = this.props.navigation.getParam('callType', '');
        this.setState({
            callType: callType,
        }, () => {
        });
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

    sendMessage() {
        var name = this.state.txtname
        var email = this.state.txtemail
        var message = this.state.txtmessage
        var errorFlag = 0
        var errorMsg = ''
        if (name.length < 1) {
            errorFlag = 1
            errorMsg = errorMsg + 'Please Enter Valid Name\n'
        }
        if (email.length < 1) {
            errorFlag = 1
            errorMsg = errorMsg + 'Please Enter Valid Email\n'
        }
        if (message.length < 1) {
            errorFlag = 1
            errorMsg = errorMsg + 'Please Enter Valid Message'
        }
        if (errorFlag == 0) {
            this.setState({ isLoading: true });
            var authorization = ""
            if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
                authorization += "Bearer " + global.USER_DATA.token
            }
            var data_Array = [];
            data_Array.push({ name: 'name', data: name.toString() });
            data_Array.push({ name: 'email', data: email.toString() });
            data_Array.push({ name: 'message', data: message.toString() });
            if (global.USER_DATA.id && global.USER_DATA.id != undefined) {
                data_Array.push({ name: 'user_id', data: global.USER_DATA.id.toString() });
            }
            ReactNativeBlobUtil.fetch('POST', global.SAVE_SUPPORT_MSG, {
                'Content-Type': 'multipart/form-data', 'Authorization': authorization,
            }, data_Array).then((response) => {
                response = response.json();
                let resultArray = response['user'];
                if (resultArray.length > 0) {
                    var dataArray = resultArray[0];
                    if (dataArray.fetch_flag == "1") {
                        Alert.alert(dataArray.rsp_title, dataArray.rsp_msg, [{
                            text: 'Ok ',
                            onPress: () => { this.backButtonClick() },
                            style: 'cancel'
                        }])
                    } else {
                        Alert.alert(dataArray.rsp_title, dataArray.rsp_msg, [{
                            text: 'Ok ',
                            onPress: () => { },
                            style: 'cancel'
                        }])
                    }
                    this.setState({ isLoading: false, });
                } else {
                    this.setState({ isLoading: false, });
                    Alert.alert('NOTIFICATION', 'Something went wrong, please try again', [{
                        text: 'Ok',
                        onPress: () => { },
                        style: 'cancel'
                    }]);
                }
            }).catch((error) => {
                this.setState({ isLoading: false });
                Alert.alert('NOTIFICATION', 'Something went wrong, please try again', [{
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }]);
            });
            // let resultArray = response['support_details'];
        } else {
            Alert.alert('Alert', errorMsg, [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }]);
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='HelpSupport' />
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
                            {this.state.callType != 'SettingsTab' ?
                                <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold, Input.textCenter]}>{'We appreciate your feedback. \n Please let us know how we can improve.'}</Text>
                                :
                                <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.fontBold]}>Help & Support</Text>
                            }
                        </View>
                    </View>
                </ImageBackground>
                <KeyboardAwareScrollView style={[]} resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={[]} scrollEnabled={true} >
                    <View style={[AppCommon.container, Common.marginHorizontal15]}>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Name</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius5, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportInput]}
                                ref='txtname'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                placeholderTextColor={global.GREY_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { this.refs.txtemail.focus() }}
                                onChangeText={(txtname) => { this.setState({ txtname: txtname }) }}
                                value={this.state.txtname}
                            />
                        </View>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Email</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius5, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportInput]}
                                ref='txtemail'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                placeholderTextColor={global.GREY_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { this.refs.txtmessage.focus() }}
                                onChangeText={(txtemail) => { this.setState({ txtemail: txtemail }) }}
                                value={this.state.txtemail}
                            />
                        </View>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Message</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius10, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportDescriprion]}
                                ref='txtmessage'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                multiline={true}
                                placeholderTextColor={global.GREY_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { }}
                                onChangeText={(txtmessage) => { this.setState({ txtmessage: txtmessage }) }}
                                value={this.state.txtmessage}
                            />
                        </View>
                        <View style={[Common.marginTop50, Common.justifyCenter, Common.alignItmCenter]}>
                            <TouchableHighlight
                                onPress={() => { this.sendMessage() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.height45, Common.width150, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>SEND</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={[Common.marginTop30]}></View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

