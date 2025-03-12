import React from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	Dimensions,
	Text,
	TouchableHighlight,
	Platform,
	StatusBar,
	I18nManager,
} from 'react-native';
import DefaultSlide from './defaultslide';
import DeviceInfo from "react-native-device-info";
// import { Colors } from 'react-native/Libraries/NewAppScreen';

import AppCommon from '../../CSS/AppCommon';
import Colors from '../../CSS/Colors';
import Common from '../../CSS/Common';
import Input from '../../CSS/Input';

// var { width } = Dimensions.get('window');
// const height = (global.IS_IPAD ? 600 : 375)
// width = width - (global.IS_IPAD ? 40 : 30)

var height = 0
var width = 0

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android';

export default class AppIntroSlider extends React.Component {
	static defaultProps = {
		activeDotStyle: {
			backgroundColor: 'rgba(255, 255, 255, .9)',
			width: 30,
		},
		activeDotStyleWidth: {
			width: 20,
		},
		dotStyle: {
			backgroundColor: 'rgba(0, 0, 0, .2)',
			width: 30,
		},
		dotStyleWidth: {
			width: 6,
		},
		skipLabel: 'Skip',
		doneLabel: 'Done',
		nextLabel: 'Next',
		prevLabel: 'Back',
		buttonStyle: null,
		buttonTextStyle: null,
		paginationStyle: null,
		showDoneButton: true,
		showNextButton: true,
	};
	state = {
		width,
		height,
		activeIndex: 0,
		activeDot: true,
	};

	componentDidMount() {
		height = this.props.sliderheight
		width = this.props.sliderwidth
		this.goToSlide(this.props.showIndex);
	}

	componentWillUnmount() {
	}

	goToSlide = pageNum => {
		this.setState({ activeIndex: pageNum });
		this.flatList.scrollToOffset({
			offset: this._rtlSafeIndex(pageNum) * this.state.width,
		});
	};

	// Get the list ref
	getListRef = () => this.flatList;

	_onNextPress = () => {
		var activeIndex = this.state.activeIndex

		activeIndex = activeIndex + 1
		if (this.props.slides.length == activeIndex) {
			this.setState({ activeIndex: -1 }, () => { })
		}

		this.goToSlide(this.state.activeIndex + 1);
		this.props.onSlideChange &&
			this.props.onSlideChange(this.state.activeIndex + 1, this.state.activeIndex);
	};
	_onPrevPress = () => {
		this.goToSlide(this.state.activeIndex - 1);
		this.props.onSlideChange &&
			this.props.onSlideChange(this.state.activeIndex - 1, this.state.activeIndex);
	};

	_renderItem = item => {
		const { width, height } = this.state;
		const props = { ...item.item, width, height };
		return (
			<View style={[{ width: this.state.width, height: this.state.height }]}>
				{this.props.renderItem ? (
					this.props.renderItem(props)
				) : (
					<DefaultSlide bottomButton={this.props.bottomButton} {...props} />
				)}
			</View>
		);
	};

	_renderButton = (name, onPress) => {
		const show = this.props[`show${name}Button`];
		const content = this.props[`render${name}Button`]
			? this.props[`render${name}Button`]()
			: this._renderDefaultButton(name, onPress);
		return show && this._renderOuterButton(content, name, onPress);
	};

	_renderDefaultButton = (name, onPress) => {
		let content = (
			<TouchableHighlight
				underlayColor={global.DEFAULT_COLOR}
				onPress={onPress}
				style={this.props.slides.length > 0 ? this.props.buttonMarginTop == undefined ? [] : [{ marginTop: this.props.buttonMarginTop }, Common.height40, Common.borderRadius10, Common.paddingHorizontal10, Common.paddingVertical10, Common.alignItmCenter, Common.justifyCenter, Colors.defaultBgColor, Common.zIndex9999] : [Common.displayNone]}>
				<Text onPress={onPress} style={[AppCommon.h3, Colors.whiteFnColor]}>
					{this.props[`${name.toLowerCase()}Label`]}
				</Text>
			</TouchableHighlight >
		);
		if (this.props.bottomButton) {
			content = (
				<View
					style={[
						styles.bottomButton,
						(name === 'Skip' || name === 'Prev') && {
							backgroundColor: 'transparent',
						},
						this.props.buttonStyle,
					]}
				>
					{content}
				</View>
			);
		}
		return content;
	};

	_renderOuterButton = (content, name, onPress) => {
		const style = name === 'Skip' || name === 'Prev' ? styles.leftButtonContainer : styles.leftButtonContainer;
		const { width, height } = Dimensions.get("window")
		return (
			<View style={!this.props.bottomButton && style}>
				<TouchableHighlight
					underlayColor={global.DEFAULT_COLOR}
					onPress={onPress}
					style={this.props.bottomButton ? [styles.flexOne, Common.zIndex9999] : [this.props.buttonStyle, Common.zIndex9999]}
				>
					{content}
				</TouchableHighlight>
				<View style={[Common.marginTop80, Common.justifyCenter, Common.alignItmCenter, { width: width }]}>
					<TouchableHighlight
						onPress={() => {
							var activeIndex = this.state.activeIndex
							if (activeIndex == 2) {
								this.props.nextClick()
							} else {
								this.goToSlide(activeIndex + 1);
							}
						}}
						underlayColor={global.TRANSPARENT_COLOR}
						style={[AppCommon.loginButton, Common.paddingHorizontal20, Colors.transparentBgColor]}>
						<Text style={[AppCommon.h1, Colors.blackFnColor, Input.fontBold]}>Next</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	};

	_renderNextButton = () => this._renderButton('Next', this._onNextPress);

	_renderPrevButton = () => this._renderButton('Prev', this._onPrevPress);

	_renderDoneButton = () => this._renderButton('Done', this.props.onDone && this.props.onDone);

	_renderSkipButton = () =>
		// scrollToEnd does not work in RTL so use goToSlide instead
		this._renderButton('Skip', () =>
			this.props.onSkip ? this.props.onSkip() : this.goToSlide(this.props.slides.length - 1)
		);

	_renderPagination = () => {
		const isLastSlide = this.state.activeIndex === this.props.slides.length - 1;
		const isFirstSlide = this.state.activeIndex === 0;

		const skipBtn =
			(!isFirstSlide && this._renderPrevButton()) || (!isLastSlide && this._renderSkipButton());
		const btn = isLastSlide ? this._renderDoneButton() : this._renderNextButton();

		return (
			<View style={[styles.paginationContainer, this.props.paginationStyle]}>
				<View style={styles.paginationDots}>
					{this.props.slides.length > 1 &&
						this.props.slides.map((_, i) => (
							<View
								key={i}
								style={[
									styles.dot,
									this._rtlSafeIndex(i) === this.state.activeIndex ? this.props.activeDotStyle : this.props.dotStyle,
									// this._rtlSafeIndex(i) === this.state.activeIndex ? this.props.activeDotStyleWidth : this.props.dotStyle1,
									this.props.dotsMarginTop == undefined ? {} : { marginTop: this.props.dotsMarginTop }
								]}
							//onPress={() => this.goToSlide(i)}
							/>
						))}
				</View>
				{btn}
				{skipBtn}
			</View>
		);
	};

	_rtlSafeIndex = i => (isAndroidRTL ? this.props.slides.length - 1 - i : i);

	_onMomentumScrollEnd = e => {
		const offset = e.nativeEvent.contentOffset.x;
		// Touching very very quickly and continuous brings about
		// a variation close to - but not quite - the width.
		// That's why we round the number.
		// Also, Android phones and their weird numbers
		const newIndex = this._rtlSafeIndex(Math.round(offset / this.state.width));
		if (newIndex === this.state.activeIndex) {
			// No page change, don't do anything
			return;
		}
		const lastIndex = this.state.activeIndex;
		this.setState({ activeIndex: newIndex });
		this.props.onSlideChange && this.props.onSlideChange(newIndex, lastIndex);
	};

	_onLayout = () => {
		//const { width, height } = Dimensions.get('window');
		if (width !== this.state.width || height !== this.state.height) {
			// Set new width to update rendering of pages
			this.setState({ width, height });
			// Set new scroll position
			const func = () => {
				this.flatList.scrollToOffset({
					offset: this._rtlSafeIndex(this.state.activeIndex) * width,
					animated: false,
				});
			};
			Platform.OS === 'android' ? setTimeout(func, 0) : func();
		}
	};

	render() {
		// Separate props used by the component to props passed to FlatList
		const {
			hidePagination,
			activeDotStyle,
			dotStyle,
			skipLabel,
			doneLabel,
			nextLabel,
			prevLabel,
			buttonStyle,
			buttonTextStyle,
			renderItem,
			data,
			scrollEnabled,
			...otherProps
		} = this.props;
		return (
			<View style={[styles.flexOne]}>
				<View style={[{ height: this.state.height }]}>
					<FlatList
						ref={ref => (this.flatList = ref)}
						data={this.props.slides}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						bounces={false}
						style={styles.flatList}
						renderItem={this._renderItem}
						onMomentumScrollEnd={this._onMomentumScrollEnd}
						extraData={this.state.width}
						onLayout={this._onLayout}
						{...otherProps}
						scrollEnabled={scrollEnabled == undefined ? true : scrollEnabled}
					/>
				</View>
				{!hidePagination && this._renderPagination()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flexOne: {
		flex: 1,
	},
	flatList: {
		flex: 1,
		flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
	},
	paginationContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	paginationDots: {
		bottom: (global.IS_IPAD ? 30 : 20),
		height: (global.IS_IPAD ? 30 : 20),
		flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
		justifyContent: 'center', //flex-start
		alignItems: 'center',
	},
	dot: {
		width: (global.IS_IPAD ? 10 : 6),
		height: (global.IS_IPAD ? 10 : 6),
		borderRadius: (global.IS_IPAD ? 8 : 5),
		marginHorizontal: (global.IS_IPAD ? 6 : 4),
	},
	activedot: {
		width: (global.IS_IPAD ? 10 : 20),
		height: (global.IS_IPAD ? 10 : 6),
		borderRadius: (global.IS_IPAD ? 8 : 5),
		marginHorizontal: (global.IS_IPAD ? 6 : 4),
	},
	leftButtonContainer: {
		position: 'absolute',
		// left: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rightButtonContainer: {
		position: 'absolute',
		right: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	// bottomButton: {
	// 	flex: 1,
	// 	backgroundColor: 'rgba(0, 0, 0, .3)',
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// },
	// buttonText: {
	// 	backgroundColor: 'transparent',
	// 	color: 'white',
	// 	fontSize: (global.IS_IPAD ? 36 : 18),
	// 	padding: (global.IS_IPAD ? 24 : 12),
	// },
});
