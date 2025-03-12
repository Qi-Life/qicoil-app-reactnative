import React, { Component } from 'react';
import { Alert } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment';

import Config from '../Includes/Config';
import WebServices from '../Networking/WebServices';

export default class WebFunctions extends React.Component {

	constructor(props) {
		super(props);
	}

	getUserData(login_flag = "", email = "", password = "", social_id = "", social_type = "") {
		if (login_flag) {
			var data_Array = [];
			if (login_flag == "1" && email && password) {
				data_Array.push({ name: 'email', data: email.toString() });
				data_Array.push({ name: 'password', data: password.toString() });
			} else if (login_flag == "2" && social_id && social_type) {
				if (social_type == "Facebook") {
					data_Array.push({ name: 'fb_id', data: social_id.toString() });
				} else if (social_type == "Google") {
					data_Array.push({ name: 'gg_id', data: social_id.toString() });
				} else if (social_type == "Apple") {
					data_Array.push({ name: 'apple_id', data: social_id.toString() });
				}
			}
			ReactNativeBlobUtil.fetch('POST', global.USER_LOGIN, {
				'Content-Type': 'multipart/form-data',
			}, data_Array).then((response) => {
				response = response.json();
				var dataArray = response['user'];
				if (dataArray.length > 0) {
					dataArray = dataArray[0]
					if (dataArray && dataArray.fetch_flag == '1') {
						AsyncStorage.setItem('login_flag', JSON.stringify(login_flag));
						if (login_flag == "1" && email && password) {
							AsyncStorage.setItem('email', JSON.stringify(email));
							AsyncStorage.setItem('password', JSON.stringify(password));
						} else if (login_flag == "2" && social_id && social_type) {
							AsyncStorage.setItem('social_id', JSON.stringify(social_id));
							AsyncStorage.setItem('social_type', JSON.stringify(social_type));
						}
						global.USER_DATA = dataArray;
						this.setSubcribe()
					}
				}
			}).catch((error) => {
			});
		}
	}

	setSubcribe() {
		if (global.USER_DATA.category_ids && global.USER_DATA.category_ids != undefined && global.USER_DATA.category_ids != null) {
			var categoryArray = global.USER_DATA.category_ids.split(',');
			categoryArray.map((category_id, index) => {
				if (category_id == 1) {
					global.IS_SUBSCRIBE = true;
				}
			})
		}
		if (global.USER_DATA.created_date && global.USER_DATA.created_date != undefined && global.USER_DATA.created_date != null) {
			var user_created_days = ''
			var given = moment(global.USER_DATA.created_date, "YYYY-MM-DD");
			var current = moment().startOf('day');
			user_created_days = moment.duration(given.diff(current)).asDays();
			if (user_created_days != undefined && user_created_days != null) {
				user_created_days = user_created_days.toString()
				if (user_created_days != 0) {
					user_created_days = user_created_days.substring(1);
				}
				global.USER_CREATED_DAYS = user_created_days
			}
		}
	}
}