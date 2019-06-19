// pages/user/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: {
			photo: 'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
			nick:''
    },
    sectionDesc: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
		userInfo:{},
		logining: false, 
		navBarVisible:true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 登录
		// var user = app.getLoginUser()
		// if(user){
    //   this.setData({ user: user })
      
    //   app.http.loadMyPlanInfo(this)
		// }
		// else{
		// 	app.getUserInfo({
		// 		success: info => {
    //       this.setData({ user: info })
          app.http.loadMyPlanInfo(rlt=>{
            this.setData({
              user:rlt.data,
              plan:rlt.data.ifplan
            })

          })
		// 		}
		// 	})

		// }
		

    
		
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
	// onShareAppMessage: function () {

	// },
	handleGetUserInfo(res){
		app.data.userInfo = {
			nick: res.detail.userInfo.nickName,
			photo: res.detail.userInfo.avatarUrl,
			gender: res.detail.userInfo.gender
		}
		this.setData({user:app.data.userInfo})
		app.http.login({
			url:'user/login',
			param: { nick: app.data.userInfo.nick,photo:app.data.userInfo.photo },
			success:user=>{
				this.setData({ user: user })
        if(this.options.check){
          app.http.clearWaiting()
        }
			},
			fail:res=>{
				console.error(res);
			}
		})
	},
	handleTip1(){
		app.ui.modal('会员体系功能完善中，请稍后')
	},
	exit(){
		app.data.userInfo = null
		this.setData({
			user: {
				photo: 'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
				nick: ''
			}
		})
		wx.removeStorage({
			key: 'userInfo',
		})
	}

})