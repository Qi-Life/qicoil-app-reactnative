import React, { Component } from 'react';
import { TouchableHighlight, Text, View, SafeAreaView, Image, FlatList, StatusBar, NativeModules, RefreshControl, Dimensions, Alert, Platform, ScrollView, Linking, AppState, TextInput, ImageBackground, BackHandler, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

import Notification from '../Components/Notification';
import Loader from '../Components/Loader';
import LoaderSecond from '../Components/LoaderSecond';

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

import AppIntroSlider from '../Lib/Slider/Slider';
import ProgressImage from '../Lib/ProgressImage/ProgressImage';

const { width, height } = Dimensions.get("window")

export default class AboutView extends Component {
	constructor(props) {
		super(props);
		functions = new Functions();
		webFunctions = new WebFunctions();
		this.state = {
		}
	}

	componentDidMount() {
	}

	componentWillReceiveProps() {
	}

	closeAboutView() {
		this.props.closeAboutView()
	}

	render() {
		var version = DeviceInfo.getVersion(); //DeviceInfo.getBuildNumber()

		return (
			<View style={[AppCommon.aboutView]}>
				<TouchableHighlight
					onPress={() => { this.closeAboutView() }}
					underlayColor={global.TRANSPARENT_COLOR}
					style={[Common.zIndex99, Common.positionAbs, Common.top5, Common.right5, AppCommon.icon35, Common.justifyCenter, Common.alignItmCenter]}>
					<Image style={[AppCommon.icon30, Colors.drakGreyTnColor]} source={require('../Images/close.png')} />
				</TouchableHighlight>
				<View style={[Common.marginTop20, Common.paddingHorizontal20]} >
					<Text style={[AppCommon.h3, Input.fontBold, Colors.blackFnColor]}>About</Text>
				</View >
				<View style={[Common.marginTop25, Common.paddingHorizontal20]} >
					<Text style={[AppCommon.h3, Colors.blackFnColor]}>Version {version}</Text>
				</View >
				<View style={[Common.marginTop20]} >
				</View >
			</View >
		);
	}
}

