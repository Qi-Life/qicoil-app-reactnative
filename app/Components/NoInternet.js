import React, { Component } from 'react';
import { View, Text, AppState } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Dialog from "react-native-dialog";

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';

export default class NoInternet extends Component {
	constructor(props) {
		super(props);
		functions = new Functions();
		webFunctions = new WebFunctions()
		this.state = {
			dialogVisible: false,
			appState: AppState.currentState
		};
	}

	componentDidMount() {
		NetInfo.fetch().then(state => {
			this.setState({ isConnected: state.isConnected });
		});
		const unsubscribe = NetInfo.addEventListener(state => {
			if (this.state.isConnected == true && state.isConnected === false && global.NO_INTERNET_FLAG == 1) {
				this.showDialog()
				global.NO_INTERNET_FLAG = 0
			} else {
				this.handleCancel()
				global.NO_INTERNET_FLAG = 1
			}
			this.setState({ isConnected: state.isConnected });
		});
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		//NetInfo.isConnected.removeEventListener('connectionChange', this.handleFirstConnectivityChange);
	}

	handleFirstConnectivityChange = (isConnected) => {
		if (this.state.isConnected == true && isConnected === false && global.NO_INTERNET_FLAG == 1) {
			this.showDialog()
			global.NO_INTERNET_FLAG = 0
		} else {
			this.handleCancel()
			global.NO_INTERNET_FLAG = 1
		}
		this.setState({ isConnected: isConnected });
	}

	showDialog = () => {
		this.setState({ dialogVisible: true });
	};

	handleCancel = () => {
		this.setState({ dialogVisible: false });
	};

	_handleAppStateChange = async (nextAppState) => {
		if (this.state.appState != nextAppState && nextAppState === 'active') {
			NetInfo.fetch().then((state) => {
				this.setState({ isConnected: state.isConnected });
			});
		}
		this.setState({ appState: nextAppState });
	}


	render() {
		return (
			<View style={this.state.isConnected == false ? [AppCommon.noInternetMainView, Colors.transparentBgColor] : Common.displayNone}>
				<Text style={[AppCommon.h3, Colors.redFnColor]}>No Internet Connection</Text>
				<Dialog.Container visible={this.state.dialogVisible}>
					<Dialog.Title>No Internet Connection</Dialog.Title>
					<Dialog.Description>We can't connect to the internet. Please check your internet connection.</Dialog.Description>
					<Dialog.Button label="Ok" onPress={this.handleCancel} />
					{/* <Dialog.Button label="Delete" onPress={this.handleDelete} /> */}
				</Dialog.Container>
			</View>
		);
	}
}
