// pages/user/welcome.js

const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		greeting:'',
		scene: null,
		verifDisabled: true,
		submitDisabled: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
		if (options.scene) {
			var scenes = decodeURIComponent(options.scene).split('&'),scene
			for (var i = 0; i < scenes.length; i++) {
				var items = scenes[i].split('=')
				if (items.length == 2) {
					var key = items[0]
					var value = items[1]
					scene[key] = value
				}
				else if (items.length == 1) {
					scene[scenes[i]] = true
				}
			}
			
		}
		
		var h = (new Date).getHours(), greeting
		if (h < 6) {
			greeting = '凌晨好'
		} else if (h < 10) {
			greeting = '早上好'
		} else if (h < 12) {
			greeting = '上午好'
		} else if (h < 14) {
			greeting = '中午好'
		} else if (h < 18) {
			greeting = '下午好'
		} else {
			greeting = '晚上好'
		}
		
		this.setData({
			scene: scene||{},
			greeting: greeting||''
		})
		
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	handlePhoneInput(e) {
		var phone = e.detail.value

		this.setData({
			phone: phone,
			verifDisabled: !/^1\d{10}/.test(phone)
		})
	},
	handleCodeInput(e) {
		var code = e.detail.value
		this.setData({
			code: code,
			submitDisabled: !/^\d{6}/.test(code)
		})
	},
	handleGetVerifCode(e){
		if(!/^1\d{10}/.test(this.data.phone)){
			app.ui.error('手机号码无效')
			return
		}
		
		app.http.request({
			url:'cst/user/send_verif_code',
			data:{phone:this.data.phone},
			success:rlt=>{
				
				if(rlt.data.code){
					app.ui.info(rlt.data.code)
					this.setData({
						verif:rlt.data
					})
				}

			}
		})
	},
	handleSubmit(res){
		if(this.data.verif.expire<=(new Date).time()){
			app.ui.modal('验证码已过期')
			return
		}
		else if(this.data.verif !== this.data.code){
			app.ui.modal('验证码无效，请核对')
			return
		}

		app.data.userInfo = {
			nick: res.detail.userInfo.nickName,
			photo: res.detail.userInfo.avatarUrl,
			gender: res.detail.userInfo.gender
		}
		this.setData({ user: app.data.userInfo })
		app.http.login({
			url: 'cst/user/login',
			param: { nick: app.data.userInfo.nick, photo: app.data.userInfo.photo,rid:this.scene.rid },
			success: user => {
				wx.switchTab({
					url: '/pages/user/index',
				})
			},
			fail: res => {
				console.error(res);
			}
		})
	}
})