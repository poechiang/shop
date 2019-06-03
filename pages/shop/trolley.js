// pages/shop/trolley.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goods: [], 
		allSelected:false,
		total:{
			freight:0,
			price:0,
			count:0,
		},
		statusHeight: app.systemInfo.tabBarHeight||48,
		statusBottom: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	},
	loadData(options){
		options = options || {}
		var trolley = wx.getStorageSync('trolley')
		if(!trolley || trolley.total<=0){
			this.setData({
				goods: [],
				allSelected: false,
				total: {
					freight: 0,
					price: 0,
					count: 0,
				},
			})
			return
		}
		var ids=[],list = trolley.list

		for(var x in trolley.list){
			ids.push(x)
		}

		app.http.request({
			url: 'shop/all_goods',
			param: { id:ids},
			done: rlt => {
				var goods = rlt.data
				for(var x in goods){
					goods[x].count=list[goods[x].id]
				}
				this.setData({
					goods: goods,
					allSelected: false,
					total: {
						freight: 0,
						price: 0,
						count: 0,
					},
				})

				options.complete && options.complete(rlt)
			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

		this.loadData(this.options)
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	}, 
	/**
	 * 显示菜单
	 */
	showActionSheet(e){
		var currIndex = e.currentTarget.dataset.index,
			goods = this.data.goods,
			good = goods[currIndex]

		app.ui.sheets({ 
			'清空':(index, item)=>{
				app.ui.modal('确定要清空购物车吗',{
					confirm:()=>{
						wx.setStorage({
							key: 'trolley',
							data: { list: {}, total: 0 },
							success: res=> {
								this.setData({
									goods: [],
									total: { freight: 0, price: 0, count: 0 }
								})
							},
						})
					},
					cancel: true
				})
			},
			'移除': (index, item) => {
				app.ui.modal('确定要从购物车移除指定产品吗？', {
					confirm: () => {
						var trolley = wx.getStorageSync('trolley')
						goods.splice(currIndex, 1)
						delete (trolley.list[good.id])
						trolley.total -= 1
						if (trolley.total <= 0) {
							trolley = { list: [], total: 0 }
						}
						wx.setStorage({
							key: 'trolley',
							data: trolley,
							success: () => {
								this.setData({
									goods: goods
								})
							}
						})
					},
				cancel: true
				})
			}
		})
	},
	handleSelect(e){
		var index = e.currentTarget.dataset.index,
			goods= this.data.goods

		goods[index].selected = !(goods[index].selected||false)

		this.statistics(total=>{
			this.setData({
				goods: goods,
				total:total
			})
		})
	},
	handleCountSub(e) {
		var index = e.currentTarget.dataset.index,
			goods = this.data.goods,
			gid = goods[index].id,
			trolley = wx.getStorageSync('trolley')

		if(goods[index].count<=1){
			app.ui.modal('确定要从购物车移除指定产品吗？',{
				confirm:()=>{
					goods.splice(index, 1)
					delete (trolley.list[gid])
					trolley.total -= 1
					if (trolley.total <= 0) {
						trolley = { list: [], total: 0 }
					}
					wx.setStorage({
						key: 'trolley',
						data: trolley,
						success: () => {
							this.setData({
								goods: goods
							})
						}
					})
				},
				cancel:true
			})
		}
		else{
			goods[index].count -= 1
			trolley.list[gid] -= 1
			wx.setStorage({
				key: 'trolley',
				data: trolley,
				success: () => {
					if(goods[index].selected){
						this.statistics(total => {
							this.setData({
								goods: goods,
								total: total
							})
						})
					}
					else{
						this.setData({
							goods: goods
						})
					}
					
				}
			})
		}
	},
	handleCountChange(e) {
		var index = e.currentTarget.dataset.index,
			count = e.detail.value,
			goods = this.data.goods,
			gid = goods[index].id,
			trolley = wx.getStorageSync('trolley')

		
		if (count <= 0) {
			app.ui.modal('确定要从购物车移除指定产品吗？', {
				confirm: () => {
					var selected = goods[index].selected
					goods.splice(index, 1)
					delete (trolley.list[gid])
					trolley.total -= 1
					if (trolley.total <= 0) {
						trolley = { list: [], total: 0 }
					}

					if (selected) {
						this.statistics(total => {
							this.setData({
								goods: goods,
								total: total
							})
						})
					}
					else {
						this.setData({
							goods: goods
						})
					}
				}
			})
		}
		else{
			goods[index].count = count
			trolley.list[gid] = count
			wx.setStorage({
				key: 'trolley',
				data: trolley,
				success: () => {
					if (goods[index].selected) {
						this.statistics(total => {
							this.setData({
								goods: goods,
								total: total
							})
						})
					}
					else {
						this.setData({
							goods: goods
						})
					}
				}
			})
		}
		

	},
	handleCountAdd(e) {
		var index = e.currentTarget.dataset.index,
			goods = this.data.goods,
			gid = goods[index].id,
			trolley = wx.getStorageSync('trolley')

		goods[index].count += 1
		trolley.list[gid] += 1
		wx.setStorage({
			key: 'trolley',
			data: trolley,
			success: () => {
				if (goods[index].selected) {
					this.statistics(total => {
						this.setData({
							goods: goods,
							total: total
						})
					})
				}
				else {
					this.setData({
						goods: goods
					})
				}
			}
		})

	},
	goShopGood(){
		console.log(123)
		wx.switchTab({
			url: '/pages/shop/index',
			complete:res=>{
				console.log(res)
			}
		})
	},
	statistics(cb){
		var goods= this.data.goods,
			info = {price:0,count:0,freight:0}
		for(var i = 0;i<goods.length;i++){
			
			if (!goods[i].selected) {
				continue
			}

			info.price += parseFloat((goods[i].retail_price * goods[i].count).toFixed(2))
			info.count += 1

			//if(goods[i].freight_count>1){

				info.freight += goods[i].freight * Math.floor(goods[i].count / (goods[i].freight_count||1))
			// }
			// else{
			// 	info.freight += goods[i].freight * goods[i].count
			// }

		}
		info.price = parseFloat(info.price.toFixed(2))
		info.freight = parseFloat(info.freight.toFixed(2))
		
		cb && cb(info)
	},
	handleSelectAll(){
		var isAll = this.data.total.count > 0 && this.data.total.count == this.data.goods.length
		var	goods = this.data.goods

		for (var i = 0; i < goods.length; i++) {
			goods[i].selected = !isAll
		}

		this.statistics(total => {
			this.setData({
				goods:goods,
				total: total
			})
		})
	},
	handlePay(){
		var trolley = wx.getStorageSync('trolley'),list=[]

		for(var i = 0;i<this.data.goods.length;i++){
			if(this.data.goods[i].selected){
				list.push(this.data.goods[i].id)
			}
		}
		console.log(list)
		wx.setStorage({
			key: 'unpaylist',
			data: list,
		})

		wx.navigateTo({
			url: '/pages/shop/pay',
		})
	}
})