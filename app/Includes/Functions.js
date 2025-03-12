import React, { Component } from 'react';
import Config from '../Includes/Config';
import WebServices from '../Networking/WebServices';
import AsyncStorage from '@react-native-community/async-storage'

export default class Functions extends React.Component {

	constructor(props) {
		super(props);
	}

	isEmailValid = (text) => {
		let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return pattern.test(String(text));
	}

	isAlphabeticalWithoutSpaceValid = (text) => {
		let pattern = /^[a-zA-Z]+$/;
		return pattern.test(String(text));
	}

	isAlphabeticalWithSpaceValid = (text) => {
		let pattern = /^[a-z A-Z]+$/;
		return pattern.test(String(text));
	}

	isValidFullName = (text) => {
		var textArray = text.split(' ');
		if (textArray.length == 2) {
			if (textArray[0].length > 0 && this.isAlphabeticalWithoutSpaceValid(textArray[0]) && textArray[1].length > 0 && this.isAlphabeticalWithoutSpaceValid(textArray[1])) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	isAlphabeticalNumericWithoutSpaceValid = (text) => {
		let pattern = /^[a-zA-Z0-9_.]+$/;
		return pattern.test(String(text));
	}

	isAlphabeticalNumericWithSpaceValid = (text) => {
		let pattern = /^[a-z A-Z0-9]+$/;
		return pattern.test(String(text));
	}

	isPassword = (text) => {
		let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
		return pattern.test(String(text));
	}

	isAddressValid = (text) => {
		let pattern = /^[a-zA-Z0-9_ @#%&,/.;:?{}]+$/;
		return pattern.test(String(text));
	}

	isNumericValid = (text) => {
		let pattern = /^[0-9]+$/;
		return pattern.test(String(text));
	}

	isPhoneNumerValid = (text) => {
		var pattern = /^0[0-8]\d{8}$/g;
		return pattern.test(String(text))
	}

	isAlphabeticalSymbolValid = (text) => {
		let pattern = /^[a-zA-Z-_@#%&,/.;:?{}]+$/;
		return pattern.test(String(text));
	}

	isSymbolValid = (text) => {
		let pattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		return pattern.test(String(text));
	}

	getRandomInt(max = 99999) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	isUrlValid(text) {
		var res = text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		if (res == null)
			return false;
		else
			return true;
	}

	checkUserLogin() {
		if (global.USER_DATA.user_id == undefined || global.USER_DATA.user_id == "") {
			return false;
		} else {
			return true;
		}
	}

	setTimer() {
		clearInterval(global.TEMP_INTERVAL);
		global.TEMP_INTERVAL = setInterval(() => {
			this.countdown()
		}, 1000)
	}

	countdown() {
		global.TEMP_TIME = global.TEMP_TIME - 1
		if (global.TEMP_TIME == 0) {
			clearInterval(global.TEMP_INTERVAL);
			global.TOTAL_PLAY_TIME = 0
			AsyncStorage.setItem('total_play_time', '0');
			global.TEMP_TIME = 0
		}
	}
}
