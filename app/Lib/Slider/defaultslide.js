import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Platform } from 'react-native';
import ProgressImage from '../../Lib/ProgressImage/ProgressImage';

export default class DefaultSlide extends React.PureComponent {
  render() {
    const style = {
      backgroundColor: this.props.backgroundColor,
      width: this.props.width,
      height: this.props.height,
      paddingBottom: this.props.bottomButton ? 132 : 64,
    };
    return (
      <View style={[styles.mainContent, style]}>
        <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
        <ProgressImage
          source={this.props.image ? this.props.image : require('../../Images/Logo.png')}
          style={this.props.imageStyle}
          imageStyle={[this.props.imageStyle]}
        />
        {/* <Image defaultSource={require('../../Images/Logo.png')} source={this.props.image} style={this.props.imageStyle} /> */}
        <Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, .7)',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, .7)',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
});
