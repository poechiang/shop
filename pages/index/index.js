//index.js
//获取应用实例
const app = getApp()
const clacDeg = plan => {
	return parseInt(plan.days * 270 / plan.total_days)
}
const clacThumb = plan => {
	return parseInt(clacDeg(plan) / 90) + 1
}
Page({
	data: {
		plan: wx.getStorageSync('ifthin_plan') || null,
		hzhList: wx.getStorageSync('ifthin_hzhlist') || [],
		statis: wx.getStorageSync('ifthin_statis') || {},
	},
	onLoad: function () { },
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 隐藏导航栏
		wx.hideTabBar({
			aniamtion: true,
		})

		//this.loadUserInfo();
		app.http.loadMyPlanInfo(this,rlt=>{
			if (rlt.status == 1) {

				//如果用户已加入则请求用户获得的徽章列表及消息活动的统计信息
				app.http.loadHzhList(rlt=>{
            this.setData({
              hzhList: rlt.data || []
            })

            wx.setStorage({
              key: 'ifthin_hzhlist',
              data: rlt.data,
            })
        })
				app.http.loadMyStatisInfo(this)

			}
		})



		if(this.data.plan){

			this.setData({
				deg: clacDeg(this.data.plan),
				thumb: clacThumb(this.data.plan),
			})

		}
	},
	
})
