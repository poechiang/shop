//app.js
const util=require('utils/util')
const GDKey = '6d055250d6ca7096309edfba326e53a2'
const AMap = require('libs/amap-wx.js')
const cons = require('utils/cons')

App({
	data: { 
		userInfo: null,
		defUserPhoto:'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg'
	},
	systemInfo:null,
	util:util,
	http: require('utils/http'),
	pages: require('utils/pages'), 
	amapwx: new AMap.AMapWX({ key: '6d055250d6ca7096309edfba326e53a2' }),
	//trolley: require('/trolley'),
	wxParse: require('wxParse/wxParse.js'),
	
	logs: require('utils/logs'),
	con: cons,
	ui: require('utils/ui'),
	env:'local',
	onLaunch() {
		this.getSystemInfo()

		

		console.log('小程序启动……')
	},
	onError(msg){
		console.log(msg)
	},
	onPageNotFound(res) {
		console.log(res)
		wx.redirectTo({
			url: 'pages/common/404?path='+res.path
		}) 
	},
	onHide(){
		// 监听小程序切后台时，记录时间戳
		this.hideStamp = Date.time()
		
	},
	onShow(options){
		var stamp = Date.time()
		if(this.hideStamp>0){
			if(true){
				var page = this.pages.current()
				if(page){
					page.loadData && page.loadData(page.options)
				}
			}
		}
		// 隐藏导航栏
		wx.hideTabBar({
			aniamtion: true,
		})
	},
	getSystemInfo(options){
		options = options ||{}
		if(Object.isFunction(options)){
			options = {
				success:options,
			}
		}
		if(options.refresh!==true && this.systemInfo){
			options.success && options.success(this.systemInfo)
			return 
		}

		wx.getSystemInfo({
			success: res => {
				res.navigateBarHeight = 44
				res.tabBarHeight = res.screenHeight - res.windowHeight - res.statusBarHeight - res.navigateBarHeight
				this.systemInfo = res
				
				options.success && options.success(res)
			},
			fail: function (res) {
				console.warn('获取设备信息失败')
				options.fail && options.fail(res)
			}
		})
	},
	getUserInfo: function(options) {
		options = options ||{}
		if(Object.isFunction(options)){
			options = {
				success:options
			}
		}
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					if (this.data.userInfo) {
						options.success && options.success(this.data.userInfo)
					}
					else {
						wx.getUserInfo({
							success: res => {
								this.data.userInfo = {
									nick: res.userInfo.nickName,
									photo: res.userInfo.avatarUrl,
									gender: res.userInfo.gender
								}
								options.success && options.success(this.data.userInfo)
							}
						})
					}
				}
				else {
					options.fail && options.fail()
				}
			}
		})

	},
	getLoginUser:function(){
		var info = wx.getStorageSync('userInfo');
		if(!info || (new Date).time()>info.expire){
			return null
		}
		return info.user
	},
	// checkLoginState(autologin){
	// 	var user = this.getLoginUser()
	// 	return !!user
	// },

	/**
	 * 定位当前城市
	 */
	locate(options) {
		options = options || {}
		if (Object.isFunction(options)) {
			options = {
				success: options
			}
		}
		options = Object.extend({
			type: 'GCJ02',
			altitude: true,
		}, options)
		console.group('正在定位')
		wx.getLocation({
			type: options.type,
			altitude: options.altitude,
			success: res => {
				getApp().con.success('微信定位成功')
				this.amapwx.getRegeo({
					location: res.longitude + ',' + res.latitude,//location的格式为'经度,纬度'
					success: res => {
						if (!res && res.length <= 0) {
							getApp().con.warn('位置解析失败！')
							return
						}
						getApp().con.success('高德解析成功')
						res = res[0].regeocodeData.addressComponent

						res.isMunicipality = ['北京市','天津市','上海市','重庆市'].indexOf(res.province)>=0


						options.success && options.success(res)
					},
					fail: function (res) { 
						getApp().con.error(res)
					}
				})
			},
			fail: function (res) {
				getApp().con.error(res)
			},
			complete: function (res) {
				console.groupEnd()
			 },
		})
	},
	/**
	 * 定位当前城市天气信息
	 */
	weather(options) {
		options = options || {}
		if (Object.isFunction(options)) {
			options = {
				success: options
			}
		}
		console.group('天气查询开始')
		this.amapwx.getWeather({
			success: (data) => {
				getApp().con.success('天气查询成功')
				options.success&&options.success(data)
				console.groupEnd()
				//成功回调
			},
			fail: (res) => {
				//失败回调

				getApp().con.error('天气查询失败')
				options.fail && options.fail(res)
				console.groupEnd()
			}
		})
	},
	regeo(options){
		options = options||{}
		this.amapwx.getRegeo({
			location: options.long + ',' + options.lat,//location的格式为'经度,纬度'
			success: res => {
				if (!res && res.length <= 0) {
					getApp().con.warn('位置解析失败！')
					return
				}
				getApp().con.success('高德解析成功')
				res = res[0].regeocodeData.addressComponent

				res.isMunicipality = ['北京市', '天津市', '上海市', '重庆市'].indexOf(res.province) >= 0


				options.success && options.success(res)
			},
			fail: function (res) {
				getApp().con.error(res)
			}
		})
	}
})