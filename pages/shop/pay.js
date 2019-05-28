// pages/shop/pay.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name:'',
		phone:'',
		region: [],
		addr:'',
		goods:[],
		total:{},
		statusHeight: app.systemInfo.tabBarHeight,
		statusBottom: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		wx.checkSession({
			fail: function(res) {
				wx.login()
			},
		})
		
		options.complete = (rlt)=>{
			console.log(rlt)
			this.statistics(total => {
				this.setData({
					total: total
				})
			})
		}
		this.loadData(options)

	},

	loadData(options){
		options = options||{}
		
		if (options.t == 'open') { // 开团
			app.http.request({
				url: 'shop/get_group',
				param: { id: options.gid },
				done: rlt => {
					var good = rlt.data.meta.good
					good.retail_price = options.price
					good.count = 1
					this.setData({
						mode: 'open-group',
						group:rlt.data,
						goods: [rlt.data.meta.good],
						pricerid: options.pid
					})

					options.complete && options.complete(rlt)
				}
			})
		}
		else if (options.t == 'join') { // 参团
			app.http.request({
				url: 'shop/get_tuan',
				param: { id: options.gid },
				done: rlt => {
					var good = rlt.data.meta.good
					good.retail_price = options.price
					good.count = 1
					this.setData({
						mode: 'join-group',
						goods: [rlt.data.meta.good],
						groupInst: rlt.data,
					})

					options.complete && options.complete(rlt)
				}
			})
		}
		else if (options.id) { // 直接购买
			app.http.request({
				url: 'good/get_detail',
				param: { id: options.id },
				done: rlt => {
					var good = rlt.data
					good.count = 1
					this.setData({
						mode: 'buy',
						goods: [rlt.data]
					})

					options.complete && options.complete(rlt)
				}
			})
		}
		else {
			
			var list={},ids=[],
				trolley = wx.getStorageSync('trolley'),
				unpay = wx.getStorageSync('unpaylist')

			for (var x in trolley.list) {
				if (unpay.indexOf(parseInt(x)) >= 0) {
					list[x] = trolley.list[x]
					ids.push(x)
				}
			}


			app.http.request({
				url: 'shop/all_goods',
				param: {id:ids},
				done: rlt => {
					for(var x in rlt.data){
						rlt.data[x].count=list[rlt.data[x].id]
					}
					this.setData({
						mode: 'trolley',
						goods: rlt.data
					})

					options.complete && options.complete(rlt)
				}
			})
		}


		
			
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
	handleRegionSelect(e){
		this.setData({
			region:e.detail.value
		})
	},
	getAddr(){
		wx.chooseAddress({
			success: res => {
				this.setData({
					name:res.userName,
					phone:res.telNumber,
					addr:res.detailInfo,
					region:[res.provinceName,res.cityName,res.countyName]
				})
			},
		})
	},
	getPhoneNumber(e) {
		var detail = e.detail
		wx.login({
			success: res => {
				app.http.request({
					url: 'open/wxsvr/decrypt',
					param: {
						data: detail.encryptedData,
						iv: detail.iv,
						code: res.code
					},
					done: rlt => {
						if(rlt.status==1){
							this.setData({
								phone: rlt.data.phoneNumber
							})
						}
						else{
							app.ui.modal(rlt.msg,{
								cancel:false
							})
						}
					}
				})
			},
		})
		
	},
	chooseLocation(){
		wx.chooseLocation({
			success: res => {
				var addr = res.address
				app.regeo({
					long: res.longitude,
					lat: res.latitude,
					success:res=>{
						var region = [res.province, res.city.length <= 0 ? res.province : res.city, res.district]
						this.setData({
							region : region,
							addr: addr.replace(region.join(''),'')
						})
					}
				})
			},
		})
	},
	handleCountSub(e) {
		var index = e.currentTarget.dataset.index,
			goods = this.data.goods

		if (goods[index].count > 1) {
			goods[index].count -= 1
			this.statistics(total => {
				this.setData({
					goods: goods,
					total: total
				})
			})
		}
	},
	handleCountChange(e) {
		var index = e.currentTarget.dataset.index,
			count = parseInt(e.detail.value)||1,
			goods = this.data.goods

		count = Math.max(count,1)
		
		goods[index].count = count
		this.statistics(total => {
			this.setData({
				goods: goods,
				total: total
			})
		})
			


	},
	togglePricerId(e){
		var group = this.data.group,
			good = this.data.goods[0],
			pid = e.currentTarget.dataset.id,
			price

		for(var x in group.pricers){
			if(pid == group.pricers[x].id){
				price = group.pricers[x].price
			}
		}

		good.retail_price = price
		this.statistics(total => {
			this.setData({
				pricerid: pid,
				goods: [good],
				total: total
			})
		})
	},
	handleCountAdd(e) {
		var index = e.currentTarget.dataset.index,
			goods = this.data.goods

		goods[index].count += 1
		
		
		this.statistics(total => {
			this.setData({
				goods: goods,
				total: total
			})
		})
					

	},
	statistics(cb) {
		var goods = this.data.goods,
			info = { price: 0, count: 0, freight: 0 }
		for (var i = 0; i < goods.length; i++) {
			info.price += goods[i].retail_price * goods[i].count
			info.count += 1

			info.freight += goods[i].freight * goods[i].count / (goods[i].freight_count || 1)
		}

		info.price = parseFloat(info.price.toFixed(2))
		info.freight = parseFloat(info.freight.toFixed(2))
		
		cb && cb(info)
	},
	handlePay(){
		
		// 统计购买产品及价格
		var list = [],data

		for(var x in this.data.goods){
			list.push({
				id: this.data.goods[x].id,
				count: this.data.goods[x].count,
				price: this.data.goods[x].retail_price
			})
		}

		data={
			consignee: {
				name: this.data.name,
				phone: this.data.phone,
				region: this.data.region,
				addr: this.data.addr
			},
			goods: list,
			msg: this.data.msg,
			mode: this.data.mode,
		}





		app.http.request({
			url:'shop/add_order',
			param:data,
			done:rlt=>{
				if(rlt.status==1){

					if(this.data.mode=='trolley'){

						var trolley = wx.getStorageSync('trolley'),
							unpay = wx.getStorageSync('unpaylist'), list = {},total=0

						for (var x in trolley.list) {
							if (unpay.indexOf(parseInt(x)) < 0) {
								list[x] = trolley.list[x]
								total++
							}
						}

						wx.setStorage({
							key: 'trolley',
							data: total>0?{list:list,total:total}:null
						})

						wx.setStorage({
							key: 'unpaylist',
							data: null
						})
					}

					app.ui.modal('下单成功，订单号为\r\n'+rlt.data.sn,{
						cancel:{
							text:'稍后',
							callback:()=>{
								app.pages.goBack(-1)
							}
						},
						confirm:{
							text:'立即支付',
							callback:()=>{

								app.http.request({
									url:'shop/pay_order',
									param:{id:rlt.data.id},
									done:rlt=>{
										if(rlt.status==1){
											wx.requestPayment({
												timeStamp: rlt.data.timeStamp,
												nonceStr: rlt.data.nonceStr,
												package: rlt.data.package,
												signType: rlt.data.signType,
												paySign: rlt.data.paySign,
												success: function (res) { 
													// 如果当前为团购，跳转至支付结果页面，提示支付成功，并显示开团信息
													if (data.mode == 'open-group'||data.mode == 'join-group'){
														wx.navigateTo({
															url: '/pages/shop/payrlt?id=' + rlt.data.id,
														})
													}
													else{
														app.ui.modal('支付成功', { 
															cancel: false,
															confirm:()=>{																
																app.pages.goBack(-1)
															}
														})
													}
												},
												fail: function (res) {
													var msg = res.errMsg 
													if (msg == 'requestPayment:fail cancel'){
														msg="支付已取消，请稍后到个人中心订单管理中完成支付操作！"
													}
													app.ui.modal(msg, { 
														cancel: false,
														confirm: () => {
															app.pages.goBack(-1)
														}
													})
												},
											})
										}
										else{
											app.ui.modal(rlt.msg, {
												cancel: false,
												confirm: () => {
													app.pages.goBack(-1)
												}
											})
										}
									}
								})
							}
						}
					})
				}
				else{
					app.ui.modal(rlt.msg,{cancel:false})
				}
			}
		})
	}
})