import React, { Component } from 'react';
import { Image, Animated, Easing, Text,  TextInput, } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';

import AppCommon from './app/CSS/AppCommon';

import SplashScreenView from './app/SplashScreen/SplashScreenView';
import LandingView from './app/SplashScreen/LandingView'
import LoginView from './app/SplashScreen/LoginView';
import RegisterView from './app/SplashScreen/RegisterView';
import ForgotPassword from './app/SplashScreen/ForgotPassword';

import HomeTab from './app/HomeTab/HomeTab';
import QiCoilTab from './app/QiCoilTab/QiCoilTab'
import FrequenciesTab from './app/FrequenciesTab/FrequenciesTab'
import SettingsTab from './app/SettingsTab/SettingsTab';

import PlayerView from './app/Player/PlayerView';
import OpenWebView from './app/WebView/OpenWebView';
import EditProfile from './app/SettingsTab/EditProfile'
import ChangePassword from './app/SettingsTab/ChangePassword'
import InstructionView from './app/SettingsTab/InstructionView';
import HelpSupport from './app/SettingsTab/HelpSupport'
import SubscribeView from './app/Subscribe/SubscribeView'
import SecondSubscribeView from './app/Subscribe/SecondSubscribeView'

import AlbumsList from './app/QiCoilTab/AlbumsList'
import AlbumsDetails from './app/QiCoilTab/AlbumsDetails'
import QiCoilPlayer from './app/QiCoilTab/QiCoilPlayer'

import MasterQuantumSubView from './app/Subscribe/MasterQuantumSubView'
import HigherQuantumSubView from './app/Subscribe/HigherQuantumSubView'
import { AppProvider } from './app/Context/AppContext';


Text.defaultProps = Text.defaultProps || {};
TextInput.defaultProps = TextInput.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;
console.disableYellowBox = true;

let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });
  return {
    opacity,
    transform: [{ scaleY }],
  };
};

let BottomUp = (index, position, height) => {
  const inputRange = [index - 1, index, index + 1];
  const translateY = position.interpolate({
    inputRange,
    outputRange: [height, 0, 0],
  });
  const BottomUp = { transform: [{ translateY }] };
  return BottomUp;
};

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange,
    outputRange: [width, 0, 0],
  });
  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};

let SlideFromLeft = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange,
    outputRange: [-width, 0, 0],
  });
  const SlideFromLeft = { transform: [{ translateX }] };
  return SlideFromLeft;
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(8)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const height = layout.initHeight;
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition || 'default';
      return {
        bottomUp: BottomUp(index, position, height),
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width),
        left: SlideFromLeft(index, position, width),
      }[transition];
    },
  };
};

const TabBarComponent = (props) => (<BottomTabBar {...props} />);

const TabNavigator = createBottomTabNavigator({
  HomeTabNavigator: {
    screen: HomeTab,
    navigationOptions: {
      title: 'Home',
      tabBarIcon: ({ tintColor }) =>
      (<Image
        height={global.Gap_40}
        style={tintColor == global.DEFAULT_COLOR ? [] : [{ tintColor }]}
        source={tintColor == global.DEFAULT_COLOR ? require('./app/Images/tab_1_selected.png') : require('./app/Images/tab_1.png')}
      />),
    },
  },
  // SearchTabNavigator: {
  //   screen: SearchTab,
  //   navigationOptions: {
  //     title: 'Search',
  //     tabBarOnPress: ({ navigation, defaultHandler }) => {
  //       if (global.TAB_INDEX != 1) {
  //         navigation.navigate('SearchTabNavigator', { transition: 'bottomUp', refresh: true });
  //         defaultHandler()
  //       }
  //       global.TAB_INDEX = 1;
  //     },
  //     tabBarIcon: ({ tintColor }) =>
  //     (<Image
  //       height={global.Gap_40}
  //       style={tintColor == global.DEFAULT_COLOR ? [] : [{ tintColor }]}
  //       source={tintColor == global.DEFAULT_COLOR ? require('./app/Images/tab_2_selected.png') : require('./app/Images/tab_2.png')}
  //     />),
  //   },
  // },
  QiCoilTabNavigator: {
    screen: QiCoilTab,
    navigationOptions: {
      title: 'Quantum',
      tabBarOptions: {
        showLabel: true,
        allowFontScaling: false,
        // activeTintColor: global.DEFAULT_COLOR,
        activeTintColor: '#A19159',
        iconStyle: {
          width: (global.IS_IPAD ? 60 : 100),
          height: (global.IS_IPAD ? 60 : 100),
        },
        labelStyle: {
          fontFamily: global.DEFAULT_FONT,
          fontSize: (global.IS_IPAD ? 24 : 14),
          lineHeight: (global.IS_IPAD ? 30 : 18),
        },
        style: {
        },
        tabStyle: {
        },
      },
      tabBarIcon: ({ tintColor }) =>
      (<Image
        height={global.Gap_40}
        style={tintColor == '#A19159' ? [] : [{ tintColor }]}
        source={tintColor == '#A19159' ? require('./app/Images/tab_3_selected.png') : require('./app/Images/tab_3.png')}
      />
      ),
    },
  },
  FrequenciesTabNavigator: {
    screen: FrequenciesTab,
    navigationOptions: {
      title: 'Rife',
      tabBarIcon: ({ tintColor }) =>
      (<Image
        height={global.Gap_40}
        style={tintColor == global.DEFAULT_COLOR ? [] : [{ tintColor }]}
        source={tintColor == global.DEFAULT_COLOR ? require('./app/Images/tab_4_selected.png') : require('./app/Images/tab_4.png')}
      />
      ),
    },
  },
  SettingsTabNavigator: {
    screen: SettingsTab,
    navigationOptions: {
      title: 'Settings',
      tabBarIcon: ({ tintColor }) =>
      (<Image
        height={global.Gap_40}
        style={tintColor == global.DEFAULT_COLOR ? [] : [{ tintColor }]}
        source={tintColor == global.DEFAULT_COLOR ? require('./app/Images/tab_5_selected.png') : require('./app/Images/tab_5.png')}
      />),
    },
  },
}, {
  tabBarComponent: props =>
    <TabBarComponent
      {...props}
      // style={[AppCommon.tabBar, Common.borderTopRadius10]}
      style={[AppCommon.tabBar, {
        shadowColor: global.TAB_BG_COLOR,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: (global.IS_IPAD ? 50 : 30),
        shadowOpacity: 1.0,
        elevation: 2,
      }]}
    />,
  lazy: true,
  swipeEnabled: true,
  animationEnabled: true,
  initialRouteName: 'HomeTabNavigator',
  tabBarOptions: {
    showLabel: true,
    allowFontScaling: false,
    activeTintColor: global.DEFAULT_COLOR,
    // inactiveTintColor: global.LIGHT_DEFAULT_COLOR,
    iconStyle: {
      width: (global.IS_IPAD ? 60 : 100),
      height: (global.IS_IPAD ? 60 : 100),
    },
    labelStyle: {
      fontFamily: global.DEFAULT_FONT,
      fontSize: (global.IS_IPAD ? 24 : 14),
      lineHeight: (global.IS_IPAD ? 30 : 18),
      // color: "#41A1B8",
      // fontWeight: "bold",
    },
    style: {
    },
    tabStyle: {
    },
  }
});

const AppNavigator = createStackNavigator(
  {
    SplashScreenView: { screen: SplashScreenView },
    LandingView: { screen: LandingView },
    LoginView: { screen: LoginView },
    RegisterView: { screen: RegisterView },
    ForgotPassword: { screen: ForgotPassword },
    OpenWebView: { screen: OpenWebView },
    Tab: { screen: TabNavigator },
    PlayerView: { screen: PlayerView },
    EditProfile: { screen: EditProfile },
    ChangePassword: { screen: ChangePassword },
    InstructionView: { screen: InstructionView },
    HelpSupport: { screen: HelpSupport },
    SubscribeView: { screen: SubscribeView },
    SecondSubscribeView: { screen: SecondSubscribeView },
    AlbumsList: { screen: AlbumsList },
    AlbumsDetails: { screen: AlbumsDetails },
    QiCoilPlayer: { screen: QiCoilPlayer },
    MasterQuantumSubView: { screen: MasterQuantumSubView },
    HigherQuantumSubView: { screen: HigherQuantumSubView },
  },
  {
    initialRouteName: 'SplashScreenView', //LandingView // Tab
    headerMode: 'none',
    transitionConfig: TransitionConfiguration,
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  },
);


export default createAppContainer(AppNavigator);
