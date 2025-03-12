import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import Controls from './Controls';

import AppCommon from '../../CSS/AppCommon';
import Colors from '../../CSS/Colors';
import Common from '../../CSS/Common';
import Input from '../../CSS/Input';


export default function HeaderControls(props) {
  const {
    styles,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    months,
    previousTitle,
    nextTitle,
    textStyle,
  } = props;
  const MONTHS = months ? months : Utils.MONTHS; // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const previous = previousTitle ? previousTitle : 'Previous';
  const next = nextTitle ? nextTitle : 'Next';
  const month = MONTHS[currentMonth];
  const year = currentYear;

  return (
    <View style={styles.headerWrapper}>
      {/* <Controls
        label={previous}
        onPressControl={onPressPrevious}
        styles={[styles.monthSelector, styles.prev]}
        textStyles={textStyle}
      /> */}
      <TouchableHighlight
        onPress={onPressPrevious}
        underlayColor={global.TRANSPARENT_COLOR}
        style={[]}>
        <Image source={require('../../Images/left_arrow.png')} style={[AppCommon.icon22, Colors.extraDrakBlueTnColor]} />
      </TouchableHighlight>
      <View>
        <Text style={[styles.monthLabel, textStyle, Input.textItalic]}>
          {/* {month} {year} */}
          {month}
        </Text>
      </View>
      <TouchableHighlight
        onPress={onPressNext}
        underlayColor={global.TRANSPARENT_COLOR}
        style={[]}>
        <Image source={require('../../Images/right_arrow.png')} style={[AppCommon.icon22, Colors.extraDrakBlueTnColor]} />
      </TouchableHighlight>
      {/* <Controls
        label={next}
        onPressControl={onPressNext}
        styles={[styles.monthSelector, styles.next]}
        textStyles={textStyle}
      /> */}
    </View>
  );
}

HeaderControls.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
};
