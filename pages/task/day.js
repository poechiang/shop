// pages/task/day.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type:'',
		plan: wx.getStorageSync('ifthin_plan') || {},
		manuals:wx.getStorageSync('ifthin_manuals')||[],
		myVideo:wx.getStorageSync('ifthin_my_video')||'',
		todayManual:null,
		currManual:null,
		weightPhoto: wx.getStorageSync('ifthin_weight_photo')||null,
		weight:null,
		completed: false,
		getLm: false,// 是否得到了徽章
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			type:options.t||'weight'
		})

		app.locate({
			success: loc => {
				this.adcode= loc.adcode
				this.city= loc.isMunicipality ? loc.province : loc.city
			}
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var options = this.options

		if (options.t == 'video') {
			app.http.loadMyVideo(this)
		}
		else if (options.t == 'manual') {
			app.http.loadTodayTaskManual(this)
		}
		
		wx.getStorage({
			key: 'ifthin_today_manual',
			success: res=> {
				this.setData({
					todayManual:res.data
				})
			},
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		console.log(123)
		wx.removeStorage({
			key: 'ifthin_weight_photo',
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	handleComplete(){
		app.pages.goBack()

	},
	uploadTaskComplete(){
		var data = { type: this.data.type}
		if(data.type=='weight'){
			data.weight = this.data.weight
			data.img = this.data.weightPhoto
			data.adcode = this.adcode
			data.city = this.city
		}
		app.http.request({
			url: 'task/complete',
			data: data,
			success: rlt => {
				if (rlt.status == 1) {
					if(this.data.type=="weight"){

						app.ui.modal('恭喜任务完成！',{
							confirm:()=>{
								app.pages.goBack()
							}
						})
					}
					else{

						this.setData({
							completed: true
						})

					}

				}
				else {
					app.con.error(rlt.msg)
					app.ui.modal(rlt.msg)
				}
			}
		})
	},
	handleChooseImg(e){
		wx.chooseImage({
			count: 1,
			success: res=> {
				var path = res.tempFilePaths[0]

				app.http.uploadFile({
					file:path,
					name: 'img',
					success: rlt => {
						this.setData({
							weightPhoto: rlt.data.url,
						})

						wx.setStorage({
							key: 'ifthin_weight_photo',
							data: rlt.data.url,
						})
					}

				})




			},
			fail: function(res) {
				console.log(res)
			},
		})
	},
	handleWeightInput(e){
		this.setData({
			weight:e.detail.value
		})
	}
})