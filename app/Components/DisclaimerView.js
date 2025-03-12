import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, StyleSheet, Button, Platform, Linking } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage'

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between'
	},
	checkboxContainer: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	checkbox: {
		alignSelf: 'center',
		color: '#777',
	},
	checkBoxIos: {
		width: 25,
		height: 25,
		marginRight: 7,
		marginTop: 2
	},
	label: {
		marginTop: 5,
		color: '#777',
	},
	buttonContainer: {
		marginBottom: 20
	}
});

export default class DisclaimerView extends Component {
	constructor(props) {
		super(props);
		functions = new Functions();
		webFunctions = new WebFunctions()
		this.state = {
			isSelected: false
		}
	}

	closeDisclaimerView() {
		this.props.closeDisclaimerView()
	}

	onchangeCheckbox = (val) => {
		this.setState({ isSelected: val })
	}

	_onPressButton = () => {
		if (this.state.isSelected) {
			AsyncStorage.setItem('disclaimer_flag', JSON.stringify(1));
		}
		this.props.closeDisclaimerView()
	}

	render() {
		return (
			<View style={[AppCommon.aboutView]}>
				<TouchableHighlight
					onPress={() => { this.closeDisclaimerView() }}
					underlayColor={global.TRANSPARENT_COLOR}
					style={[Common.zIndex99, Common.positionAbs, Common.top5, Common.right5, AppCommon.icon35, Common.justifyCenter, Common.alignItmCenter]}>
					<Image style={[AppCommon.icon30, Colors.drakGreyTnColor]} source={require('../Images/close.png')} />
				</TouchableHighlight>
				<View style={[Common.marginTop20, Common.paddingHorizontal20]} >
					<Text style={[AppCommon.h3, Input.textBold, Colors.blackFnColor]}>Disclaimer and Waiver</Text>
				</View >
				<View style={[Common.marginTop25, Common.paddingHorizontal20, { flexDirection: 'row' }]} >
					<Text style={[AppCommon.h4, Colors.blackFnColor, { flex: 1, flexWrap: 'wrap' }]}>
						By using this app, to extent permitted by applicable law, you release this app's creator, website and it's Affiliates, and it's and their
						employees, agents and representatives from any and all liability, damage or loss. This app and tablet are not medical devices are not intended to be
						used to diagnose, treat, cure or prevent any disease. This app has not been evaluated by the FDA and no medical claims are made or implied for this app
						. If you feel discomfort or dizziness, stop using this app. Always consult with your doctor before using any or our products.
					</Text>
				</View >
				<View style={[Common.marginTop10, Common.paddingHorizontal20, { flexDirection: 'row'}]}>
					<Text style={[AppCommon.h4, Colors.blackFnColor]}>To view full Disclaimers </Text>
					<Text style={[{ color: 'blue' }, AppCommon.h4]}
						onPress={() => Linking.openURL('https://qilifestore.com/pages/disclaimers')}>
						Click Here
					</Text></View>
				<View style={[styles.container, Common.marginTop25, Common.paddingHorizontal20]} >
					<View style={styles.checkboxContainer}>
						<CheckBox
							value={this.state.isSelected}
							onValueChange={this.onchangeCheckbox}
							style={[styles.checkbox, isIOS ? styles.checkBoxIos : '']}
							tintColors={{ true: '#282c34', false: 'black' }}
						/>
						<Text style={[styles.label, Common.h4]}>Do not show this message again</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Button onPress={this._onPressButton} title="AGREE" />
					</View>
				</View>
			</View >
		);
	}
}

