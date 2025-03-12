import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, StatusBar, Dimensions, Alert, Platform, TextInput, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import appleAuth  from '@invertase/react-native-apple-authentication';
import LinearGradient from 'react-native-linear-gradient';
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

export default class LoginView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            txtEmail: '',
            txtPassword: '',
            // txtEmail: 'vietluy1@yopmail.com',
            // txtPassword: '123123',
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        global.USER_DATA = [];
        global.USER_CREATED_DAYS = 555;
        global.IS_SUBSCRIBE = false;
        GoogleSignin.configure();
    }

    componentWillReceiveProps(nextProps) {
        global.USER_DATA = [];
        global.USER_CREATED_DAYS = 555;
        global.IS_SUBSCRIBE = false;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

    checkLogin() {
        var email = this.state.txtEmail
        var password = this.state.txtPassword
        if (email && password) {
            this.setState({ isLoading: true });
            var data_Array = [];
            data_Array.push({ name: 'email', data: email.toString() });
            data_Array.push({ name: 'password', data: password.toString() });
            ReactNativeBlobUtil.fetch('POST', global.USER_LOGIN, {
                'Content-Type': 'multipart/form-data',
            }, data_Array).then((response) => {
                response = response.json();
                var dataArray = response['user'];
                this.setState({ isLoading: false, });
                if (dataArray.length > 0) {
                    dataArray = dataArray[0]
                    if (dataArray && dataArray.fetch_flag == '1') {
                        AsyncStorage.setItem('login_flag', JSON.stringify(1));
                        AsyncStorage.setItem('email', JSON.stringify(email));
                        AsyncStorage.setItem('password', JSON.stringify(password));
                        AsyncStorage.setItem('social_id', '');
                        AsyncStorage.setItem('social_type', '');
                        global.USER_DATA = dataArray;
                        webFunctions.setSubcribe();
                        global.TAB_INDEX = 0;
                        this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
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
            }).catch((error) => {
                this.setState({ isLoading: false });
                Alert.alert('Alert', 'Something went wrong, please try again', [{
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }]);
            });
        } else {
            Alert.alert('Incorrect Details', 'The Email and Password is incorrect. Please insert the correct details.', [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }]);
        }
    }

    async googleLogin() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            var userInfo = await GoogleSignin.signIn();
            var social_id = userInfo['user'].id.toString();
            var email = userInfo['user'].email ? userInfo['user'].email.toString() : ''
            var name = userInfo['user'].name ? userInfo['user'].name.toString() : ''
            this.checkSocialLogin('Google', social_id, email, name)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            } else {
            }
        }
    }

    async facebookLogin() {
        if (Platform.OS === "android") {
            LoginManager.setLoginBehavior("web_only")
        }
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            function (result) {
                if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            global.FACEBOOK_ACCESSTOKEN = data.accessToken.toString()
                            var url = "https://graph.facebook.com/v3.3/me?fields=email,picture.type(large),name,first_name,last_name&access_token=" + data.accessToken.toString();
                            fetch(url).then((response) => response.json())
                                .then((userData) => {
                                    var social_id = userData.id.toString();
                                    var email = userData.email ? userData.email.toString() : ''
                                    var first_name = userData.first_name ? userData.first_name.toString() : ''
                                    var last_name = userData.last_name ? userData.last_name.toString() : ''

                                    var name = ""
                                    name = first_name ? first_name : ""
                                    name = name ? name + " " : ""
                                    name += last_name ? last_name : ""
                                    this.checkSocialLogin('Facebook', social_id, email, name)
                                })
                                .catch((error) => {
                                    Alert.alert('ERROR GETTING DATA FROM FACEBOOK', error.toString(), [{
                                        text: 'Ok',
                                        onPress: () => { },
                                        style: 'cancel'
                                    }]);
                                });
                            return;
                        }
                    )
                }
            }.bind(this),
            function (error) {
            }
        )
    }

    async appleLogin() {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            // requestedOperation: AppleAuthRequestOperation.LOGIN,
            // requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        const {
            user: newUser,
            email,
            fullName,
            nonce,
            identityToken,
        } = appleAuthRequestResponse;
        user = newUser;
        // if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        if (credentialState === appleAuth.State.AUTHORIZED) {
            var social_id = user == null ? '' : user
            var useremail = email == null ? '' : email

            var fullNameArray = fullName
            var first_name = fullNameArray.givenName == null ? '' : fullNameArray.givenName
            var last_name = fullNameArray.familyName == null ? '' : fullNameArray.familyName

            var name = ""
            name = first_name ? first_name : ""
            name = name ? name + " " : ""
            name += last_name ? last_name : ""
            this.checkSocialLogin('Apple', social_id, useremail, name)
        }
    }

    checkSocialLogin(social_type = "", social_id = "", email = "", name = "") {
        if (social_type && social_id) {
            this.setState({ isLoading: true });
            var data_Array = [];
            if (social_type == "Facebook") {
                data_Array.push({ name: 'fb_id', data: social_id.toString() });
            } else if (social_type == "Google") {
                data_Array.push({ name: 'gg_id', data: social_id.toString() });
            } else if (social_type == "Apple") {
                data_Array.push({ name: 'apple_id', data: social_id.toString() });
            }
            data_Array.push({ name: 'name', data: name.toString() });
            data_Array.push({ name: 'email', data: email.toString() });
            ReactNativeBlobUtil.fetch('POST', global.USER_LOGIN, {
                'Content-Type': 'multipart/form-data',
            }, data_Array).then((response) => {
                response = response.json();
                var dataArray = response['user'];
                this.setState({ isLoading: false, });
                if (dataArray.length > 0) {
                    dataArray = dataArray[0]
                    if (dataArray && dataArray.fetch_flag == '1') {
                        AsyncStorage.setItem('login_flag', JSON.stringify(2));
                        AsyncStorage.setItem('social_id', JSON.stringify(social_id));
                        AsyncStorage.setItem('social_type', JSON.stringify(social_type));
                        AsyncStorage.setItem('email', '');
                        AsyncStorage.setItem('password', '');
                        global.USER_DATA = dataArray;
                        webFunctions.setSubcribe();
                        global.TAB_INDEX = 0;
                        this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
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
            }).catch((error) => {
                this.setState({ isLoading: false });
                Alert.alert('Alert', 'Something went wrong, please try again', [{
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }]);
            });
        }
    }

    openForgotPassword() {
        this.props.navigation.navigate('ForgotPassword', { transition: 'bottomUp' });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Colors.whiteBgColor]}>
                <Notification screen='LoginView' />
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
                                <Text style={[AppCommon.h1, Colors.whiteFnColor, Input.fontBold]}>Log In</Text>
                            </View>
                            <View style={[Common.marginTop40]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Email</Text>
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
                                    onSubmitEditing={() => { this.refs.txtPassword.focus() }}
                                    onChangeText={(txtEmail) => { this.setState({ txtEmail: txtEmail }) }}
                                    value={this.state.txtEmail}
                                />
                            </View>
                            <View style={[Common.marginTop20]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Password</Text>
                            </View>
                            <View style={[Common.marginTop5, Common.paddingHorizontal15, Common.height40, Common.borderRadius5, Common.overflowHidden, { backgroundColor: '#D9E0E8' }]}>
                                <TextInput
                                    style={[AppCommon.loginInput]}
                                    ref='txtPassword'
                                    keyboardType="default"
                                    returnKeyType="go"
                                    autoCapitalize='none'
                                    placeholder="Enter password"
                                    maxLength={250}
                                    placeholderTextColor={global.BLACK_COLOR}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    onSubmitEditing={() => { this.checkLogin() }}
                                    onChangeText={(txtPassword) => { this.setState({ txtPassword: txtPassword }) }}
                                    value={this.state.txtPassword}
                                />
                            </View>
                            <View style={[Common.marginTop30, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    onPress={() => this.openForgotPassword()}
                                    style={[]}>
                                    <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h5, Colors.whiteFnColor, Input.textCenter, Input.textUnderline]}>Forgot password?</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop30, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.checkLogin() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.height45, Common.width180, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>LOG IN</Text>
                                </TouchableHighlight>
                            </View>
                            {Platform.OS == 'ios' ?
                                <TouchableHighlight
                                    onPress={() => { this.appleLogin() }}
                                    underlayColor={global.BLACK_COLOR}
                                    style={[Common.marginTop80, Common.height45, Common.marginHorizontal10, Common.borderRadius25, Colors.blackBgColor]}>
                                    <View style={[Common.flexRow, Common.height100pr]}>
                                        <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                            <Image source={require('../Images/apple_logo.png')} style={[Common.marginLeft5, AppCommon.icon24]} />
                                        </View>
                                        <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}> Log in with Apple</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                :
                                null}
                            {/* <TouchableHighlight
                                onPress={() => { this.facebookLogin() }}
                                underlayColor={global.FACEBOOK_BG}
                                style={[Platform.OS == 'ios' ? Common.marginTop20 : Common.marginTop100, Common.height45, Common.marginHorizontal10, Common.borderRadius25, Colors.facebookBgColor]}>
                                <View style={[Common.flexRow, Common.height100pr]}>
                                    <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Image source={require('../Images/facebook.png')} style={[Common.marginLeft5, AppCommon.icon30]} />
                                    </View>
                                    <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Log in with Facebook</Text>
                                    </View>
                                </View>
                            </TouchableHighlight> */}
                            <TouchableHighlight
                                onPress={() => { this.googleLogin() }}
                                underlayColor={global.WHITE_COLOR}
                                style={[Common.marginTop20, Common.height45, Common.marginHorizontal10, Common.borderRadius25, Colors.whiteBgColor]}>
                                <View style={[Common.flexRow, Common.height100pr]}>
                                    <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Image source={require('../Images/g_logo.png')} style={[Common.marginLeft5, AppCommon.icon30]} />
                                    </View>
                                    <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h4, Colors.blackFnColor]}>Log in with Google</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <View style={[Common.marginTop50]}></View>
                        </View>
                    </KeyboardAwareScrollView>
                </LinearGradient>
            </View>
        );
    }
}

