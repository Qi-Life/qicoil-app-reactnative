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

export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            txtname: '',
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        if (global.USER_DATA.name && global.USER_DATA.name != undefined) {
            this.setState({ txtname: global.USER_DATA.name })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (global.USER_DATA.name && global.USER_DATA.name != undefined) {
            this.setState({ txtname: global.USER_DATA.name })
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.backButtonClick()
        return true;
    }

    backButtonClick() {
        this.props.navigation.state.params.onNavigateBack(true)
        this.props.navigation.goBack()
    }

    handleOnNavigateBack = (foo) => {
        this.setState({ foo })
    }

    saveClick() {
        var name = this.state.txtname
        var errorFlag = 0
        var errorMsg = ''
        if (name.length < 1) {
            errorFlag = 1
            errorMsg = errorMsg + 'Please Enter Valid Name\n'
        }
        if (errorFlag == 0) {
            this.setState({ isLoading: true });
            var authorization = ""
            if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
                authorization += "Bearer " + global.USER_DATA.token
            }
            var data_Array = [];
            data_Array.push({ name: 'name', data: name.toString() });
            ReactNativeBlobUtil.fetch('POST', global.USER_UPDATE_NAME, {
                'Content-Type': 'multipart/form-data', 'Authorization': authorization,
            }, data_Array).then((response) => {
                response = response.json();
                let resultArray = response['user'];
                if (resultArray.length > 0) {
                    var dataArray = resultArray[0];
                    if (dataArray.fetch_flag == "1") {
                        global.USER_DATA.name = name
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

    changePasswordClick() {
        this.props.navigation.navigate('ChangePassword', { transition: 'bottomUp' });
    }

    deleteAccountClick() {
        Alert.alert(
            'Qi Coil',
            'Are you sure you want to delete user account?', [{
                text: 'NO',
                onPress: () => { },
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => { this.removeAccount() },
            },], {
            cancelable: false
        })

    }

    removeAccount() {
        Alert.prompt(
            "Qi Coil",
            "",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => { },
                },
                {
                    text: "Delete Account",
                    style: "destructive",
                    onPress: (password) => {
                        if (password && password != undefined) {
                            this.removeAcc(password)
                        } else {
                            this.removeAccount()
                        }
                    },
                },
            ],
            "secure-text"
        );
    }

    removeAcc(password = '') {
        this.setState({ isLoading: true });
        var authorization = ""
        if (global.USER_DATA.token && global.USER_DATA.token != undefined) {
            authorization += "Bearer " + global.USER_DATA.token
        }
        var data_Array = [];
        data_Array.push({ name: 'password', data: password.toString() });
        ReactNativeBlobUtil.fetch('POST', global.DELETE_USER_PROFILE, {
            'Content-Type': 'multipart/form-data', 'Authorization': authorization,
        }, data_Array).then((response) => {
            response = response.json();
            let resultArray = response['user'];
            if (resultArray.length > 0) {
                var dataArray = resultArray[0];
                if (dataArray.fetch_flag == "1") {
                    Alert.alert(dataArray.rsp_title, dataArray.rsp_msg, [{
                        text: 'Ok ',
                        onPress: () => { this.userLogOut() },
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
    }

    userLogOut() {
        AsyncStorage.setItem('email', '');
        AsyncStorage.setItem('password', '');
        AsyncStorage.setItem('social_id', '');
        AsyncStorage.setItem('social_type', '');
        AsyncStorage.setItem('login_flag', '', () => {
            global.TAB_INDEX = 0;
            global.USER_DATA = [];
            global.USER_CREATED_DAYS = 555;
            global.IS_SUBSCRIBE = false;
            this.props.navigation.navigate('LandingView', { transition: 'default' });
        });
    }


    render() {
        const { navigate } = this.props.navigation;
        var email = ''
        if (global.USER_DATA.email && global.USER_DATA.email != undefined) {
            email = global.USER_DATA.email
        }
        return (
            <View style={[AppCommon.mainContainer, Colors.lightBlackBgColor]}>
                <Notification screen='EditProfile' />
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
                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.fontBold]}>Edit Profile</Text>
                        </View>
                    </View>
                </ImageBackground>
                <KeyboardAwareScrollView style={[]} resetScrollToCoords={{ x: 0, y: 0 }} contentContainerStyle={[]} scrollEnabled={true} >
                    <View style={[AppCommon.container, Common.marginHorizontal15]}>
                        <View style={[Common.marginTop30, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Email</Text>
                        </View>
                        <View style={[Common.marginTop10, Common.justifyCenter]}>
                            <Text style={[AppCommon.h4, Input.fontBold, Colors.whiteFnColor]}>{email}</Text>
                        </View>
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
                                onSubmitEditing={() => { this.saveClick() }}
                                onChangeText={(txtname) => { this.setState({ txtname: txtname }) }}
                                value={this.state.txtname}
                            />
                        </View>
                        <View style={[Common.marginTop60, Common.justifyCenter]}>
                            <TouchableHighlight
                                onPress={() => { this.changePasswordClick() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.justifyCenter]}>
                                <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Change Password</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={[Common.marginTop20, Common.justifyCenter]}>
                            <TouchableHighlight
                                onPress={() => { this.deleteAccountClick() }}
                                underlayColor={global.TRANSPARENT_COLOR}
                                style={[Common.justifyCenter]}>
                                <Text style={[AppCommon.h3, Input.fontBold, Colors.whiteFnColor]}>Delete Account</Text>
                            </TouchableHighlight>
                        </View>

                        <View style={[Common.marginTop50, Common.justifyCenter, Common.alignItmCenter]}>
                            <TouchableHighlight
                                onPress={() => { this.saveClick() }}
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

