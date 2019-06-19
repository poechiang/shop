/**
 *  通信适配
 * 
 * 		在业务逻辑层封装 与 服务器（微信/开发者）的数据通信和登录状态维护
 * 
 * 		2017.11.9
 */

const svr_list = {
	local: 'http://shi-api.localhost.com/ifthin',
	remote: 'https://api.shibu365.com/ifthin',
	res: 'https://api.shibu365.com'
}

const domain = path => {
	return [svr_list[getApp().env], path].join('/')
}
const res = path=>{
	return [svr_list.res, path].join('/')
}

var logining = false,
	waitings = []
const doLogin = function (options) {

  if (logining) {
    waitings.push(options)
    return
  }



	console.log('登录流程:开始')
	wx.getSetting({
		success: function (res) {
			if (res.authSetting['scope.userInfo']) {
				console.log('登录流程:用户已授权，自动登录')

				options = Object.extend({
					url: 'User/login',
					param: null,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					dataType: 'json'
				}, options || {})
				wx.login({
					success: res => {
						console.log('微信服务器重新登录成功')
						wx.request({
							url: domain(options.url),
							data: Object.extend({ code: res.code }, options.param || {}),//{ wx_param: JSON.stringify({ code: res.code }) },
							method: options.method,
							header: options.header,
							dataType: options.dataType,
							complete: resp => {
								if (resp.statusCode == 200 && resp.data) {
									var rlt = resp.data

									if (rlt.status == 1) {
										wx.setStorageSync('session', rlt.data.session)
										wx.setStorageSync('userInfo', { user: rlt.data.user, expire: rlt.data.session.expire })
									}

									logining = false

									options.success && options.success(rlt.data.user,rlt.data.session)

                  waitings.map(item => {
                    requestUrl(item)
                  })
                  waitings = []
								}
								else {
									options.fail && options.fail(resp)
								}
								options.complete && options.complete(resp)
							}
						})
					},
					fail: res => {
						options.fail && options.fail(res)
					},
					complete: res => {
						options.complete && options.complete(res)
					}
				})
			}
			else {
				console.log('登录流程:用户未授权，需要用户手动触发登录流程后重新开始！')
				wx.switchTab({
					url: '/pages/user/index',
				})
			}
		}
	})
}

var doCheckLogin = function (cb) {
	
	var t = wx.getStorageSync('wxSessionCheck')
	var session = wx.getStorageSync('session')
	if ((new Date).time() > t) {
		wx.checkSession({
			success: () => {
				console.log('检查微信登录状态：有效')
				if (!session || (new Date).time() > session.expire) {
					console.log('本地session缓存无效，重新登录')
					getApp().getUserInfo(info=>{
						doLogin({
							url: 'user/login',
							param:info,
							success: cb
						})
					})
					
					
				}
				else {
					cb && cb()
				}
			},
			fail: () => {
				getApp().getUserInfo(info => {
					doLogin({
						url: 'user/login',
						param: info,
						success: cb
					})
				})
			},
			complete: () => {
				wx.setStorage({
					key: 'wxSessionCheck',
					data: (new Date).time() + 3600
				})
			}
		})
	}
	else {
		if (!session || (new Date).time() > session.expire) {
			console.log('本地session缓存无效，重新登录')
			getApp().getUserInfo(info => {
				doLogin({
					url: 'user/login',
					param: info,
					success: cb
				})
			})
		}
		else {
			cb && cb()
		}
	}
	//cb()
}

var requestUrl = function (options) {
	options = options || {}
	options.param = options.data || options.param || {}
	options.method = options.method || 'POST'

	options.header = options.header || {}
	options.header['X-Requested-With'] = 'XMLHttpRequest';
	delete (options.header['Referer'])
	var session = wx.getStorageSync('session')
	if (session && session.id && (new Date).time() < session.expire) {
		options.header.Cookie = 'PHPSESSID=' + session.id
	}
	var done = options.success||options.done
	if (options.check){
		doCheckLogin(() => {
			wx.request({
				url: domain(options.url),
				data: options.param,
				method: options.method || {},
				header: options.header,
				dataType: options.dataType || 'json',
				complete: function (resp) {
					if (resp.data) {
						done && done(resp.data)
					}
					else {
						wx.showModal({
							content: resp.errMsg,
							showCancel: false,
						})
					}
				}
			})
		})
		
	}
	else{
		wx.request({
			url: domain(options.url),
			data: options.param,//{ wx_param: JSON.stringify(options.param || {}) },
			method: options.method || {},
			header: options.header,
			dataType: options.dataType || 'json',
			complete: function (resp) {

				switch (resp.statusCode) {
					case 202://未登录
						wx.getSetting({
							success: function(res) {
								if(res.authSetting['scope.userInfo']){
									getApp().getUserInfo(info => {
										doLogin({
											url: 'user/login',
											param: info,
											success:  (user,session)=>{
												options.header.Cookie = 'PHPSESSID=' + session.id//重新登录后要更新会话标识
												wx.request({
													url: domain(options.url),
													data: options.param,//{ wx_param: JSON.stringify(options.param || {}) },
													method: options.method || {},
													header: options.header,
													dataType: options.dataType || 'json',
													complete: function (resp) {
														if(resp.statusCode==200){
															done && done(resp.data || {})

															logining = false

                              waitings.map(item => {
                                requestUrl(item)
                              })
                              waitings = []
														}
														else{
															options.fail && options.fail(resp.statusCode)
															console.log(resp.errMsg)
														}
													}
												})
												
											}
										})
									})
								}
								else{
                  waitings.push(options)
									wx.switchTab({
										url: '/pages/user/index?check=true',
									})
								}
							},
              fail: function (res) {
                waitings.push(options)
								wx.switchTab({
									url: '/pages/user/index?check=true',
								})
							},
						})
						
						break
					case 200:

						done && done(resp.data||{})

						logining = false

            waitings.map(item => {
              requestUrl(item)
            })
            waitings = []
						break
					default:
						options.fail && options.fail(resp.statusCode)
						console.log(resp.errMsg)
				}
			}
		})
	}
	

}

var loadingState = {}
const clacDeg = plan => {
	return parseInt(plan.days * 270 / plan.total_days)
}
const clacThumb = plan => {
	return parseInt(clacDeg(plan) / 90) + 1
}

module.exports = {
  clearWaiting : function () {
    waitings.map(item => {
      requestUrl(item)
    })
    waitings = []
  },
	request:requestUrl,
    /**
     * 上传文件到服务器
     */
	uploadFile: function (options, cb) {
		var that = this
		cb = cb ||options.success
		var session = wx.getStorageSync('session'),
			param = {}
		var upUrl = options.url || res('res/index/upload_res')
		param.field = options.name || 'pic'
		param.path = options.path || ''
		if (options.file) {  // 单文件上传
			param.file = options.file
			wx.uploadFile({
				url: upUrl,
				filePath: options.file,
				name: options.name || 'pic',
				header: {
					'content-type': 'multipart/form-data',
					'Cookie': 'PHPSESSID=' + session.id,
					'X-Requested-With': 'XMLHttpRequest'
				}, // 设置请求的 header
				formData: param, // HTTP 请求中其他额外的 form data
				complete: function (res) {
					if (res.statusCode == 200 && !res.data.result_code) {
						cb && cb(JSON.parse(res.data))
					} else {
						cb && cb({ status: 0, msg: res.errMsg })
					}
				}
			})
		}
		else if (options.files && options.files.length > 0) {
			// 文件批量上传（单线程依次上传）
			Promise.all(options.files.map((file) => {
				return new Promise((resolve, reject) => {
					param.file = file
					wx.uploadFile({
						url: upUrl,
						filePath: file,
						name: options.name || 'pic',
						header: {
							'content-type': 'multipart/form-data',
							'Cookie': 'PHPSESSID=' + session.id,
							'X-Requested-With': 'XMLHttpRequest'
						}, // 设置请求的 header
						formData: param, // HTTP 请求中其他额外的 form data
						complete: function (res) {
							if (res.statusCode == 200 && !res.data.result_code) {
								cb && cb(JSON.parse(res.data))
							} else {
								cb && cb({ status: 0, msg: res.errMsg })
							}
						}
					})
				})
			}))
		}

	},


	checkLogin: doCheckLogin,
	login: doLogin,


	/**
	 * 请求用户计划
	 */
	loadMyPlanInfo(page,cb){
		if (loadingState.plan) return
		loadingState.plan = true
		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}
		this.request({
			url: 'user/info',
			success: rlt => {
				if (rlt.status == -10) {
					// 新用户未加入
					wx.redirectTo({
						url: '/pages/index/join7',
					})
				}
				else if (rlt.status == 1) {

					var plan = rlt.data.ifplan
					
					page && page.setData({
						plan: plan,
						deg: clacDeg(plan),
						thumb: clacThumb(plan),
					})
					wx.setStorage({
						key: 'ifthin_plan',
						data: plan,
					})
					wx.setStorage({
						key: 'ifthin_fav_essay_list',
						data: rlt.data.fav_essay_list,
					})
					wx.setStorage({
						key: 'ifthin_col_essay_list',
						data: rlt.data.col_essay_list,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}

        loadingState.plan = false
        cb && cb(rlt)
			}
		})
	},
	/**
	 * 请求用户徽章列表
	 */

	loadHzhList(uid,cb) {
		if (loadingState.hzh) return
		loadingState.hzh = true

		var app = getApp()
		if (typeof uid == 'function') {
			cb = uid
			uid = null
		}
		this.request({
			url: 'user/hzh_list',
      data:{uid:uid},
			success: rlt => {
				if (rlt.status == 1) {

          cb && cb(rlt)
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.hzh = false
			}
		})
	},
	loadMyStatisInfo(page,cb) {
		
		if (loadingState.statis) return
		loadingState.statis = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}

		this.request({
			url: 'user/statistics',
			success: rlt => {
				
				if (rlt.status == 1) {
					page && page.setData({
						statis: rlt.data || 0
					})

					wx.setStorage({
						key: 'ifthin_statis',
						data: rlt.data,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.statis = false
				cb && cb(rlt)
			}
		})
	},

	/**
	 * 请求当月打卡统计
	 */
	loadMonthTask(page,cb){

		if (loadingState.month) return
		loadingState.month = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}

		this.request({
			url: 'task/month_task',
			success: rlt => {

				if (rlt.status == 1) {
					page && page.setData({
						month: rlt.data || []
					})

					wx.setStorage({
						key: 'ifthin_month',
						data: rlt.data,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.month = false
				cb && cb(rlt)
			}
		})
	},
	loadTodayTask(page,cb){

		if (loadingState.today) return
		loadingState.today = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}

		this.request({
			url: 'task/today_task',
			success: rlt => {

				if (rlt.status == 1) {
					page && page.setData({
						today: rlt.data || null
					})

					wx.setStorage({
						key: 'ifthin_today',
						data: rlt.data||null,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.today = false
				cb && cb(rlt)
			}
		})
	},
	loadMyVideo(page, cb) {
		if (loadingState.chx) return
		loadingState.chx = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}

		this.request({
			url: 'user/my_video',
			success: rlt => {

				if (rlt.status == 1) {
					page && page.setData({
						myVideo: rlt.data || []
					})

					wx.setStorage({
						key: 'ifthin_my_video',
						data: rlt.data,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.chx = false
				cb && cb(rlt)
			}
		})
	},
	loadManuals(page, cb) {

		if (loadingState.manual) return
		loadingState.manual = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}
		this.request({
			url: 'user/my_manuals',
			success: rlt => {

				if (rlt.status == 1) {
					page && page.setData({
						myVideo: rlt.data || []
					})

					wx.setStorage({
						key: 'ifthin_manuals',
						data: rlt.data,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.manual = false
				cb && cb(rlt)
			}
		})
	},
	loadTodayTaskManual(page, cb) {

		if (loadingState.today_manual) return
		loadingState.today_manual = true

		var app = getApp()
		if (typeof page == 'function') {
			cb = page
			page = app.pages.current()
		}
		this.request({
			url: 'user/my_today_manual',
			success: rlt => {

				if (rlt.status == 1) {
					page && page.setData({
						todayManual: rlt.data || []
					})

					wx.setStorage({
						key: 'ifthin_today_manual',
						data: rlt.data,
					})
				}
				else {
					app.con.error(rlt.msg)
					//app.ui.modal(rlt.msg)
				}
				loadingState.today_manual = false
				cb && cb(rlt)
			}
		})
	}

}