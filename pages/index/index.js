//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		// motto: 'Hello World',
		// userInfo: {},
		// hasUserInfo: false,
		// canIUse: wx.canIUse('button.open-type.getUserInfo')
		user:null,
		hzhlist:[],
		msgCount:0,
		hdCount:0,
	},
	onLoad: function () {
		
		this.loadUserInfo();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 隐藏导航栏
		wx.hideTabBar({
			aniamtion: true,
		})

		this.loadUserInfo();
	},
	loadUserInfo(){
		if(this.userLoading) return
		this.userLoading = true
		app.http.request({
			url:'user/info',
			success:rlt=>{
				if(rlt.status==-10){
					// 新用户未加入
					wx.redirectTo({
						url: '/pages/index/join',
					})
				}
				else if(rlt.status==1){
					this.setData({
						user:rlt.data
					})
				}
				else{
					app.con.error(rlt.msg)
					app.ui.modal(rlt.msg)
				}
				this.userLoading = false
			},
		})
	},
	loadHzh() {
		if(this.hzhLoading)return
		this.hzhLoading = true
		app.http.request({
			url: 'ifthin/user/info',
			success: rlt => {
				if (rlt.status == -10) {
					// 新用户未加入
					wx.navigateTo({
						url: '/pages/index/join',
					})
				}
				else if (rlt.status == 1) {
					this.setData({
						user: rlt.data
					})
				}
				else {
					app.con.error(rlt.msg)
					app.ui.modal(rlt.msg)
				}
				this.hzhLoading = false
			}
		})
	 },
	loadNewMsgCount() { 

		if (this.msgLoading) return
		this.msgLoading = true
		app.http.request({
			url: 'ifthin/user/info',
			success: rlt => {
				if (rlt.status == -10) {
					// 新用户未加入
					wx.navigateTo({
						url: '/pages/index/join',
					})
				}
				else if (rlt.status == 1) {
					this.setData({
						user: rlt.data
					})
				}
				else {
					app.con.error(rlt.msg)
					app.ui.modal(rlt.msg)
				}
				this.msgLoading = false
			}
		})
	},
	loadNewHotHdCount() { 

		if (this.hdLoading) return
		this.hdLoading = true
		app.http.request({
			url: 'ifthin/user/info',
			success: rlt => {
				if (rlt.status == -10) {
					// 新用户未加入
					wx.navigateTo({
						url: '/pages/index/join',
					})
				}
				else if (rlt.status == 1) {
					this.setData({
						user: rlt.data
					})
				}
				else {
					app.con.error(rlt.msg)
					app.ui.modal(rlt.msg)
				}
				this.hdLoading = false
			}
		})
	},
	
})
