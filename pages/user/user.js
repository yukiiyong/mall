const app = getApp()

Page({
  data: {
    user: {
      avatarUrl: '',
      nickname: ''
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    if(app.globalData.userInfo) {
      this.setData({
        user:app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if(this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          user:app.globalData.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo(e) {
    const userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    app.wechat.setStorage('user', userInfo)
      .then(res => {
        console.log(res)
        this.setData({
          user: userInfo,
          hasUserInfo: true
        })
      })
  }
})