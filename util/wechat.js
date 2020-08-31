//将微信官方api封装成Promise形式
function login() {
	return new Promise((resolve, reject) => {
		wx.login({success: resolve, fail: reject})
	})
}

function getUserInfo() {
	return new Promise((resolve, reject) => {
		wx.getUserInfo({success: resolve, fail: reject})
	})
}

function setStorage(key, value) {
	return new Promise((resolve, reject) => {
		wx.setStorage({key:key,data:value,success:resolve,fail:reject})
	})
}
function getStorage(key) {
	return new Promise((resolve, reject) => {
		wx.getStorage({key:key,success: resolve, fail: reject})
	})
}

function getLocation(type) {
	return new Promise((resolve, reject) => {
		wx.getLocation({type:type,success:resolve, fail:reject})
	})
}
function authorize(scope) {
	return new Promise((resolve, reject) => {
		wx.authorize({scope: scope, success: resolve, fail: reject})
	})
}
function showModal(param) {
	if(!(param instanceof Object)) {
		console.log('show modal param err')
	}
	return new Promise((resolve, reject) => {
		wx.showModal({...param,success: resolve, fail: reject})
	})
}
module.exports = {
	login,
	getUserInfo,
	setStorage,
	getStorage,
	getLocation,
	authorize,
	showModal,
	original: wx
}