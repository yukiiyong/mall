//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [
      {title: 'list1',isTouchMove: false},
      {title: 'list2',isTouchMove: false},
      {title: 'list3',isTouchMove: false},
      {title: 'list4',isTouchMove: false}
    ],
    startX: -1,
    startY: -1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  angle(start,end) {
    let _x = end.x - start.x
    let _y = end.y - start.y
    //返回角度 即Math.atan()返回数字的正切值
    return 360 * Math.atan(_y / _x) / (2 * Math.PI)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  touchstart: function(e) {
    //reset all list
    this.data.list.forEach((v, i) => {
      if(v.isTouchMove) {
        v.isTouchMove = false
      }
    })
    //set startX=clientX starY=clientY
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      list: this.data.list
    })
  },
  touchmove: function(e) {
    let startX = this.data.startX
    let startY = this.data.startY
    let index = e.currentTarget.dataset.index
    let touchMoveX = e.touches[0].clientX
    let touchMoveY = e.touches[0].clientY
    let angle = this.angle({x: startX, y: startY}, {x: touchMoveX, y: touchMoveY})
    this.data.list.forEach((v, i) => {
      v.isTouchMove = false
      if(Math.abs(angle) > 30) return
      if(i === index) {
        if(touchMoveX > startX) {
          v.isTouchMove = false
        } else {
          v.isTouchMove = true
        }
      }
      this.setData({
        list: this.data.list
      })
    })
  },
  del(e) {
    let index = e.currentTarget.dataset.index
    this.data.list.splice(index, 1)
    this.setData({
      list: this.data.list
    })
  }
})
