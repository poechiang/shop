// pages/user/order/detail.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		order:null,
		statusHeight: app.systemInfo.tabBarHeight,
		statusBottom: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
		wx.checkSession({
			fail: function (res) {
				wx.login()
			},
		})
		options = options || {}
		
		this.loadData(options)

	},

	loadData(options) {
		options = options || {}
		if (!options.id) {
			app.ui.modal('无效的订单标识',{cancel:false})
			return
		}

		app.http.request({
			url: 'cst/shop/get_order',
			param: { id: options.id },
			done: rlt => {
				this.setData({
					order: rlt.data
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
	handlePay() {
		app.http.request({
			url: 'cst/shop/pay_order',
			param: { id: this.data.order.id },
			done: rlt => {
				if (rlt.status == 1) {
					wx.requestPayment({
						timeStamp: rlt.data.timeStamp,
						nonceStr: rlt.data.nonceStr,
						package: rlt.data.package,
						signType: rlt.data.signType,
						paySign: rlt.data.paySign,
						success: res =>{
							app.ui.modal('支付成功', {cancel: false})
							this.loadData({id:this.data.order.id})
						}
					})
				}
				else {
					app.ui.modal(rlt.msg, { cancel: false })
				}
			}
		})
	},
	handlePhoneCall:function(){
		wx.makePhoneCall({
			phoneNumber: this.order.rphone,
		})
	}
})