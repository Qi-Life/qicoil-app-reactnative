import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';
import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

export default class Loader extends Component {
	constructor(props) {
		super(props);
		functions = new Functions();
		webFunctions = new WebFunctions();
	}

	componentDidMount() {
	}

	render() {
		return (
			<View style={[this.props.visible ? AppCommon.activityIndicator : Common.displayNone]}>
				<View style={{}}>
					{/* <ActivityIndicator size="large" color={global.DEFAULT_COLOR} /> */}
				</View>
			</View>
		);
	}
}

