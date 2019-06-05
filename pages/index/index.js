//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		hzhlist:[],
		msgCount:0,
		hdCount:0,
	},
	onLoad: function () {
		
		//this.loadUserInfo();

		wx.getStorage({
			key: 'ifthin_home_data',
			success: res=>{
				this.setData(res.data)
			}
		})
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

					var user = rlt.data,
						plan = user.ifplan,
						start = plan.start,
						end = plan.end,
						startW = plan.start_weight,
						endW = plan.target_weight,
						currW = plan.current_weight,
						state = plan.state,
						score=0,
						progress=0,
						now=(new Date).time(),
						thumb=1,
						days=0,
						percent=0;

					if(state>=0){
						score = startW - currW 
						percent = parseInt(score * 100 / (startW - endW))
						progress = parseInt((now - start) * 270 / (end - start))
						days = Math.ceil((now - start) / (3600 * 24))
						thumb = parseInt(progress / 90)+1
					}
					
					this.setData({
						user:user,
						plan:plan,
						score: score,
						percent: percent,
						progress:progress,
						thumb:thumb,
						days:days,
					})
					wx.setStorage({
						key: 'ifthin_home_data',
						data: this.data,
					})
					//如果用户已加入则请求用户获得的徽章列表及消息活动的统计信息

					this.loadHzh()
					this.loadNewHotHdCount()
					this.loadNewMsgCount()

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
			url: 'user/hzh_list',
			success: rlt => {
				if (rlt.status == 1) {
					this.setData({
						hzhlist:rlt.data||[]
					})

					wx.setStorage({
						key: 'ifthin_home_data',
						data: this.data,
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
			url: 'user/new_msg_count',
			success: rlt => {
				if (rlt.status == 1) {
					this.setData({
						msgCount: rlt.data||0
					})

					wx.setStorage({
						key: 'ifthin_home_data',
						data: this.data,
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
			url: 'user/new_hd_count',
			success: rlt => {
				if (rlt.status == 1) {
					this.setData({
						hdCount: rlt.data||0
					})

					wx.setStorage({
						key: 'ifthin_home_data',
						data: this.data,
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
