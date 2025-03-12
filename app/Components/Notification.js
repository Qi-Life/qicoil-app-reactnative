import React, { Component } from 'react';
import { AppState, Platform, View, Text, SafeAreaView, TouchableWithoutFeedback, Alert, BackHandler, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
// import messaging from '@react-native-firebase/messaging';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

class Notification extends React.Component {

    constructor(props) {
        super(props);
        functions = new Functions();
        string = new String();
        this.state = {
            notification_flag: true,
            appState: AppState.currentState
        }
        this.navigationScreen.bind(this);
        this.onMessageReceived.bind(this);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        }
        this.setState({ appState: nextAppState });
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        // messaging().onMessage((message) => {
        //     this.onMessageReceived(message)
        // });
        // messaging().setBackgroundMessageHandler((message) => {
        //     this.onMessageReceived(message)
        // });

        // messaging().onNotificationOpenedApp((remoteMessage) => {
        //     this.onMessageReceived(remoteMessage)
        // });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    async onMessageReceived(message) {
        this.showView(message)
    }

    showView(notification, notificationOpen = 0) {
        var navigationFalg = 0
        var oid = ''
        var cid = ''
        var ptype = ''
        var title = ''
        var body = ''
        var imgurl = ''
        var is_admin = ''

        oid = notification.data.oid != undefined && notification.data.oid ? notification.data.oid : ''
        cid = notification.data.cid != undefined && notification.data.cid ? notification.data.cid : ''
        ptype = notification.data.ptype != undefined && notification.data.ptype ? notification.data.ptype : ''
        title = notification.data.title != undefined && notification.data.title ? notification.data.title : ''
        body = notification.data.body != undefined && notification.data.body ? notification.data.body : ''
        imgurl = notification.data.imgurl != undefined && notification.data.imgurl ? notification.data.imgurl : ''
        is_admin = notification.data.is_admin != undefined && notification.data.is_admin ? notification.data.is_admin : ''

        if (this.props.screen == 'Chat' && ptype == 'chat') {
            this.props.refreshData();
        }
        if (this.props.screen == 'Messages') {
            if (this.props.order_id == oid && ptype == 'chat') {
                global.NOTIFICATION_FLAG = 0
                var today = new Date();
                var resultArray = {
                    msg_id: cid,
                    is_admin: is_admin,
                    order_id: oid,
                    type: imgurl == "" || imgurl == undefined ? "0" : "1",
                    msg: imgurl == "" || imgurl == undefined ? body : imgurl,
                    from_user_id: this.props.to_user_id,
                    to_user_id: this.props.from_user_id,
                    msg_dt: today
                };
                this.props.chat_data(resultArray);
            } else {
                if (this.state.appState == 'active') {
                    global.NOTIFICATION_FLAG = 1
                } else {
                    navigationFalg = 1
                }
            }
        } else if (this.props.screen == 'OrderDetails') {
            if (this.props.order_id == oid) {
                global.NOTIFICATION_FLAG = 0
                this.props.orderRefresh(oid);
            } else {
                if (this.state.appState == 'active') {
                    global.NOTIFICATION_FLAG = 1
                } else {
                    navigationFalg = 1
                }
            }
        } else {
            if (this.state.appState == 'active') {
                global.NOTIFICATION_FLAG = 1
            } else {
                navigationFalg = 1
            }
        }
        global.NOTIFICATION_OID = oid
        global.NOTIFICATION_CID = cid
        global.NOTIFICATION_PTYPE = ptype
        global.NOTIFICATION_TITLE = title
        global.NOTIFICATION_BODY = body
        global.NOTIFICATION_IMGURL = imgurl
        global.NOTIFICATION_IS_ADMIN = is_admin
        this.setState({ notification_flag: true });

        if (navigationFalg == 1 || notificationOpen == 1) {
            this.navigationScreen()
        }

        setTimeout(function () {
            global.NOTIFICATION_FLAG = 0
            global.NOTIFICATION_OID = ''
            global.NOTIFICATION_CID = ''
            global.NOTIFICATION_PTYPE = ''
            global.NOTIFICATION_TITLE = ''
            global.NOTIFICATION_BODY = ''
            global.NOTIFICATION_IMGURL = ''
            global.NOTIFICATION_IS_ADMIN = ''
            this.setState({ notification_flag: false });
        }.bind(this), 5000);
    }

    navigationScreen() {
        if (global.NOTIFICATION_PTYPE == 'chat') {
            global.NOTIFICATION_FLAG = 0
            this.setState({ notification_flag: false });
            if (this.props.screen == 'Messages') {
                if (this.props.order_id != global.NOTIFICATION_OID) {
                    this.props.reloadPage(global.NOTIFICATION_OID);
                }
            } else {
                this.props.navigation.navigate('Messages', { transition: 'default', order_id: global.NOTIFICATION_OID });
            }
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => { this.navigationScreen() }}
                style={global.NOTIFICATION_FLAG == 1 ? [] : [Common.displayNone]}
                underlayColor={global.TRANSPARENT_COLOR}>
                <View style={global.NOTIFICATION_FLAG == 1 ? [AppCommon.notificationMainView] : Common.displayNone} >
                    <SafeAreaView></SafeAreaView>
                    {/* <SafeAreaView style={Colors.defaultBgColor}></SafeAreaView> */}
                    {/* <Text style={[AppCommon.h5, Colors.blackFnColor]}>
						<Text style={[AppCommon.h4, Colors.blackFnColor]}>{global.NOTIFICATION_TITLE}</Text> {global.NOTIFICATION_BODY}
					</Text> */}
                    <View style={global.NOTIFICATION_TITLE ? [Common.paddingVertical5, Common.paddingRight30] : Common.displayNone} >
                        <Text numberOfLines={1} style={[AppCommon.h4, Input.fontBold, Colors.blackFnColor]}>{global.NOTIFICATION_TITLE}:</Text>
                    </View>
                    <View style={global.NOTIFICATION_BODY ? [Common.paddingVertical5, Common.paddingRight30] : Common.displayNone} >
                        <Text numberOfLines={1} style={[AppCommon.h5, Colors.blackFnColor]}> {global.NOTIFICATION_BODY}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default withNavigation(Notification);
