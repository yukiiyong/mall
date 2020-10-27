const wechat = require('./util/wechat.js')
App({
	data: {
	},
	wechat: wechat,
	//生命周期函数，监听小程序初始化
	//当小程序初始化完成，会触发onLanch (全局只触发一次)
	onLaunch() {
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		wx.login({
			success: res => {
				//发送res.code到后台获取openId，sessionKey，unionId
			}
		})
		//获取用户信息
		wx.getSetting({
			success: res => {
				if(res.authSetting['scope.userInfo']) {
					//已经授权，可以直接调用getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							this.globalData.userInfo = res.userInfo							
							//由于getUserInfo是网络请求，所以可能在page.onload之后才返回
							//所以此处加上callback以防止这种情况
							if(this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				} 
			}
		})
		wx.getSystemInfo({
			success: res => {
				this.globalData.winHeight = res.windowHeight
				this.globalData.winWidth = res.windowWidth
			}
		})

	},
	http: (url, data='',method='GET') => {
		const baseUrl = ''
		return new Promise((resolve, reject) => {
			wx.request({
				url: baseUrl + url,
				data: data,
				method,
				success: (res) => {
					if(res.code != 200) {
						wx.showModal({
							title: '提示',
							content: res.data.message || '请求失败！',
							success: (res) => {
								if(res) {
									console.log('用户点击确定')
								} else {
									console.log('用户点击取消')
								}
							}
						})
					}
					resolve(res.data)
				},
				fail: (res) => {
					reject(res)
				}
			})
		})

	},
	globalData: {
		userInfo: null,
		winWidth: 0,
		winHeight: 0,
		carts: []
	}
})