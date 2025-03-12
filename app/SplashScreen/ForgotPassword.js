import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, FlatList, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, ImageBackground, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

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

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            txtEmail: '',
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

    sendMail() {
        var email = this.state.txtEmail
        var errorFlag = 0
        var errorMsg = ''
        if ((email.length < 1 || !functions.isEmailValid(email)) && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid Email'
        }
        if (errorFlag == 0) {
            this.setState({ isLoading: true });
            var query_string = "";
            query_string += "?email=" + email;
            var url = encodeURI(USER_FORGOT_PASSWORD + query_string);
            fetch(url, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then(res => res.json())
                .then(response => {
                    var dataArray = response['user'];
                    this.setState({ isLoading: false, });
                    if (dataArray.length > 0) {
                        dataArray = dataArray[0]
                        if (dataArray && dataArray.fetch_flag == '1') {
                            Alert.alert(dataArray.rsp_title, dataArray.rsp_msg, [{
                                text: 'Ok',
                                onPress: () => { this.backButtonClick() },
                                style: 'cancel'
                            }]);
                        } else {
                            Alert.alert(dataArray.rsp_title, dataArray.rsp_msg, [{
                                text: 'Ok',
                                onPress: () => { },
                                style: 'cancel'
                            }]);
                        }
                    } else {
                        Alert.alert('NOTIFICATION', 'Something went wrong, please try again', [{
                            text: 'Ok',
                            onPress: () => { },
                            style: 'cancel'
                        }]);
                    }
                }).catch(error => {
                    this.setState({ isLoading: false });
                    Alert.alert('Alert', 'Something went wrong, please try again', [{
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
            <View style={[AppCommon.mainContainer, Colors.whiteBgColor]}>
                <Notification screen='ForgotPassword' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.whiteBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.whiteBgColor} barStyle="light-content" />
                    : null}
                <LinearGradient
                    style={{ width: width, height: height }}
                    colors={[global.GRADIENT_TOP_COLOR, global.GRADIENT_BOTTOM_COLOR]}>
                    <KeyboardAwareScrollView style={[{ width: width }]} resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={[]} scrollEnabled={true} >
                        <View style={[AppCommon.container, Common.paddingHorizontal30]}>
                            <TouchableHighlight
                                style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.width30, Common.height30, Common.justifyCenter, Common.alignItmCenter]}
                                underlayColor={global.TRANSPARENT_COLOR}
                                onPress={() => { this.backButtonClick() }}>
                                <Image style={[AppCommon.icon20, Colors.whiteTnColor, { marginLeft: -(global.IS_IPAD ? 10 : 10) }]} source={require('../Images/left_arrow.png')} />
                            </TouchableHighlight>
                            <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                <Text style={[AppCommon.h1, Colors.whiteFnColor, Input.fontBold]}>Forgot Password</Text>
                            </View>
                            {/* <View style={[Common.marginTop100, Common.justifyCenter, Common.alignItmCenter]}>
                                <Image source={require('../Images/Qi_Coil.png')} style={[Common.width150, Common.height150, Common.overflowHidden]} />
                            </View> */}
                            <View style={[Common.marginTop60]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Your email</Text>
                            </View>
                            <View style={[Common.marginTop5, Common.paddingHorizontal15, Common.height40, Common.borderRadius5, Common.overflowHidden, { backgroundColor: '#D9E0E8' }]}>
                                <TextInput
                                    style={[AppCommon.loginInput]}
                                    ref='txtEmail'
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    autoCapitalize='none'
                                    placeholder="Enter email"
                                    maxLength={250}
                                    placeholderTextColor={global.BLACK_COLOR}
                                    underlineColorAndroid={'transparent'}
                                    onSubmitEditing={() => { this.sendMail() }}
                                    onChangeText={(txtEmail) => { this.setState({ txtEmail: txtEmail }) }}
                                    value={this.state.txtEmail}
                                />
                            </View>
                            <View style={[Common.marginTop60, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.sendMail() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.height45, Common.width180, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>SEND MAIL</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop50]}></View>
                        </View>
                    </KeyboardAwareScrollView>
                </LinearGradient>
            </View>
        );
    }
}

