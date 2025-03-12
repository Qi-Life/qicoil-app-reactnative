import React, { Component } from 'react';
import { TouchableHighlight, Text, View, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Rate, { AndroidMarket } from 'react-native-rate'

import AppCommon from '../CSS/AppCommon';
import Colors from '../CSS/Colors';
import Common from '../CSS/Common';
import Input from '../CSS/Input';

import WebFunctions from '../Networking/WebFunctions';
import Functions from '../Includes/Functions';

const { width, height } = Dimensions.get("window")

export default class RateReview extends Component {
	constructor(props) {
		super(props);
		functions = new Functions();
		webFunctions = new WebFunctions();
		this.state = {
			rating: 0,
		}
	}

	changeRatings(rating) {
		this.setState({
			rating: rating,
		}, () => {
		});
	}

	closeRateReview() {
		this.props.closeRateReview()
	}

	clickRateUs() {
		if (this.state.rating > 3) {
			const options = {
				AppleAppID: "1643112222",
				GooglePackageName: "com.rife",
				AmazonPackageName: "com.rife",
				OtherAndroidURL: "https://play.google.com/store/apps/details?id=com.rife",
				preferredAndroidMarket: AndroidMarket.Google,
				preferInApp: false,
				openAppStoreIfInAppFails: true,
				fallbackPlatformURL: "",
			}
			Rate.rate(options, (success, errorMessage) => {
				if (success) {
					// this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
					// console.log('success ==>', success)
					AsyncStorage.setItem('rate_flag', JSON.stringify(1));
					this.props.closeRateReview()
				}
				if (errorMessage) {
					// errorMessage comes from the native code. Useful for debugging, but probably not for users to view
					// console.log('errorMessage ==>', errorMessage)

				}
			})
		} else {
			this.props.openHelpSupport()
		}
	}

	render() {
		var starSize = (global.IS_IPAD ? 50 : 30)
		return (
			<View style={[AppCommon.aboutView, { width: width - (global.IS_IPAD ? 150 : 100) }]}>
				<View style={[Common.marginTop20, Common.justifyCenter, Common.alignItmCenter]} >
					<Text style={[AppCommon.h3, Input.fontBold, Colors.blackFnColor]}>Do you like our app?</Text>
				</View >
				<View style={[Common.marginTop20, Common.flexRow, Common.justifyCenter, Common.alignItmCenter]}>
					<TouchableHighlight
						onPress={() => { this.changeRatings(1) }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<Image style={[Common.marginRight10, { width: starSize, height: starSize }]} source={this.state.rating > 0 ? require('../Images/star.png') : require('../Images/star_blank.png')} />
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => { this.changeRatings(2) }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<Image style={[Common.marginRight10, { width: starSize, height: starSize }]} source={this.state.rating > 1 ? require('../Images/star.png') : require('../Images/star_blank.png')} />
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => { this.changeRatings(3) }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<Image style={[Common.marginRight10, { width: starSize, height: starSize }]} source={this.state.rating > 2 ? require('../Images/star.png') : require('../Images/star_blank.png')} />
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => { this.changeRatings(4) }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<Image style={[Common.marginRight10, { width: starSize, height: starSize }]} source={this.state.rating > 3 ? require('../Images/star.png') : require('../Images/star_blank.png')} />
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => { this.changeRatings(5) }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<Image style={[Common.marginRight10, { width: starSize, height: starSize }]} source={this.state.rating > 4 ? require('../Images/star.png') : require('../Images/star_blank.png')} />
					</TouchableHighlight>
				</View>
				<View style={[Common.marginTop20, Common.justifyCenter, Common.alignItmCenter]} >
					<TouchableHighlight
						disabled={this.state.rating == 0}
						onPress={() => { this.clickRateUs() }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[]}>
						<LinearGradient
							start={{ x: 0.0, y: 0.50 }}
							end={{ x: 1.7, y: 1.0 }}
							style={[Common.width160, Common.height40, Common.borderRadius25]}
							colors={this.state.rating == 0 ? ['#e7e8e8', '#e7e8e8', '#e7e8e8'] : [global.GRADIENT_BOTTOM_COLOR, global.GRADIENT_RIGHT_COLOR,]}>
							<View style={[Common.flexRow, Common.height100pr, Common.justifyCenter, Common.alignItmCenter]}>
								<Text style={[AppCommon.h5, Input.fontBold, Colors.whiteFnColor, {color: this.state.rating == 0 ? '#a1a6ac': '#fff' }]}>RATE US</Text>
							</View>
						</LinearGradient>
					</TouchableHighlight>
				</View>
				<View style={[Common.marginTop5, Common.justifyCenter, Common.alignItmCenter]} >
					<TouchableHighlight
						onPress={() => { this.closeRateReview() }}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[Common.paddingVertical10, Common.paddingHorizontal20]}>
						<Text style={[AppCommon.h5, Input.fontBold, Colors.blackFnColor]}>Later</Text>
					</TouchableHighlight>
				</View>
				<View style={[Common.marginTop10]}>
				</View>
			</View>
		);
	}
}

