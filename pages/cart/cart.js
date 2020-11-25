const app = getApp()

Page({
  data: {
    allSelected: false,
    totalPrice: 0,
    carts: [],
    listHeight: 0,
    iconSize: '40rpx',
    selectNum: 0,
    isEdit: false
  },
  selectItem(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.carts[index]
    let isSelect = !item.isSelect
    let tag = 'carts['+index+'].isSelect'
    this.setData({
      [tag]: isSelect
    })
    this.checkGoodsSelection()
  },
  selectAll() {
    const allSelected = !this.data.allSelected
    let carts = this.data.carts
    this.setData({
      allSelected: allSelected
    })
    carts.map((v, i) => {
      v.isSelect = allSelected
    })
    this.setData({
      carts: carts
    }, () => {this.checkGoodsSelection()})
  },
  checkGoodsSelection() {
    let carts = this.data.carts
    if(!carts || Object.keys(carts).length === 0) {
      this.setData({
        selectNum: 0,
        totalPrice: 0,
        allSelected: false
      })
      return
    }
    let selectNum = 0
    let totalPrice = 0
    carts.map((v, i) => {
      if(v.isSelect) {
        selectNum++
        totalPrice += v.num * v.price
      }
    })
    let allSelected = selectNum === carts.length
    this.setData({
      selectNum,
      totalPrice,
      allSelected
    })
  },
  editList() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  increaseItem(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.carts[index]
    let name = 'carts['+index+']'
    item.num = item.num + 1
    if(item.num > item.amount) {
      wx.showToast({
        title: '商品数量大于最大购买量',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      [name]: item
    })
    this.checkGoodsSelection()
  },
  decreaseItem(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.carts[index]
    let tag = 'carts['+index+'].num'
    let num = this.data.carts[index].num 
    num--
    if(num <= 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除当前商品？',
        success: (res) => {
          if(res) {
            let carts = this.data.carts
            carts.splice(index, 1)
            this.setData({
              carts
            })
            this.checkGoodsSelection()
          }
        },
        fail: () => {
          console.log('showModal 出现错误')
        }
      })
      return
    }
    this.setData({
      [tag]: num
    })
    this.checkGoodsSelection()
  },
  onLoad() {
    let query = wx.createSelectorQuery()
    let eleHeight = 0
    query.select('#header').boundingClientRect()
    query.select('#footer').boundingClientRect()
    query.exec(res => {
      for(let i = 0; i < res.length; i++) {
        eleHeight += res[i].height
      }
      this.setData({
        carts: app.globalData.carts,
        listHeight: app.globalData.winHeight - eleHeight + 40 //40为底部导航栏高度，此页面没有导航栏，小程序初始加载时候有导航栏，所以要减去
      }, () => {this.checkGoodsSelection()})
    })
   
  },
  onShow() {
    // this.setData({
    //   carts: app.globalData.carts
    // })
  },
  onHide() {
    console.log('cart page onHide')
    let carts = this.data.carts
    if(Object.keys(this.data.carts).length === 0) {
      carts = []
    }
    app.globalData.carts = carts
  },
  onUnload() {
    // console.log('cart page onUnload')
    let carts = this.data.carts
    if(Object.keys(this.data.carts).length === 0) {
      carts = [] //防止carts为空对象
    }
    app.globalData.carts = carts
  }
})