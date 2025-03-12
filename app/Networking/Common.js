
import AsyncStorage from '@react-native-community/async-storage';

export function logoutData() {
    AsyncStorage.setItem('email', '');
    AsyncStorage.setItem('password', '');
    AsyncStorage.setItem('social_id', '');
    AsyncStorage.setItem('social_type', '');
    AsyncStorage.setItem('login_flag', '', () => {
        global.USER_DATA = [];
        global.TAB_INDEX = 0;
        global.USER_CREATED_DAYS = 555;
        global.IS_SUBSCRIBE = false;
    });
}