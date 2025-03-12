import React, { Component } from 'react';
import { TouchableHighlight, Text, PermissionsAndroid, View, Image, StatusBar, Dimensions, Alert, Platform, ScrollView, ImageBackground, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';
import appsFlyer from 'react-native-appsflyer';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const { width, height } = Dimensions.get("window")

export default class LandingView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        GoogleSignin.configure();
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Music',
                    message: 'App needs access to your Files... ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('startDownload...');
            }
        } catch (err) {
            // console.log("err catch==>", err);
        }
        // AsyncStorage.setItem('install_app_flag', JSON.stringify(0));
        // AsyncStorage.setItem('login_flag', '');  // 0 => Logout // 1 => Email  // 2 => Social
        // AsyncStorage.setItem('email', '');
        // AsyncStorage.setItem('password', '');
        // AsyncStorage.setItem('social_id', '');
        // AsyncStorage.setItem('social_type', '');
        // AsyncStorage.setItem('rate_flag', '');
        global.USER_DATA = [];
        global.USER_CREATED_DAYS = 555;
        global.IS_SUBSCRIBE = false;
        global.TAB_INDEX = 0;
        appsFlyer.initSdk(
            {
                devKey: 'aNPCN6auSrzidSGCeMrg9R',
                isDebug: false, // set to true if you want to see data in the logs 
                appId: '1456729917', // iOS app id
            },
            (result) => {
                // console.log("appsFlyer ---> ", result);
            },
            (error) => {
                // console.error("appsFlyer ---> ", error);
            }
        );

        // setTimeout(function () {
        //     const eventName = "Register";
        //     const eventValues = {
        //         id: "register id",
        //     };
        //     appsFlyer.logEvent(
        //         eventName,
        //         eventValues,
        //         (res) => {
        //             console.log("appsFlyer Event ---> ", res);
        //         },
        //         (err) => {
        //             console.error("appsFlyer Event ---> ", err);
        //         }
        //     );
        // }.bind(this), 2000);

        // setTimeout(function () {
        //     const eventName = "Purchase Success";
        //     const eventValues = {
        //         id: "purchase.productId",
        //     };
        //     appsFlyer.logEvent(
        //         eventName,
        //         eventValues,
        //         (res) => {
        //             console.log("appsFlyer Event ---> ", res);
        //         },
        //         (err) => {
        //             console.error("appsFlyer Event ---> ", err);
        //         }
        //     );
        // }.bind(this), 2000);
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

    // async getData() {
    //     AsyncStorage.getItem('login_flag', (err, login_flag) => {
    //         if (login_flag == "1") {
    //             AsyncStorage.getItem('email', (err, email) => {
    //                 if (email) {
    //                     AsyncStorage.getItem('password', (err, password) => {
    //                         if (password) {
    //                             this.checkAutoLogin(JSON.parse(login_flag), JSON.parse(email), JSON.parse(password), '', '');
    //                         }
    //                     });
    //                 }
    //             });
    //         } else if (login_flag == "2") {
    //             AsyncStorage.getItem('social_id', (err, social_id) => {
    //                 if (social_id) {
    //                     AsyncStorage.getItem('social_type', (err, social_type) => {
    //                         if (social_type) {
    //                             this.checkAutoLogin(JSON.parse(login_flag), '', '', JSON.parse(social_id), JSON.parse(social_type));
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }

    // checkAutoLogin(login_flag = "", email = "", password = "", social_id = "", social_type = "") {
    //     if (login_flag) {
    //         this.setState({ isLoading: true });
    //         var data_Array = [];
    //         if (login_flag == "1" && email && password) {
    //             data_Array.push({ name: 'email', data: email.toString() });
    //             data_Array.push({ name: 'password', data: password.toString() });
    //         } else if (login_flag == "2" && social_id && social_type) {
    //             if (social_type == "Facebook") {
    //                 data_Array.push({ name: 'fb_id', data: social_id.toString() });
    //             } else if (social_type == "Google") {
    //                 data_Array.push({ name: 'gg_id', data: social_id.toString() });
    //             } else if (social_type == "Apple") {
    //                 data_Array.push({ name: 'apple_id', data: social_id.toString() });
    //             }
    //         }
    //         ReactNativeBlobUtil.fetch('POST', global.USER_LOGIN, {
    //             'Content-Type': 'multipart/form-data',
    //         }, data_Array).then((response) => {
    //             response = response.json();
    //             var dataArray = response['user'];
    //             this.setState({ isLoading: false, });
    //             if (dataArray.length > 0) {
    //                 dataArray = dataArray[0]
    //                 if (dataArray && dataArray.fetch_flag == '1') {
    //                     AsyncStorage.setItem('login_flag', JSON.stringify(login_flag));
    //                     if (login_flag == "1" && email && password) {
    //                         AsyncStorage.setItem('email', JSON.stringify(email));
    //                         AsyncStorage.setItem('password', JSON.stringify(password));
    //                     } else if (login_flag == "2" && social_id && social_type) {
    //                         AsyncStorage.setItem('social_id', JSON.stringify(social_id));
    //                         AsyncStorage.setItem('social_type', JSON.stringify(social_type));
    //                     }
    //                     global.USER_DATA = dataArray;
    //                     webFunctions.setSubcribe();
    //                     global.TAB_INDEX = 0;
    //                     this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
    //                 }
    //             }
    //         }).catch((error) => {
    //             this.setState({ isLoading: false, });
    //             console.log("Catch error ==>", error);
    //         });
    //     }
    // }

    async googleLogin() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            var userInfo = await GoogleSignin.signIn();
            var social_id = userInfo['user'].id.toString();
            var email = userInfo['user'].email ? userInfo['user'].email.toString() : ''
            var name = userInfo['user'].name ? userInfo['user'].name.toString() : ''
            this.socialRegistration('Google', social_id, email, name)
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
                                    this.socialRegistration('Facebook', social_id, email, name)
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
            this.socialRegistration('Apple', social_id, useremail, name)
        }
    }

    socialRegistration(social_type = "", social_id = "", email = "", name = "") {
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

    openSignUp() {
        this.props.navigation.navigate('RegisterView', { transition: 'bottomUp' });
    }

    guestLogin() {
        this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
    }

    openLoginView() {
        this.props.navigation.navigate('LoginView', { transition: 'bottomUp' });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Colors.whiteBgColor]}>
                <Notification screen='LandingView' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.whiteBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.whiteBgColor} barStyle="light-content" />
                    : null}
                <ImageBackground
                    source={require('../Images/LandingViewBG.png')}
                    blurRadius={5}
                    style={[AppCommon.splashScreenLogo, Common.justifyCenter, Common.alignItmCenter]}
                    imageStyle={[AppCommon.splashScreenLogo]}>
                    <View style={[{ height: height, width: width, backgroundColor: "rgba(0,0,0,0.25)" }]}>
                        <ScrollView style={[{ width: width }]} alwaysBounceVertical={false} contentInsetAdjustmentBehavior="always" vertical={true} bounces={true}>
                            <View style={[Common.marginTop50, Common.justifyCenter, Common.alignItmCenter]}>
                                <Image source={require('../Images/Qi_Coil.png')} style={[Common.width250, Common.height250, Common.overflowHidden, Common.imageContain]} />
                            </View>
                            {/* <View style={[Common.marginTop40, Common.justifyCenter, Common.alignItmCenter]}>
                                <Text style={[AppCommon.h3, Colors.whiteFnColor]}>Resonize for Qi Coil</Text>
                            </View> */}
                            {Platform.OS == 'ios' ?
                                <TouchableHighlight
                                    onPress={() => { this.appleLogin() }}
                                    underlayColor={global.BLACK_COLOR}
                                    style={[Common.marginTop100, Common.height45, Common.marginHorizontal40, Common.borderRadius25, Colors.blackBgColor]}>
                                    <View style={[Common.flexRow, Common.height100pr]}>
                                        <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                            <Image source={require('../Images/apple_logo.png')} style={[Common.marginLeft5, AppCommon.icon24]} />
                                        </View>
                                        <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}> Sign up with Apple</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                :
                                null}
                            {/* <TouchableHighlight
                                onPress={() => { this.facebookLogin() }}
                                underlayColor={global.FACEBOOK_BG}
                                style={[Platform.OS == 'ios' ? Common.marginTop20 : Common.marginTop120, Common.height45, Common.marginHorizontal40, Common.borderRadius25, Colors.facebookBgColor]}>
                                <View style={[Common.flexRow, Common.height100pr]}>
                                    <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Image source={require('../Images/facebook.png')} style={[Common.marginLeft5, AppCommon.icon30]} />
                                    </View>
                                    <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Sign up with Facebook</Text>
                                    </View>
                                </View>
                            </TouchableHighlight> */}
                            <TouchableHighlight
                                onPress={() => { this.googleLogin() }}
                                underlayColor={global.WHITE_COLOR}
                                style={[Common.marginTop20, Common.height45, Common.marginHorizontal40, Common.borderRadius25, Colors.whiteBgColor]}>
                                <View style={[Common.flexRow, Common.height100pr]}>
                                    <View style={[Common.marginLeft10, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Image source={require('../Images/g_logo.png')} style={[Common.marginLeft5, AppCommon.icon30]} />
                                    </View>
                                    <View style={[Common.marginLeft25, Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h4, Colors.blackFnColor]}>Sign up with Google</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => { this.openSignUp() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.marginTop20, Common.height45, Common.marginHorizontal40, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                <View style={[Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>Sign up with Email</Text>
                                </View>
                            </TouchableHighlight>
                            {/* <TouchableHighlight
                                onPress={() => { this.guestLogin() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.marginTop20, Common.height45, Common.marginHorizontal40, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                <View style={[Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>Continue as Guest</Text>
                                </View>
                            </TouchableHighlight> */}
                            <View style={[Common.marginTop20, Common.flexRow, Common.height45, Common.justifyCenter, Common.alignItmCenter]}>
                                <View style={[Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Colors.lightGreyFnColor]}>Already have an account?</Text>
                                </View>
                                <TouchableHighlight
                                    onPress={() => { this.openLoginView() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.marginLeft20, Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>Log In</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop50]}></View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View >
        );
    }
}

