import DeviceInfo from 'react-native-device-info';

import { Platform } from 'react-native'

global.IS_IPAD = DeviceInfo.isTablet();
global.ModelName = DeviceInfo.getModel();
// iPhone XS // iPhone XS Max // iPhone XR // iPhone 11 Pro // iPhone 11 Pro Max
global.FULL_DISPLAY = false
if (global.ModelName == 'iPhone X' || global.ModelName == "iPhone XS" || global.ModelName == "iPhone XS Max" || global.ModelName == "iPhone XR" || global.ModelName == "iPhone 11" || global.ModelName == "iPhone 11 Pro" || global.ModelName == "iPhone 11 Pro Max" || global.ModelName == "iPhone 12 mini" || global.ModelName == "iPhone 12" || global.ModelName == "iPhone 12 Pro" || global.ModelName == "iPhone 12 Pro Max" || global.ModelName == "iPhone 13 mini" || global.ModelName == "iPhone 13" || global.ModelName == "iPhone 13 Pro" || global.ModelName == "iPhone 13 Pro Max") {
    global.FULL_DISPLAY = true
} else {
    global.FULL_DISPLAY = false
}

/*** 
 * COLOR CONSTANTS
 ***/
global.DEFAULT_COLOR = "#41A1B8";
global.DRAK_DEFAULT_COLOR = "#542B8B";
global.EXTRA_DRAK_DEFAULT_COLOR = "#1D2231";
global.FULL_DRAK_DEFAULT_COLOR = "#262940";
global.LIGHT_DEFAULT_COLOR = "#F3EBFD";
global.FULL_LIGHT_DEFAULT_COLOR = "#F0F0FF";
global.EXTRA_LIGHT_DEFAULT_COLOR = "#F8F7FB";
global.WHITE_COLOR = "#FFFFFF";
global.RED_COLOR = "#FF0000";
global.YELLOW_COLOR = "#FBCD4A";
global.BLACK_COLOR = "#000000";
global.FULL_LIGHT_BLACK_COLOR = "#424346";
global.LIGHT_BLACK_COLOR = "#161A1D";
global.LOGO_TAG_BLACK_COLOR = "#535455";
global.GREY_COLOR = "#C4C4C4";
global.DRAK_GREY_COLOR = "#808080";
global.LIGHT_GREY_COLOR = "#D9D9D9";
global.FULL_LIGHT_GREY_COLOR = "#F5F5F5";
global.LOGIN_TAG_GREY_COLOR = "#979EA6";
global.LIGHT_BLUE_COLOR = "#3046BA";
global.FULL_LIGHT_BLUE_COLOR = "#6765FC";
global.BLUE_COLOR = "#267dbb";
global.DRAK_BLUE_COLOR = "#1C6CAF";
global.FACEBOOK_BUTTON = "#607EBE";
global.FACEBOOK_BG = "#4267B2";
global.LIGHT_FACEBOOK_COLOR = "#1777F2";
global.TRANSPARENT_COLOR = "rgba(0,0,0,0)";
global.CHAT_BG_COLOR = "#FBE6ED";
global.CHAT_BOX_COLOR = "#EBEBFF";
global.MEMBERSHIP_GREY_COLOR = "#C0C0C0";
global.GREEN_COLOR = "#00c351";
global.LIGHT_GREEN_COLOR = "#ECFDF8";
global.NUMBER_PLATE_COLOR = "#FBCE55"
global.ORANGE_COLOR = "#F2923C";
global.LIGHT_ORANGE_COLOR = "#FFF7F0";
global.GREEN_LIGHT_COLOR = "#30C090";
global.HOME_DETAILS_COLOR = "#1B253A";
global.TAB_BG_COLOR = "#303033";
global.GRADIENT_TOP_COLOR = "#6F7275";
global.GRADIENT_BOTTOM_COLOR = "#42B5F2";
global.GRADIENT_RIGHT_COLOR = "#CA42F2";


/*** 
 * GAP CONSTANTS
 ***/
global.Top_Bar_Height = (IS_IPAD ? 80 : 40);
global.Tab_Bar_Height = (IS_IPAD ? 90 : 60);
global.Gap_0 = 0;
global.Gap_1 = 1;
global.Gap_2 = (IS_IPAD ? 4 : 2);
global.Gap_3 = (IS_IPAD ? 5 : 3);
global.Gap_5 = (IS_IPAD ? 10 : 5);
global.Gap_10 = (IS_IPAD ? 15 : 10);
global.Gap_15 = (IS_IPAD ? 20 : 15);
global.Gap_20 = (IS_IPAD ? 30 : 20);
global.Gap_25 = (IS_IPAD ? 35 : 25);
global.Gap_30 = (IS_IPAD ? 50 : 30);
global.Gap_35 = (IS_IPAD ? 55 : 35);
global.Gap_40 = (IS_IPAD ? 70 : 40);
global.Gap_50 = (IS_IPAD ? 80 : 50);

/***
 * FONT CONSTANTS
 ***/

global.DEFAULT_FONT = Platform.OS == "ios" ? "Arial" : "Arial";
global.DEFAULT_FONT_BOLD = "Arial-BoldMT";
global.FUTURA_FONT_BOOK = "FuturaBT-Book";
global.FUTURA_MEDIUM = "Futura-Medium";
global.FUTURA_FONT_BOLD = "Futura-Bold";
global.UK_NUMBER_PLATE_FONT = "UKNumberPlate";
global.CUTIVE_MONO_FONT = "CutiveMono-Regular";

global.HKGROTESK_REGULAR = "HKGrotesk-Regular";
global.HKGROTESK_REGULAR_LEGACY = "HKGrotesk-RegularLegacy";
global.HKGROTESK_MEDIUM = "HKGrotesk-Medium";
global.HKGROTESK_MEDIUM_LEGACY = "HKGrotesk-MediumLegacy";
global.HKGROTESK_SEMIBOLD = "HKGrotesk-SemiBold";
global.HKGROTESK_SEMIBOLD_LEGACY = "HKGrotesk-SemiBoldLegacy";
global.HKGROTESK_BOLD = "HKGrotesk-Bold";
global.HKGROTESK_BOLD_LEGACY = "HKGrotesk-BoldLegacy";