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
	res:'https://api.shibu365.com'
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
										item()
									})
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
																item()
															})
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
									wx.switchTab({
										url: '/pages/user/index',
									})
								}
							},
							fail: function(res) {
								wx.switchTab({
									url: '/pages/user/index',
								})
							},
						})
						
						break
					case 200:

						done && done(resp.data||{})

						logining = false
						waitings.map(item => {
							item()
						})
						break
					default:
						options.fail && options.fail(resp.statusCode)
						console.log(resp.errMsg)
				}
			}
		})
	}
	

}

module.exports = {
	request(options) {
		options = options || {}
		// 预处理参数
		var param = options.data || options.param || {}

		options.param = param
		requestUrl(options)
	},
    /**
     * 上传文件到服务器
     */
	uploadFile: function (options, cb) {
		var that = this
		cb = cb ||options.success
		var session = wx.getStorageSync('session'),
			param = {}
		var upUrl = options.url || res('res/resource/upload')
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
	login: doLogin

}