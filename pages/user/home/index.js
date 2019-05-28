// pages/user/home/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ready:false,
		tabs: ['乡圈', '动态', '收藏'],
		tabIndex:0,
		user:null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		options = options||{}
		this.loadData(options)
	},

	loadData:function(options){

		options = options || {}
		if(!options.id){
			app.ui.modal('无效的用户标识',{
				cancel:false
			})
		}
		app.http.request({
			url:'user/get_home_data',
			param:{uid:options.id},
			done:(rlt)=>{
				this.setData({
					ready:true,
					user:rlt.data,
				})
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

	},

	handleTabChange(e) {
		this.setData({
			tabIndex: e.detail.index,
			bottomLoading: {
				height: 41,
				opacity: 1
			},
			articles: [],
			page: {
				ended: false,
				empty: false
			}
		})
		// this.loadData({
		// 	page: 1,
		// 	complete: () => {
		// 		this.setData({
		// 			bottomLoading: {
		// 				height: 0,
		// 				opacity: 0
		// 			}
		// 		})
		// 	}
		// })

		
	},


	/**
	 * 关注用户
	 */
	attach(e) {
		app.http.request({
			url: 'user/attach',
			data: { uid: this.data.user.id },
			success: rlt => {
				let user = this.data.user
				user.relationship = rlt.data.rs
				this.setData({
					user: user
				})
			}
		})
	},
	/**
	 * 取消关注用户
	 */
	cancelAttach(e) {
		app.ui.modal('你要取消对' + (this.data.user.nick || '匿名用户') + '的关注吗？', {
			cancel:true,
			confirm: {
				text: '是',
				callback: () => {
					app.http.request({
						url: 'user/cancel_attach',
						data: { uid: this.data.user.id },
						success: rlt => {
							let user = this.data.user
							user.relationship = rlt.data.rs
							this.setData({
								user: user
							})
						}
					})
				}
			}
		})

	},
	/**
	 * 显示更多操作
	 */
	showUserMoreActions(e) {
		app.ui.sheets({
			'举报': () => {

				wx.setStorage({
					key: 'jubao-data',
					data: this.data.user
				})
				wx.navigateTo({
					url: '/pages/user/complain/index?id=' + this.data.user.uid,
				})
			}
		})

	},
	/**
	 * 私信消息
	 */
	handleMsg() {
		wx.navigateTo({
			url: '/pages/user/chat/index?tid=' + this.data.user.id,
		})
	},
})