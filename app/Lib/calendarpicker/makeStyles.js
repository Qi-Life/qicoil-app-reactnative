/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
const DEFAULT_SELECTED_BACKGROUND_COLOR = '#5ce600';
const DEFAULT_SELECTED_TEXT_COLOR = '#000000';
const DEFAULT_TODAY_BACKGROUD_COLOR = '#CCCCCC';

export function makeStyles(scaler, backgroundColor, textColor, todayBackgroundColor) {
  const SELECTED_BG_COLOR = backgroundColor ? backgroundColor : DEFAULT_SELECTED_BACKGROUND_COLOR;
  const SELECTED_TEXT_COLOR = textColor ? textColor : DEFAULT_SELECTED_TEXT_COLOR;
  const TODAY_BG_COLOR = todayBackgroundColor ? todayBackgroundColor : DEFAULT_TODAY_BACKGROUD_COLOR;
  return {
    calendar: {
      height: 180 * scaler,
    },

    dayButton: {
      width: 20 * scaler,
      height: 20 * scaler,
      borderRadius: 20 * scaler,
      alignSelf: 'center',
      justifyContent: 'center',
    },

    dayLabel: {
      fontSize: 15 * scaler,
      color: global.BLACK_COLOR,
      alignSelf: 'center',
    },

    selectedDayLabel: {
      color: SELECTED_TEXT_COLOR,
    },

    dayLabelsWrapper: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingTop: 10 * scaler,
      paddingBottom: 10 * scaler,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.0)',
      borderColor: 'rgba(0,0,0,0.2)'
    },

    daysWrapper: {
      alignSelf: 'center',
      justifyContent: 'center',
    },

    dayLabels: {
      width: 50 * scaler,
      fontSize: 12 * scaler,
      color: global.BLACK_COLOR,
      textAlign: 'center',
    },

    selectedDay: {
      width: 20 * scaler,
      height: 20 * scaler,
      borderRadius: 20 * scaler,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    selectedDayBackground: {
      backgroundColor: SELECTED_BG_COLOR,
    },

    selectedToday: {
      width: 20 * scaler,
      height: 20 * scaler,
      backgroundColor: TODAY_BG_COLOR,
      borderRadius: 20 * scaler,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    dayWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40 * scaler,
      height: 25 * scaler,
      backgroundColor: 'rgba(0,0,0,0.0)',
    },

    startDayWrapper: {
      width: 50 * scaler,
      height: 30 * scaler,
      borderTopLeftRadius: 20 * scaler,
      borderBottomLeftRadius: 20 * scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    endDayWrapper: {
      width: 50 * scaler,
      height: 30 * scaler,
      borderTopRightRadius: 20 * scaler,
      borderBottomRightRadius: 20 * scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    inRangeDay: {
      width: 50 * scaler,
      height: 30 * scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    },

    monthLabel: {
      fontSize: 16 * scaler,
      color: BLACK_COLOR,
      // width: 180 * scaler,
      marginHorizontal: (global.IS_IPAD ? 30 : 20),
      textAlign: 'center'
    },

    headerWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      alignSelf: 'center',
      padding: 5 * scaler,
      backgroundColor: 'rgba(0,0,0,0.0)',
    },

    monthSelector: {
      fontSize: 14 * scaler,
      backgroundColor: global.DRAK_BLUE_COLOR,
      paddingVertical: (global.IS_IPAD ? 10 : 5),
      paddingHorizontal: (global.IS_IPAD ? 15 : 10),
      borderRadius: (global.IS_IPAD ? 15 : 10),
      overflow: "hidden",
    },

    prev: {
      textAlign: 'center',
      color: global.WHITE_COLOR,
    },

    next: {
      textAlign: 'center',
      color: global.WHITE_COLOR,
    },

    yearLabel: {
      fontSize: 14 * scaler,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center'
    },

    weeks: {
      flexDirection: 'column'
    },

    weekRow: {
      flexDirection: 'row'
    },

    disabledText: {
      fontSize: 14 * scaler,
      color: global.BLACK_COLOR,
      alignSelf: 'center',
      justifyContent: 'center'
    }
  };
}
