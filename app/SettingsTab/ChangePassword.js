import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, ImageBackground, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';

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

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            txtoldpass: '',
            txtpassword: '',
            txtconfirmpass: '',
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

    updatePassword() {
        var oldpassword = this.state.txtoldpass
        var password = this.state.txtpassword
        var confpassword = this.state.txtconfirmpass
        var errorFlag = 0
        var errorMsg = ''
        if (oldpassword.length < 1 && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid Current Password'
        }
        if ((password.length < 8 || password.length > 20) && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid New Password \n You password must have: \n 8 to 20 characters.'
        }
        if (password != confpassword && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Your New Password and Confirm New Password do not match'
        }
        if (errorFlag == 0) {
            this.setState({ isLoading: true });
            var authorization = ""
            if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
                authorization += "Bearer " + global.USER_DATA.token
            }
            var data_Array = [];
            data_Array.push({ name: 'password_old', data: oldpassword.toString() });
            data_Array.push({ name: 'password', data: password.toString() });
            data_Array.push({ name: 'password_confirmation', data: confpassword.toString() });
            ReactNativeBlobUtil.fetch('POST', global.USER_UPDATE_PASSWORD, {
                'Content-Type': 'multipart/form-data', 'Authorization': authorization,
            }, data_Array).then((response) => {
                response = response.json();
                let resultArray = response['user'];
                if (resultArray.length > 0) {
                    var dataArray = resultArray[0];
                    if (dataArray.fetch_flag == "1") {
                        AsyncStorage.setItem('password', JSON.stringify(password));
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
                <Notification screen='ChangePassword' />
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
                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.fontBold]}>Change Password</Text>
                        </View>
                    </View>
                </ImageBackground>
                <KeyboardAwareScrollView style={[]} resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={[]} scrollEnabled={true} >
                    <View style={[AppCommon.container, Common.marginHorizontal15]}>
                        <View style={[Common.marginTop50, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Current Password</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius5, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportInput]}
                                ref='txtoldpass'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                placeholderTextColor={global.WHITE_COLOR}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                onSubmitEditing={() => { this.refs.txtpassword.focus() }}
                                onChangeText={(txtoldpass) => { this.setState({ txtoldpass: txtoldpass }) }}
                                value={this.state.txtoldpass}
                            />
                        </View>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>New Password</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius5, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportInput]}
                                ref='txtpassword'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                placeholderTextColor={global.WHITE_COLOR}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                onSubmitEditing={() => { this.refs.txtconfirmpass.focus() }}
                                onChangeText={(txtpassword) => { this.setState({ txtpassword: txtpassword }) }}
                                value={this.state.txtpassword}
                            />
                        </View>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Confirm New Password</Text>
                        </View>
                        <View style={[Common.marginTop7, Common.paddingHorizontal10, Common.paddingVertical10, Common.borderRadius5, Colors.greyBgColor]}>
                            <TextInput
                                style={[AppCommon.helpSupportInput]}
                                ref='txtconfirmpass'
                                keyboardType="default"
                                returnKeyType="go"
                                autoCapitalize='none'
                                placeholder=""
                                maxLength={250}
                                placeholderTextColor={global.WHITE_COLOR}
                                underlineColorAndroid={'transparent'}
                                onSubmitEditing={() => { this.updatePassword() }}
                                onChangeText={(txtconfirmpass) => { this.setState({ txtconfirmpass: txtconfirmpass }) }}
                                value={this.state.txtconfirmpass}
                            />
                        </View>
                        <View style={[Common.marginTop80, Common.justifyCenter, Common.alignItmCenter]}>
                            <TouchableHighlight
                                onPress={() => { this.updatePassword() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.height45, Common.width150, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>SAVE</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={[Common.marginTop30]}></View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

