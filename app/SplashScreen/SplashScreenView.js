
import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, Platform, StatusBar, PermissionsAndroid, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import appsFlyer from 'react-native-appsflyer';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Notification from '../Components/Notification';
import Loader from '../Components/LoaderSecond';
import DisclaimerView from '../Components/DisclaimerView';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import frequencyData from '../Networking/frequency.json';

export default class SplashScreenView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            showSplashScreenImage: 1,
            showDisclamer: false
        }
    }

    async componentDidMount() {
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
        global.USER_DATA = [];
        global.USER_CREATED_DAYS = 555;
        global.IS_SUBSCRIBE = false;
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
        setTimeout(function () {
            this.checkDisClamer()
            this.getData()
        }.bind(this), 2000)
    }

    checkDisClamer() {
        AsyncStorage.getItem('disclaimer_flag', (err, disclaimer_flag) => {
            if (disclaimer_flag == "0" || disclaimer_flag == null || disclaimer_flag == undefined) {
                this.openDisclamer()
            }
        });
    }

    openDisclamer() {
        this.setState({ showDisclamer: true })
    }

    closeDisclamer() {
        this.setState({ showDisclamer: false })
    }

    getData() {
        AsyncStorage.getItem('login_flag', (err, login_flag) => {
            if (login_flag == "1") {
                AsyncStorage.getItem('email', (err, email) => {
                    if (email) {
                        AsyncStorage.getItem('password', (err, password) => {
                            if (password) {
                                this.checkAutoLogin(JSON.parse(login_flag), JSON.parse(email), JSON.parse(password), '', '');
                            }
                        });
                    }
                });
            } else if (login_flag == "2") {
                AsyncStorage.getItem('social_id', (err, social_id) => {
                    if (social_id) {
                        AsyncStorage.getItem('social_type', (err, social_type) => {
                            if (social_type) {
                                this.checkAutoLogin(JSON.parse(login_flag), '', '', JSON.parse(social_id), JSON.parse(social_type));
                            }
                        });
                    }
                });
            } else {
                this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
            }
        });

        AsyncStorage.getItem('frequencies_cache', (err, frequencies_cache) => {
            if (!frequencies_cache) {
                AsyncStorage.setItem('frequencies_cache', JSON.stringify({
                    data: frequencyData.frequencies,
                    lastUpdated: ''
                }))
            } else {
                let frequencies_data_cache = JSON.parse(frequencies_cache);
                const lastUpdated = frequencies_data_cache.lastUpdated
                fetch(global.GET_LAST_FREQUENCIES + '?date='+lastUpdated, {
                    method: 'GET'
                }).then(async res => {
                    if (res.ok) {
                        let updateData = await res.json();
                        let newRecords = updateData.frequencies.filter(item => item.mDate == null)
                        let oldRecords = updateData.frequencies.filter(item => item.mDate != null)
                        let frequencies_data = frequencies_data_cache.data.map(item => {
                            const _itemUpdate = oldRecords.find(_item=>_item.id == item.id)
                            if(_itemUpdate){
                                return {
                                    ...item,
                                    ..._itemUpdate
                                }
                            }
                            return item
                        })
                        AsyncStorage.setItem('frequencies_cache', JSON.stringify({
                            lastUpdated: new Date(),
                            data: [...frequencies_data, ...newRecords]
                        }))
                    }

                }).catch(error => {
                    return undefined
                })
            }
        });
    }

    checkAutoLogin(login_flag = "", email = "", password = "", social_id = "", social_type = "") {
        if (login_flag) {
            this.setState({ isLoading: true });
            var data_Array = [];
            if (login_flag == "1" && email && password) {
                data_Array.push({ name: 'email', data: email.toString() });
                data_Array.push({ name: 'password', data: password.toString() });
            } else if (login_flag == "2" && social_id && social_type) {
                if (social_type == "Facebook") {
                    data_Array.push({ name: 'fb_id', data: social_id.toString() });
                } else if (social_type == "Google") {
                    data_Array.push({ name: 'gg_id', data: social_id.toString() });
                } else if (social_type == "Apple") {
                    data_Array.push({ name: 'apple_id', data: social_id.toString() });
                }
            }
            ReactNativeBlobUtil.fetch('POST', global.USER_LOGIN, {
                'Content-Type': 'multipart/form-data',
            }, data_Array).then((response) => {
                response = response.json();
                var dataArray = response['user'];
                this.setState({ isLoading: false, });
                if (dataArray.length > 0) {
                    dataArray = dataArray[0]
                    if (dataArray && dataArray.fetch_flag == '1') {
                        AsyncStorage.setItem('login_flag', JSON.stringify(login_flag));
                        if (login_flag == "1" && email && password) {
                            AsyncStorage.setItem('email', JSON.stringify(email));
                            AsyncStorage.setItem('password', JSON.stringify(password));
                        } else if (login_flag == "2" && social_id && social_type) {
                            AsyncStorage.setItem('social_id', JSON.stringify(social_id));
                            AsyncStorage.setItem('social_type', JSON.stringify(social_type));
                        }
                        global.USER_DATA = dataArray;
                        webFunctions.setSubcribe();
                        global.TAB_INDEX = 0;
                        this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
                    }
                }

            }).catch((error) => {
                this.setState({ isLoading: false, });
                this.props.navigation.navigate('LandingView', { transition: 'bottomUp' });
                console.log("Catch error ==>", error);
            });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[AppCommon.mainContainer, Common.alignItmCenter, Common.justifyCenter, Colors.whiteBgColor]}>
                <Notification screen='SplashScreenView' />
                <Loader visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.whiteBgColor]}></SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent hidden={false} backgroundColor={Colors.whiteBgColor} barStyle="light-content" />
                    : null}
                <View style={[]}>
                    <ImageBackground
                        source={this.state.showSplashScreenImage == 1 ? require('../Images/SplashScreen_4.jpg') : this.state.showSplashScreenImage == 2 ? require('../Images/SplashScreen_2.png') : require('../Images/SplashScreen_3.png')}
                        style={[AppCommon.splashScreenLogo, Common.justifyFEnd, Common.alignItmCenter]}
                        imageStyle={[AppCommon.splashScreenLogo]}>
                        <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                            <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                <Text style={[AppCommon.h1Big2, Colors.whiteFnColor, Input.textCenter, Input.fontBold]}></Text>
                            </View>
                            <View style={[Common.marginTop3, Common.flexRow, Common.justifyCenter, Common.alignItmCenter]}>
                                <Image source={require('../Images/SplashScreenLogo_1.png')} style={[Common.width50, Common.height50, { resizeMode: "contain" }]} />
                                <Image source={require('../Images/SplashScreenLogo_2.png')} style={[Common.marginLeft10, Common.width180, Common.height50, { resizeMode: "contain" }]} />
                            </View>
                            <View style={[Common.marginBottom50]}></View>
                        </View>
                    </ImageBackground>
                </View >
                <Modal
                    transparent={true}
                    backdropOpacity={0.5}
                    animationIn={"zoomIn"}
                    animationOut={"zoomOut"}
                    onBackButtonPress={() => { this.closeDisclamer() }}
                    onBackdropPress={() => { this.closeDisclamer() }}
                    visible={this.state.showDisclamer}
                    style={[Common.margin0, Common.justifyCenter, Common.alignItmCenter]}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <DisclaimerView
                            closeDisclaimerView={() => { this.closeDisclamer() }} />
                    </View>

                </Modal>
            </View >
        );
    }
}