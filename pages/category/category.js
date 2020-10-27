const app = getApp()
let goods = require('../../mock/goods').goods

Page({
  data: {
		animaTimer: null,
		goodsInput: '',
		curIndex: 0, 
		scrollTop: 0,
		cateHeight: 0,  
		isLoadingEnd: false,
		categoryList: [
			{name: '新鲜水果',id: '1001'},
			{name: '时令蔬菜',id: '1002'},
			{name: '肉类家禽',id: '1003'},
			{name: '水产海鲜',id: '1004'},
			{name: '粮油调味',id: '1005'}
		],
		showGoods: [],
		selectedGoods:[],
		shoppingcartIsShow: false,
		animationData: '',
		shoppingCartPos: {
			top: 0,
			left: 0
		},
		naviBack: false,
		style: 'top:0;left:0;opacity:0;'
	},
	changeGoods() {

	},
	loadGoods() {
		this.setData({
			showGoods: goods
		})
	},
	search(e) {
		console.log(e)
	},
	addProduct(e) {
		let index = e.currentTarget.dataset.index

		// let left = e.touches[0].pageX
		// let top = e.touches[0].pageY
		let left = e.detail.x - 40
		let top = e.detail.y - 40
		this.setData({
			style: `left: ${left}px;top:${top}px;`
		})
		this.playAnimation(e,left,top)
	},
	deleteProduct(e) {
		// let index = e.currentTarget.dataset.index
		let id = e.currentTarget.dataset.id
		let showGoodIndex = this.findGoodIndexById(id, this.data.showGoods)
		let data = this.data.showGoods[showGoodIndex]
		let selectedGoods = this.data.selectedGoods
		let selectedIndex = this.findGoodIndexById(id, selectedGoods)
		//由于selectedGoods里的每一项都是showGoods（数组）里对应的的一个对象，所以赋值时是赋予对象的引用
		//在增减selectedGoods和showGoods时只需要改其中一个的num就行了，否则会造成数量-2/+2
		data.num = data.num-1
		if(data.num <= 0) {
			data.isSelect = false
			selectedGoods.splice(selectedIndex, 1)
			if(selectedGoods.length === 0 && this.data.shoppingcartIsShow) {
				this.transShoppingCart()
			}
		}
		let tag = 'showGoods['+showGoodIndex+'].isSelect'
		let num = 'showGoods['+showGoodIndex+'].num'
		this.setData({
			[tag]: data.isSelect,
			[num]: data.num,
			selectedGoods: selectedGoods
		})
		app.globalData.carts = selectedGoods
	},
	switchCategory(e) {
		const index = e.currentTarget.dataset.index
		this.setData({
			curIndex: index
		})
	},
	playAnimation(e,left,top) {
		clearTimeout(this.animaTimer)
		this.animaTimer = setTimeout(() => {
			this.setData({
				style: `--startLeft:${left}px;--startTop: ${top}px;--endLeft:${this.data.shoppingCartPos.left}px;--endTop:${this.data.shoppingCartPos.top}px;
					animation: runTop .3s cubic-bezier(.66,.1,1,.41), runLeft .3s linear;`
			})
		},5)
		this.setDataToShoppingCart(e)
	},
	setDataToShoppingCart(e) {
		const index = e.currentTarget.dataset.index
		const id = e.currentTarget.dataset.id

		let showGoodIndex = this.findGoodIndexById(id, this.data.showGoods)
		let data = this.data.showGoods[showGoodIndex]
		let selectedGoods = this.data.selectedGoods
		let selectedIndex = this.findGoodIndexById(id,selectedGoods)
		data.num = data.num + 1
		if(!data.isSelect || selectedIndex === -1) {
			let copiedData = {...data}
			selectedGoods.push(copiedData)
		}	else {
			selectedGoods[selectedIndex].num = selectedGoods[selectedIndex].num + 1
		}
		let num = 'showGoods['+showGoodIndex+'].num'   
		let tag = 'showGoods['+showGoodIndex+'].isSelect'
		this.setData({
			[tag]: true,
			[num]: data.num,
			selectedGoods: selectedGoods
		})
		app.globalData.carts = selectedGoods
    },
	findGoodIndexById(id, list) {
		//get id return index
		let returnVal = -1
		if(!id) {
			console.warn('id must be received')
			return -1
		}
		if(!(list instanceof Array)) {
			console.warn('list must be array')
			return -1
		}
		list.map((v, i) => {
			if(v.skuId === id) {
				returnVal = i
			}
		})
		return returnVal
	},
	scrolls(e) {
			// console.log(`scrollview scroll ${e.detail.scrollTop}`)
			
	},
	queryElementSize(id) {
		return new Promise((resolve, reject) => {
			let query = wx.createSelectorQuery()
			query.select('#'+id).boundingClientRect()
				.exec((rect) => {
					resolve(rect[0])
				})
		})
	},
	queryShoppingCartPos() {
		//获取左下角购物车图标的top,left值
		this.queryElementSize('shoppingCart').then(rect => {
			this.setData({
				'shoppingCartPos.left': rect.left + (rect.width / 2),
				'shoppingCartPos.top': rect.top +(rect.height / 2)
			})
		}).catch(err => {
			console.log(err)
		})
	},
	transShoppingCart(e) {
		if(this.data.selectedGoods.length === 0) {
			wx.showToast({
				title: '购物车里没有商品~',
				icon: 'none',
				duration: 1500
			})
			return
		}
		let shoppingcartIsShow = this.data.shoppingcartIsShow
		shoppingcartIsShow = !shoppingcartIsShow

		let animation = wx.createAnimation({
			duration: 500,  //动画持续时间
			timingFunction: 'ease' //动画效果，默认为linear
		})
		this.animation = animation //挂到实例中以便别的函数使用

		if(shoppingcartIsShow) { //需显示,先显示购物车后向上滑入
			this.setData({
				shoppingcartIsShow: shoppingcartIsShow
			})
			this.fadeIn()
		} else { //先向下滑出后隐藏购物车
			this.fadeDown()
			let timer = setTimeout(() => {
				this.setData({
					shoppingcartIsShow: shoppingcartIsShow
				})
				clearTimeout(timer)
			}, 500)
		}
	},
	fadeIn() {
		this.animation.translateY(0).opacity(1).step()
		this.setData({
			animationData: this.animation.export()
		})
	},
	fadeDown() {
		this.animation.translateY(300).opacity(0).step()
		this.setData({
			animationData: this.animation.export()
		})
	},
	clearAll(e) {
		wx.showModal({
			title: '是否清空商品?',
			showCancel: true,
			cancelText: '取消',
			confirmText: '清除',
			success: (res) => {
				if(!res.confirm) return false
				//clear selectedGoods and make every in showGoods isSelect false
				let selectedGoods = this.data.selectedGoods
				let showGoods = this.data.showGoods
				for(let i = 0; i < selectedGoods.length; i++) {
					let index = this.findGoodIndexById(selectedGoods[i].skuId, showGoods)
					showGoods[index].isSelect = false
					showGoods[index].num = 0
				}
				this.transShoppingCart()
				this.setData({
					showGoods: showGoods,
					selectedGoods: []
				})
				app.globalData.carts = []
			}
		})
	},
	goToOrder() {
		wx.navigateTo({url:"../order/order"})
	},
	onLoad: function(options) {
		let query = wx.createSelectorQuery()
		let eleHeight = 0
		query.select('#search').boundingClientRect()
		query.select('#shopcart').boundingClientRect()
		query.exec(res => {
				for(let i = 0; i < res.length; i++) {
						eleHeight += res[i].height
				}
				this.setData({
						cateHeight: app.globalData.winHeight - eleHeight
				})
		})
		this.loadGoods()
	},
	resetGoodsNum(goods) {
		if(!(goods instanceof Array)) {
			return
		}
		for(let i = 0; i < goods.length; i++) {
			goods[i].num = 0
		}
		return goods
	},
	onHide() {
		this.setData({
			naviBack: true
		})
		console.log(app.globalData.carts)
	},
	onShow: function(options) {
		let showGoods = [...this.data.showGoods]
		if(!app.globalData.carts instanceof Array) {
			app.globalData.carts = []
		}
		let carts = app.globalData.carts
		if(this.data.naviBack) {
			showGoods = this.resetGoodsNum(showGoods)
			for(let i = 0;i < carts.length;i++) {
				let index = this.findGoodIndexById(carts[i].skuId,
					showGoods)
				if(index > -1) {
					showGoods[index].num = carts[i].num
				} else {
					showGoods.push(carts[i])
				}
			}
			this.setData({
				showGoods: showGoods,
				selectedGoods: carts
			})
		}
    this.queryShoppingCartPos()    
  },
	onPageScroll: function(e) {
		// console.log(`pagescroll scrollL:${e.scrollTop}`)
	}
})