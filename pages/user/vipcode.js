// pages/user/vipcode.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		vipcode:null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.loadData(options)
	},

	loadData(options){

		app.http.request({
			url: 'user/get_vip_code',
			done: rlt => {
				console.log(rlt)
				if(rlt.status==1){
					this.setData({
						vipcode:rlt.data
					})
				}
				else{
					app.ui.modal(rlt.msg)
				}
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})