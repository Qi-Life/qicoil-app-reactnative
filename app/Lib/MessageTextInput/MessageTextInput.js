import React, { Component } from 'react';
import { View, Text, TextInput, Image, Animated, Keyboard, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DeviceInfo from "react-native-device-info";

import StyleConstant from '../../CSS/StyleConstant';
import AppCommon from '../../CSS/AppCommon';
import Colors from '../../CSS/Colors';
import Common from '../../CSS/Common';
import Input from '../../CSS/Input';

export default class MessageTextInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 0,
			keyboardOffset: new Animated.Value(global.FULL_DISPLAY ? 20 : 0)
		}
	}

	componentDidMount() {
		this._keyboardWillShowSubscription = Keyboard.addListener("keyboardWillShow", e => this._keyboardWillShow(e));
		this._keyboardWillHideSubscription = Keyboard.addListener("keyboardWillHide", e => this._keyboardWillHide(e));
		this.props.flatListHeight(global.FULL_DISPLAY ? 20 : 0)
	}

	_keyboardWillShow(e) {
		Animated.spring(this.state.keyboardOffset, {
			toValue: global.FULL_DISPLAY ? e.endCoordinates.height : e.endCoordinates.height,
			friction: 8
		}).start();
		var height = global.FULL_DISPLAY ? e.endCoordinates.height : e.endCoordinates.height
		this.props.flatListHeight(height)
	}

	_keyboardWillHide(e) {
		Animated.spring(this.state.keyboardOffset, {
			toValue: global.FULL_DISPLAY ? 20 : 0,
			friction: 8
		}).start();
		this.props.flatListHeight(global.FULL_DISPLAY ? 20 : 0)
	}

	render() {
		return (
			<Animated.View style={{ paddingBottom: this.state.keyboardOffset, backgroundColor: this.props.backgroundColor }}>
				<View style={[styles.textInputParentView, { borderTopColor: this.props.borderTopColor, backgroundColor: this.props.backgroundColor, }]}>
					<TouchableOpacity
						onPress={() => this.props.onPressButton1()}>
						<View style={styles.buttonPosition1}>
							<View style={[styles.sendButtonStyle1]}>
								<Image style={{ width: 26, height: 26 }} source={this.props.sendButtonImage1} />
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.textInputView}>
						<TextInput
							editable={this.props.editable}
							multiline={this.props.multiline}
							placeholder={this.props.placeholderText}
							placeholderTextColor={this.props.placeholderTextColor}
							placeholderStyle={[styles.placeholderStyle, { color: this.props.placeholderTextColor }]}
							underlineColorAndroid='transparent'
							keyboardType={this.props.keyboardType}
							value={this.props.messageText}
							onChange={(event) => { event.target.value }}
							onChangeText={editedText => {
								this.props.onChange(editedText)
							}}
							onContentSizeChange={(event) => this.setState({ height: event.nativeEvent.contentSize.height })}
							style={[styles.textInputStyle, {
								height: Math.min(70, Math.max(35, this.state.height)),
								backgroundColor: this.props.textInputBgColor,
								color: this.props.messageTextColor
							}]}
						/>
					</View>
					<TouchableOpacity
						disabled={this.props.validateButton()}
						onPress={() => this.props.onPressButton2()}>
						<View style={styles.buttonPosition2}>
							<View style={[styles.sendButtonStyle2]}>
								<Image style={{ width: 30, height: 30 }} source={this.props.sendButtonImage2} />
							</View>
						</View>

						{/* <View style={styles.buttonPosition2}>
							<View style={[styles.sendButtonStyle2, {
								backgroundColor: this.props.validateButton() == true ? this.props.sendButtonDisableColor : this.props.sendButtonEnableColor
							}]}>
								<Image style={{ width: 30, height: 30 }} source={this.props.sendButtonImage2} /> 
							</View>
						</View> */}
					</TouchableOpacity>
				</View>
			</Animated.View>
		);
	}
}


const styles = StyleSheet.create({
	textInputParentView: {
		flexDirection: 'row',
		paddingHorizontal: (global.IS_IPAD ? 15 : 10),
		borderTopWidth: 1,
		paddingVertical: (global.IS_IPAD ? 10 : 5),
	},
	buttonPosition1: {
		justifyContent: 'flex-end',
		flex: 1,
		...Platform.select({ android: { marginVertical: 1 } })
	},
	sendButtonStyle1: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (global.IS_IPAD ? 56 : 36),
		height: (global.IS_IPAD ? 56 : 36),
		borderRadius: (global.IS_IPAD ? 28 : 18),
	},
	textInputView: {
		flex: 1,
		marginLeft: (global.IS_IPAD ? 20 : 15),
		marginRight: (global.IS_IPAD ? 20 : 15),
		justifyContent: 'center',
		paddingVertical: 0
	},
	textInputStyle: {
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		paddingLeft: (global.IS_IPAD ? 15 : 10),
		paddingTop: (global.IS_IPAD ? 5 : 10),
		textAlign: 'left',
		borderRadius: (global.IS_IPAD ? 10 : 5),
		fontFamily: global.DEFAULT_FONT,
		fontSize: (global.IS_IPAD ? 24 : 14),
		lineHeight: (global.IS_IPAD ? 30 : 18),
	},
	buttonPosition2: {
		justifyContent: 'flex-end',
		flex: 1,
		...Platform.select({ android: { marginVertical: 1 } })
	},
	sendButtonStyle2: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (global.IS_IPAD ? 56 : 36),
		height: (global.IS_IPAD ? 56 : 36),
	},
	placeholderStyle: {
		fontFamily: global.DEFAULT_FONT,
		fontSize: (global.IS_IPAD ? 22 : 12),
		lineHeight: (global.IS_IPAD ? 24 : 16),
		textAlignVertical: 'center'
	}
});
