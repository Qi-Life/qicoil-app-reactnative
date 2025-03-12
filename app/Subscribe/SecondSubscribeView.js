import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, FlatList, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, ImageBackground, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
    flushFailedPurchasesCachedAsPendingAndroid,
    clearTransactionIOS,
    getSubscriptions,
    acknowledgePurchaseAndroid,
    initConnection,
    getAvailablePurchases,
    requestSubscription,
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';

import Notification from '../Components/Notification';
import LoaderSecond from '../Components/LoaderSecond';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import AppContext from '../Context/AppContext';

const { width, height } = Dimensions.get("window")

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class SecondSubscribeView extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        functions = new Functions();
        webFunctions = new WebFunctions();
        this.state = {
            isLoading: false,
            callType: '',
            subscription_amt: '',
            subscribeList: [
                { name: 'Unlimited access to 10,000+ Rife frequencies' },
                { name: 'Unlimited play duration' },
                { name: 'Create your own Rife programs' },
                { name: 'No restrictions' },
                { name: 'No Ads' },
            ],
            productList: [],
            myReceipt: null,
            select_iap: '',
            iOSPrice: '59.99',
            iOSQuatumOneYear: "resonize.qicoil.annual",
            androidPrice: '59.99',
            androidQuatumOneYear: "resonize.quantum.annual",
        }
        this.clickContinue = this.clickContinue.bind(this);
        this.clickRestorePurchases = this.clickRestorePurchases.bind(this)
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let callType = this.props.navigation.getParam('callType', '');
        this.setState({
            callType: callType,
        }, () => {
        });
        try {
            const result = await initConnection();
            // console.log('connection is => ', result);
            // await consumeAllItemsAndroid();
            if (Platform.OS === 'android') {
                await flushFailedPurchasesCachedAsPendingAndroid();
            } else {
                await clearTransactionIOS();
            }
        } catch (err) {
            // console.log('error in cdm => ', err);
        }
        var select_iap = ''
        if (Platform.OS == 'ios') {
            select_iap = this.state.iOSQuatumOneYear
        } else {
            select_iap = this.state.androidQuatumOneYear
        }
        this.setState({
            select_iap: select_iap,
        }, () => {
            this.getSubscriptionAmt()
        });
        clearInterval(this.interval)
        this.interval = setInterval(() => {
            // console.log('global.TEMP_TIME ==>', global.TEMP_TIME)
            this.setState({ foo: true, });
        }, 1000)
        AsyncStorage.getItem('temp_date_time', (err, temp_date_time) => {
            // console.log('temp_date_time ==>', temp_date_time)
            if (temp_date_time == '0' || temp_date_time == null || temp_date_time == 'null') {
                global.TEMP_TIME = 0
            } else {
                var currentDate = moment();
                var minutes = currentDate.diff(JSON.parse(temp_date_time), 'minutes')
                // console.log('currentDate ==>', currentDate)
                // console.log('minutes ==>', minutes)
                if (minutes < 60) {
                    minutes = 60 - minutes
                    // console.log('minutes 2 ==>', minutes)
                    var seconds = (minutes) * 60;
                    // console.log('seconds ==>', seconds)
                    global.TEMP_TIME = seconds
                    functions.setTimer()
                } else {
                    clearInterval(this.interval);
                    clearInterval(global.TEMP_INTERVAL);
                    global.TOTAL_PLAY_TIME = 0
                    global.TEMP_TIME = 0
                    AsyncStorage.setItem('total_play_time', '0');
                }
            }
        });
    }

    componentDidUpdate() {
        if (global.TEMP_TIME == 0) {
            clearInterval(this.interval);
            clearInterval(global.TEMP_INTERVAL);
            global.TOTAL_PLAY_TIME = 0
            global.TEMP_TIME = 0
            AsyncStorage.setItem('total_play_time', '0');
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
        clearInterval(this.interval)
    }

    handleBackButton = () => {
        this.backButtonClick()
        return true
    }

    handleOnNavigateBack = (foo) => {
        this.setState({ foo })
    }

    backButtonClick() {
        // this.props.navigation.goBack()
        this.props.navigation.goBack()
    }

    async getSubscriptionAmt() {
        try {
            const products = await getSubscriptions({ skus: [this.state.select_iap] });
            if (Platform.OS == 'ios') {
                this.setState({ iOSPrice: products[0].localizedPrice });
            } else {
                this.setState({ androidPrice: products[0].subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].formattedPrice });
            }
            this.setState({ productList: products });
        } catch (err) {
            this.setState({ isLoading: false });
        }
    }

    clickContinue() {
        // console.log("On Continue Click ==>")
        var select_iap = ''
        var subscription_amt = ''
        if (Platform.OS == 'ios') {
            select_iap = this.state.iOSQuatumOneYear
            subscription_amt = this.state.iOSPrice
        } else {
            select_iap = this.state.androidQuatumOneYear
            subscription_amt = this.state.androidPrice
        }
        this.setState({
            select_iap: select_iap,
            subscription_amt: subscription_amt,
        }, () => {
            this.requestSubscription(this.state.select_iap);
        });
    }

    requestSubscription = async (sku) => {
        // console.log("requestSubscription ==> ", sku)
        this.setState({ isLoading: true });
        try {
            await this.getItems();
            // await requestSubscription(sku);
        } catch (err) {
            // console.log("requestSubscription err ==>", err)
            this.setState({ isLoading: false });
            // webFunctions.savePaymentLogIos('Setting requestSubscription err', err.message)
            Alert.alert("requestSubscription", err.message, [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }])
        }
    };

    getItems = async () => {
        // console.log("getItems ==> ", this.state.select_iap)
        try {
            // const products = await RNIap.getProducts([this.state.select_iap]);
            const subscriptions = await getSubscriptions({ skus: [this.state.select_iap] });
            const subscription = subscriptions.find(s => s.productId === this.state.select_iap);
            // console.log("products ==>", products)
            this.setState({ productList: subscriptions });
            this.requestPurchase(this.state.select_iap, subscription);
        } catch (err) {
            console.log("getItems err ==>", this.state.select_iap)
            this.setState({ isLoading: false });
            // webFunctions.savePaymentLogIos('Setting getItems err', err.message)
            Alert.alert("getItems", err.message, [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }])
        }
    };

    requestPurchase = async (sku, subscription) => {
        // Handle android purchase request
        if (Platform.OS === 'android') {
            const androidSubscription = subscription;
            // Get offer token. If you have multiple offers, you need to choose the correct one here
            // We only got one offer per subscription
            const offerToken =
                androidSubscription.subscriptionOfferDetails[0]?.offerToken;

            if (!offerToken) {
                throw new Error('Subscription does not contain a valid offerToken');
            }

            const subscriptionRequest = {
                subscriptionOffers: [
                    {
                        sku,
                        offerToken,
                    },
                ],
            };

            const data = await requestSubscription(subscriptionRequest);
            this.savePaymentIos(data[0])
            const { setIsSubscribe } = this.context;
            setIsSubscribe(true)
            this.setState({
                isLoading: false,
            })
        }

    };

    clickRestorePurchases() {
        var select_iap = ''
        var subscription_amt = ''
        if (Platform.OS == 'ios') {
            select_iap = this.state.iOSQuatumOneYear
            subscription_amt = this.state.iOSPrice
        } else {
            select_iap = this.state.androidQuatumOneYear
            subscription_amt = this.state.androidPrice
        }
        this.setState({
            select_iap: select_iap,
            subscription_amt: subscription_amt,
        }, () => {
            this._getAvailablePurchases(this.state.select_iap);
        });
    }

    _getAvailablePurchases = async () => {
        this.setState({ isLoading: true });
        try {
            const availablePurchases = await getAvailablePurchases();
            if (availablePurchases && availablePurchases.length > 0) {
                const sortedAvailablePurchases = availablePurchases.sort(
                    (a, b) => b.transactionDate - a.transactionDate
                );
                var dataArray = sortedAvailablePurchases[0]
                // console.log("transaction_date ==>", dataArray.transactionDate)
                // console.log("transaction_id ==>", dataArray.transactionId)
                // console.log("product_id ==>", dataArray.productId)
                // console.log("transaction_receipt ==>", dataArray.transactionReceipt)
                this.setState({
                    isLoading: false,
                    myReceipt: availablePurchases[0].transactionReceipt,
                }, () => {
                    this.savePaymentIos(dataArray)
                });
            } else {
                this.setState({ isLoading: false });
                Alert.alert("NOTIFICATION", 'Your purchases not available please subscribe', [{
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }])
            }
        } catch (err) {
            // console.log("getAvailablePurchases err ==>", err)
            this.setState({ isLoading: false });
            // webFunctions.savePaymentLogIos('Setting getAvailablePurchases err', err.message)
            Alert.alert("getAvailablePurchases", err.message, [{
                text: 'Ok',
                onPress: () => { },
                style: 'cancel'
            }])
        }
    }

    savePaymentIos(dataArray = []) {
        if (this.state.subscription_amt) {
            this.setState({ isLoading: true });
            // console.log("user_id ==>", global.USER_DATA.id.toString())
            // console.log("subscription_amt ==>", this.state.subscription_amt)
            // console.log("transaction_date ==>", dataArray.transactionDate)
            // console.log("transaction_id ==>", dataArray.transactionId)
            // console.log("product_id ==>", dataArray.productId)
            // console.log("transaction_receipt ==>", dataArray.transactionReceipt)

            var transactionDate = 0
            transactionDate = parseInt(dataArray.transactionDate)
            const date = new Date(transactionDate);
            transactionDate = date.toLocaleString('sv')

            var data_Array = [];
            data_Array.push({ name: 'user_id', data: global.USER_DATA.id.toString() });
            data_Array.push({ name: 'subscription_amt', data: this.state.subscription_amt.toString() });
            data_Array.push({ name: 'transaction_date', data: transactionDate.toString() });
            data_Array.push({ name: 'transaction_id', data: dataArray.transactionId.toString() });
            data_Array.push({ name: 'product_id', data: dataArray.productId.toString() });
            data_Array.push({ name: 'transaction_receipt', data: dataArray.transactionReceipt.toString() });
            data_Array.push({ name: 'category_id', data: '1' });
            data_Array.push({ name: 'plan_type', data: 'yearly' });
            if (Platform.OS == 'ios') {
                data_Array.push({ name: 'pay_type', data: '1' });
            } else {
                data_Array.push({ name: 'pay_type', data: '2' });
            }
            ReactNativeBlobUtil.fetch('POST', global.SAVE_SUBSCRIPTION, {
                'Content-Type': 'multipart/form-data',
            }, data_Array).then((response) => {
                response = response.json();
                var resultArray = response['subscribe_dtl'];
                if (resultArray.length > 0) {
                    resultArray = resultArray[0]
                    if (resultArray.fetch_flag == "1") {
                        AsyncStorage.getItem('login_flag', (err, login_flag) => {
                            if (login_flag == "1") {
                                AsyncStorage.getItem('email', (err, email) => {
                                    if (email) {
                                        AsyncStorage.getItem('password', (err, password) => {
                                            if (password) {
                                                webFunctions.getUserData(JSON.parse(login_flag), JSON.parse(email), JSON.parse(password), '', '');
                                            }
                                        });
                                    }
                                });
                            } else if (login_flag == "2") {
                                AsyncStorage.getItem('social_id', (err, social_id) => {
                                    if (social_id) {
                                        AsyncStorage.getItem('social_type', (err, social_type) => {
                                            if (social_type) {
                                                webFunctions.getUserData(JSON.parse(login_flag), '', '', JSON.parse(social_id), JSON.parse(social_type));
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        global.IS_SUBSCRIBE = true;
                        setTimeout(function () {
                            this.setState({ isLoading: false });
                            Alert.alert(resultArray.rsp_title, resultArray.rsp_msg, [{
                                text: 'Ok',
                                onPress: () => {
                                    if (this.state.callType == "SettingsTab") {
                                        this.props.navigation.goBack()
                                    } else {
                                        global.TAB_INDEX = 0;
                                        this.props.navigation.navigate('QiCoilTabNavigator', { transition: 'bottomUp', payment: 5 });
                                    }
                                },
                                style: 'cancel'
                            }])
                        }.bind(this), 2000);
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(resultArray.rsp_title, resultArray.rsp_msg, [{
                            text: 'Ok',
                            onPress: () => { },
                            style: 'cancel'
                        }])
                    }
                } else {
                    this.setState({ isLoading: false });
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

            // var query_string = "?user_id=" + global.USER_DATA.id.toString();
            // query_string += "&subscription_amt=" + this.state.subscription_amt;
            // query_string += "&transaction_date=" + dataArray.transactionDate;
            // query_string += "&transaction_id=" + dataArray.transactionId;
            // query_string += "&product_id=" + dataArray.productId;
            // query_string += "&transaction_receipt=" + dataArray.transactionReceipt;
            // var url = encodeURI(global.SAVE_SUBSCRIPTION + query_string);
            // console.log('savePaymentIos url ==> ', url)
            // fetch(url, {
            //     method: 'GET',
            //     headers: new Headers({
            //         'Content-Type': 'application/json'
            //     })
            // }).then(res => res.json())
            //     .then(response => {
            //     }).catch(error => {
            //     });
        }
    }

    OpenWebView(title = '', url = '') {
        this.props.navigation.navigate('OpenWebView', {
            title: title,
            url: url,
            transition: 'bottomUp'
        });
    }

    getTime(seconds = 0) {
        var time = ''
        var divisor_for_minutes = seconds % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        if (minutes > 9) {
            time = time + minutes + ':'
        } else {
            time = time + '0' + minutes + ':'
        }
        if (seconds > 9) {
            time = time + seconds
        } else {
            time = time + '0' + seconds
        }
        return time
    }

    render() {
        const { navigate } = this.props.navigation;
        let subscribeList = [];
        this.state.subscribeList.forEach(function (item) {
            subscribeList.push(
                <View style={[Common.marginTop20, Common.flexRow, Common.alignItmCenter, Common.width100pr]}>
                    <Image style={[AppCommon.icon20]} source={require('../Images/check.png')}></Image>
                    <Text style={[Common.marginLeft10, AppCommon.h4, Colors.whiteFnColor]}>{item.name}</Text>
                </View>
            );
        }.bind(this));
        var time = this.getTime(global.TEMP_TIME)
        return (
            <View style={[AppCommon.mainContainer, Colors.whiteBgColor]}>
                <Notification screen='SecondSubscribeView' />
                <LoaderSecond visible={this.state.isLoading} />
                {/* <SafeAreaView style={[Colors.whiteBgColor]}>
                </SafeAreaView> */}
                {Platform.OS == 'ios' ?
                    <StatusBar translucent backgroundColor={Colors.whiteBgColor} barStyle="light-content" />
                    : null}
                <LinearGradient
                    style={{ width: width, height: height }}
                    colors={[global.GRADIENT_RIGHT_COLOR, global.GRADIENT_BOTTOM_COLOR]}>
                    <TouchableHighlight
                        style={[global.FULL_DISPLAY ? Common.marginTop50 : Common.marginTop30, Common.marginLeft15, AppCommon.icon35, Common.justifyCenter, Common.alignItmCenter]}
                        underlayColor={global.TRANSPARENT_COLOR}
                        onPress={() => { this.backButtonClick() }}>
                        <Image style={[AppCommon.icon35]} source={require('../Images/close_3.png')} />
                    </TouchableHighlight>
                    <ScrollView style={[]} alwaysBounceVertical={false} contentInsetAdjustmentBehavior="always" vertical={true} bounces={true}>
                        <View style={[AppCommon.container, Common.paddingHorizontal30]}>
                            {global.TEMP_TIME > 0 ?
                                <View style={[]}>
                                    <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                        <Text style={[AppCommon.h1, Colors.whiteFnColor, Input.textCenter]}>{'Subscribe to continue using \nthe frequencies or wait ' + time + '\nfor free access'}</Text>
                                    </View>
                                    <View style={[Common.marginTop40]}>
                                        <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.textCenter, Input.textBold]}>Ready to start?</Text>
                                        </View>
                                        <View style={[Common.marginTop15, Common.marginHorizontal20, Common.justifyCenter, Common.alignItmCenter]}>
                                            {subscribeList}
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={[]}>
                                    <View style={[Common.marginTop120]}>
                                        <View style={[Common.justifyCenter, Common.alignItmCenter]}>
                                            <Text style={[AppCommon.h3, Colors.whiteFnColor, Input.textCenter, Input.textBold]}>Ready to start?</Text>
                                        </View>
                                        <View style={[Common.marginTop15, Common.marginHorizontal20, Common.justifyCenter, Common.alignItmCenter]}>
                                            {subscribeList}
                                        </View>
                                    </View>
                                </View>
                            }
                            <View style={[Common.marginTop120, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.clickContinue() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.height45, Common.width100pr, Common.justifyCenter, Common.alignItmCenter, Common.borderRadius25, Common.border2, Colors.whiteBorder, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>Subscribe</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop15, Common.justifyCenter, Common.alignItmCenter]}>
                                <Text style={[AppCommon.bodyFont, Colors.whiteFnColor, Input.textCenter, Input.textBold]}>Just {Platform.OS == 'ios' ? this.state.iOSPrice : this.state.androidPrice} per year</Text>
                            </View>
                            <View style={[Common.marginTop15, Common.justifyCenter, Common.alignItmCenter]}>
                                <Text style={[AppCommon.smallFont, Colors.whiteFnColor, Input.textCenter]}>This subscription automatically renews unless auto-renew is turned off at least 24-hours before current period ends. Payment is charged to your Google account. Manage subscriptions and turn off auto renewal in Google account settings.&nbsp;
                                    <Text
                                        onPress={() => { this.OpenWebView("Terms & Conditions", global.TERMS_CONDITIONS) }}
                                        style={[AppCommon.smallFont, Colors.whiteFnColor, Input.textCenter, Input.textBold, Input.textUnderline]}>
                                        Terms
                                    </Text>
                                    &nbsp;and&nbsp;
                                    <Text
                                        onPress={() => { this.OpenWebView("Privacy Policy", global.PRIVACY_POLICY) }}
                                        style={[AppCommon.smallFont, Colors.whiteFnColor, Input.textCenter, Input.textBold, Input.textUnderline]}>
                                        Privacy Policy
                                    </Text>
                                    .
                                </Text>
                            </View>
                            <View style={[Common.marginTop40, Common.justifyCenter, Common.alignItmCenter]}>
                                <TouchableHighlight
                                    onPress={() => { this.clickRestorePurchases() }}
                                    underlayColor={global.TRANSPARENT_COLOR}
                                    style={[Common.paddingHorizontal20, Common.height45, Common.justifyCenter, Common.alignItmCenter, Colors.transparentBgColor]}>
                                    <Text style={[AppCommon.h4, Colors.whiteFnColor, Input.fontBold]}>Restore Purchases</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Common.marginTop20]}></View>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </View >
        );
    }
}

