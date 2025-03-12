import { StyleSheet, Platform } from 'react-native';
import StyleConstant from './StyleConstant';

export default StyleSheet.create({
	textBold: {
		fontWeight: "bold"
	},
	textItalic: {
		fontStyle: "italic"
	},
	textLeft: {
		textAlign: "left"
	},
	textCenter: {
		textAlign: "center"
	},
	textRight: {
		textAlign: "right"
	},
	textUnderline: {
		textDecorationLine: 'underline',
	},
	fontDefault: {
		fontFamily: global.DEFAULT_FONT,
	},
	fontBold: {
		fontFamily: global.DEFAULT_FONT_BOLD,
	},
	fontFuturaBook: {
		fontFamily: global.FUTURA_FONT_BOOK,
	},
	fontFuturaMedium: {
		fontFamily: global.FUTURA_MEDIUM,
	},
	fontFuturaBold: {
		fontFamily: global.FUTURA_FONT_BOLD,
	},
	fontUKNumberPlate: {
		fontFamily: global.UK_NUMBER_PLATE_FONT,
	},
	fontCutiveMono: {
		fontFamily: global.CUTIVE_MONO_FONT,
	},
	fontHKGroteskRegular: {
		fontFamily: global.HKGROTESK_REGULAR,
	},
	fontHKGroteskRegularLegacy: {
		fontFamily: global.HKGROTESK_REGULAR_LEGACY,
	},
	fontHKGroteskMedium: {
		fontFamily: global.HKGROTESK_MEDIUM,
	},
	fontHKGroteskMediumLegacy: {
		fontFamily: global.HKGROTESK_MEDIUM_LEGACY,
	},
	fontHKGroteskSemiBold: {
		fontFamily: global.HKGROTESK_SEMIBOLD,
	},
	fontHKGroteskSemiBoldLegacy: {
		fontFamily: global.HKGROTESK_SEMIBOLD_LEGACY,
	},
	fontHKGroteskBold: {
		fontFamily: global.HKGROTESK_BOLD,
	},
	fontHKGroteskBoldLegacy: {
		fontFamily: global.HKGROTESK_BOLD_LEGACY,
	},
});