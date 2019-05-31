// pages/index/join.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		step:1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var cache = wx.getStorage({
			key: 'ifjoin',
			success: res=> {
				this.setData({
					step:res.step
				})
			},
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
	handleNext() {
		this.setData({
			step: this.data.step + 1
		})
	},
	handleJoin() {
		//app.ui.modal("后续功能等完善")

				wx.switchTab({
					url: '/pages/index/index',
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
		
	}
})