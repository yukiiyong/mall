const app = getApp() 
const infoData = require('../../mock/address').address
Page({
  data: {
    carts: [],
    info: {
      name: '',
      address: '',
      phone: ''
    },
    totalPrice: 0,
    selectNum: 0
  },
  checkGoods() {
    let carts = this.data.carts
    if(!carts || Object.keys(carts).length === 0) {
      this.setData({
        totalPrice: 0,
        selectNum: 0
      })
      return
    }
    let totalPrice = 0
    let selectNum = carts.length
    carts.map((v, i) => {
      totalPrice += v.price * v.num
    })
    this.setData({
      totalPrice,
      selectNum
    })
  },
  goToPage(ur) {
    wx.navigateTo({
      url: ur
    })
  },
  onLoad() {
    this.setData({
      carts: app.globalData.carts,
      info: infoData[0]
    })
    this.checkGoods()
  }
})