import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, FlatList, StatusBar, StyleSheet, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, ImageBackground, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
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

export default class RegisterView extends Component {
    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            txtname: '',
            txtemail: '',
            txtpassword: '',
            // txtdateofbirth: '',
            // strdateofbirth: '',
            // isdatepickervisible: false,
            // txtgender: '1',
            // genderArray: [{ label: "Male", value: "1" }, { label: "Female", value: "2" }]
        }
        this.inputRefs = {
            genderPicker: null,
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleOnNavigateBack = (foo) => {
        this.setState({ foo })
    }

    handleBackButton = () => {
        this.backButtonClick()
        return true;
    }

    backButtonClick() {
        this.props.navigation.goBack()
    }

    getStartedClick() {
        var name = this.state.txtname
        var email = this.state.txtemail
        var password = this.state.txtpassword
        // var dateofbirth = this.state.strdateofbirth
        // var gender = this.state.txtgender
        var errorFlag = 0
        var errorMsg = ''
        if ((name.length < 1 || !functions.isAlphabeticalWithSpaceValid(name)) && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid Name'
        }
        if ((email.length < 1 || !functions.isEmailValid(email)) && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid Email'
        }
        if ((password.length < 8 || password.length > 20) && errorFlag == 0) {
            errorFlag = 1
            errorMsg = 'Please enter valid Password \n You password must have: \n 8 to 20 characters.'
        }
        // if (dateofbirth == '' && errorFlag == 0) {
        //     errorFlag = 1
        //     errorMsg = 'Please select Date of birth'
        // } else {

        // }
        // if (gender == '' && errorFlag == 0) {
        //     errorFlag = 1
        //     errorMsg = 'Please select Gender'
        // }
        if (errorFlag == 0 && email) {
            this.setState({ isLoading: true });
            var data_Array = [];
            data_Array.push({ name: 'name', data: name.toString() });
            data_Array.push({ name: 'email', data: email.toString() });
            data_Array.push({ name: 'password', data: password.toString() });
            // data_Array.push({ name: 'dateofbirth', data: dateofbirth.toString() });
            // data_Array.push({ name: 'gender', data: gender.toString() });
            ReactNativeBlobUtil.fetch('POST', global.USER_REGISTER, {
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
                        if (dataArray.is_subscribe == '1') {
                            global.TAB_INDEX = 0;
                            this.props.navigation.navigate('HomeTabNavigator', { transition: 'bottomUp' });
                        } else {
                            this.props.navigation.navigate('SubscribeView', { transition: 'bottomUp' });
                        }
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
            Alert.alert('Alert', errorMsg, [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }]);
        }
    }

    showDatePicker = () => {
        this.setState({ isdatepickervisible: true });
    };

    hideDatePicker = () => {
        this.setState({ isdatepickervisible: false });
    };

    handleConfirm = (date) => {
        let txtdateofbirth = moment(date).format('DD/MM/YYYY')
        let strdateofbirth = moment(date).format('YYYY-MM-DD')
        this.setState({
            txtdateofbirth: txtdateofbirth,
            strdateofbirth: strdateofbirth,
        }, () => {
            this.hideDatePicker();
        });
    };

    openTermsConditions() {
        this.props.navigation.navigate('OpenWebView', {
            title: 'Terms & Conditions',
            url: global.TERMS_CONDITIONS,
            transition: 'bottomUp'
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const pickerSelectStyles = StyleSheet.create({
            inputIOS: {
                fontFamily: global.DEFAULT_FONT,
                fontSize: (global.IS_IPAD ? 26 : 16),
                lineHeight: (global.IS_IPAD ? 32 : 20),
                color: global.WHITE_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                height: "100%",
                marginTop: -global.Gap_1,
                placeholderTextColor: global.BLACK_COLOR,
            },
            inputAndroid: {
                fontFamily: global.DEFAULT_FONT,
                fontSize: (global.IS_IPAD ? 26 : 16),
                lineHeight: (global.IS_IPAD ? 32 : 20),
                color: global.WHITE_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                height: "100%",
                marginTop: -global.Gap_1,
                placeholderTextColor: global.BLACK_COLOR,
            }
        });
        return (
            <View style={[AppCommon.mainContainer, Colors.whiteBgColor]}>
                <Notification screen='RegisterView' />
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
                                <Text style={[AppCommon.h1, Colors.whiteFnColor, Input.fontBold]}>Create Account</Text>
                            </View>
                            <View style={[Common.marginTop40]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Your name</Text>
                            </View>
                            <View style={[Common.marginTop5, Common.paddingHorizontal15, Common.height40, Common.borderRadius5, Common.overflowHidden, { backgroundColor: '#D9E0E8' }]}>
                                <TextInput
                                    style={[AppCommon.loginInput]}
                                    ref='txtname'
                                    keyboardType="default"
                                    returnKeyType="next"
                                    autoCapitalize='words'
                                    placeholder="Enter name"
                                    maxLength={250}
                                    placeholderTextColor={global.BLACK_COLOR}
                                    underlineColorAndroid={'transparent'}
                                    onSubmitEditing={() => { this.refs.txtemail.focus() }}
                                    onChangeText={(txtname) => { this.setState({ txtname: txtname }) }}
                                    value={this.state.txtname}
                                />
                            </View>
                            <View style={[Common.marginTop20]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Your email</Text>
                            </View>
                            <View style={[Common.marginTop5, Common.paddingHorizontal15, Common.height40, Common.borderRadius5, Common.overflowHidden, { backgroundColor: '#D9E0E8' }]}>
                                <TextInput
                                    style={[AppCommon.loginInput]}
                                    ref='txtemail'
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    autoCapitalize='none'
                                    placeholder="Enter email"
                                    maxLength={250}
                                    placeholderTextColor={global.BLACK_COLOR}
                                    underlineColorAndroid={'transparent'}
                                    onSubmitEditing={() => { this.refs.txtpassword.focus() }}
                                    onChangeText={(txtemail) => { this.setState({ txtemail: txtemail }) }}
                                    value={this.state.txtemail}
                                />
                            </View>
                            <View style={[Common.marginTop20]}>
                                <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Create a password</Text>
                            </View>
                            <View style={[Common.marginTop5, Common.paddingHorizontal15, Common.height40, Common.borderRadius5, Common.overflowHidden, { backgroundColor: '#D9E0E8' }]}>
                                <TextInput
                                    style={[AppCommon.loginInput]}
                                    ref='txtpassword'
                                    keyboardType="default"
                                    returnKeyType="next"
                                    autoCapitalize='none'
                                    placeholder="Enter password"
                                    maxLength={250}
                                    placeholderTextColor={global.BLACK_COLOR}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    onSubmitEditing={() => { }}
                                    onChangeText={(txtpassword) => { this.setState({ txtpassword: txtpassword }) }}
                                    value={this.state.txtpassword}
                                />
                            </View>
                            {/* <View style={[Common.marginTop20, Common.flexRow, Common.justifySBetween]}>
                                <View style={[{ width: (width / 2) - global.Gap_50 }]}>
                                    <View style={[]}>
                                        <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Date of birth</Text>
                                    </View>
                                    <TouchableHighlight
                                        underlayColor={global.TRANSPARENT_COLOR}
                                        onPress={() => { this.showDatePicker() }}
                                        style={[Common.marginTop5, Common.height40, Common.borderRadius5, Common.border2, Colors.whiteBorder]}>
                                        <View style={[Common.flexRow, Common.paddingHorizontal10, Common.height100pr, Common.justifySBetween, Common.alignItmCenter]}>
                                            <Text style={[AppCommon.h4, Colors.whiteFnColor]}>{this.state.txtdateofbirth ? this.state.txtdateofbirth : ''}</Text>
                                            <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/down_arrow.png')} />
                                        </View>
                                    </TouchableHighlight>
                                    <DateTimePickerModal
                                        isVisible={this.state.isdatepickervisible}
                                        mode="date"
                                        maximumDate={new Date()}
                                        onConfirm={this.handleConfirm}
                                        onCancel={this.hideDatePicker}
                                    />
                                </View>
                                <View style={[{ width: (width / 2) - global.Gap_50 }]}>
                                    <View style={[]}>
                                        <Text style={[AppCommon.h4, Colors.whiteFnColor]}>Gender</Text>
                                    </View>
                                    <TouchableHighlight
                                        underlayColor={global.TRANSPARENT_COLOR}
                                        onPress={() => { this.inputRefs.genderPicker.togglePicker(true); }}
                                        style={[Common.marginTop5, Common.height40, Common.borderRadius5, Common.border2, Colors.whiteBorder]}>
                                        <View style={[Common.flexRow, Common.paddingHorizontal10, Common.height100pr, Common.justifySBetween, Common.alignItmCenter]}>
                                            <RNPickerSelect
                                                style={pickerSelectStyles}
                                                onClick={true}
                                                doneText='Done'
                                                onOpen={() => { }}
                                                placeholder={{}}
                                                // placeholder={{ label: '', value: '' }}
                                                //InputAccessoryView={this.InputAccessoryView}
                                                onValueChange={value => {
                                                    this.setState({ txtgender: value }, () => {
                                                    });
                                                }}
                                                items={this.state.genderArray}
                                                ref={el => { this.inputRefs.genderPicker = el; }}
                                            />
                                            <Image style={[AppCommon.icon20, Colors.whiteTnColor]} source={require('../Images/down_arrow.png')} />
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View> */}
                            <View style={[Common.marginTop80, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.getStartedClick() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.height45, Common.width180, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>DONE</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop110, Common.justifyCenter, Common.alignItmCenter]}>
                                <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h5, Colors.fullLightGreyFnColor, Input.textCenter]}>By clicking on "Sign up", you accept the</Text>
                                </View>
                                <TouchableHighlight
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    onPress={() => { this.openTermsConditions() }}
                                    style={[Common.marginTop5, Common.justifyCenter, Common.alignItmCenter]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.textCenter, Input.textUnderline]}>Terms and Conditions of Use.</Text>
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