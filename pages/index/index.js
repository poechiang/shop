//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		// motto: 'Hello World',
		// userInfo: {},
		// hasUserInfo: false,
		// canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad: function () {
		
		
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 隐藏导航栏
		wx.hideTabBar({
			aniamtion: true,
		})
	},
})
