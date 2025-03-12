import React from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default function Controls({ styles, textStyles, label, onPressControl }) {
  return (
    <TouchableHighlight
      underlayColor={global.TRANSPARENT_COLOR}
      onPress={() => onPressControl()}
    >
      <Text style={[styles, textStyles]}>
        {label}
      </Text>
    </TouchableHighlight>
  );
}

Controls.propTypes = {
  styles: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onPressControl: PropTypes.func.isRequired,
};
