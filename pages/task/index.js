// pages/task/index.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs:["任务","知识库"],
		currTabIndex:0,
		sectionDesc: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
		plan: wx.getStorageSync('ifthin_plan') || null,
		month: wx.getStorageSync('ifthin_month') || [],
		today: wx.getStorageSync('ifthin_today') || {},
		getHzh:false,// 是否得到了徽章
		jdbacks:[
			'https://res.shibu365.com/i/2019-05-31/28df56cebda44bf8943704a5fc3d3e53.png',
			'https://res.shibu365.com/i/2019-05-31/963692d120464f5e9e8269a26e9bf851.png',
			'https://res.shibu365.com/i/2019-05-31/4de03da28f7d419fa69e116c5792d729.png',
			'https://res.shibu365.com/i/2019-05-31/6c6291bbc0f7414392c7249dd53bbc4d.png',
		],
		jd1:false,
		jd2:false
	},
	onLoad: function () {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 隐藏导航栏
		wx.hideTabBar({
			aniamtion: true,
		})
    this.setData({
      hour: Date.hour()
    })
		app.http.loadMyPlanInfo(this,rlt=>{
			if (rlt.status == 1) {
				app.http.loadMonthTask(this)
				app.http.loadTodayTask(this)
			}
		})
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
			currTabIndex: e.detail.index,
		})
	},
})