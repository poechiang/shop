// pages/circle/detail.js// pages/circle/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		article: null,
		defUserPhoto: 'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
		msgType: 1,
		statusHeight: app.getSystemInfo.statusBarHeight,
		statusBottom:0,
		replyVisible: false,
		blocks: ['post', 'top'],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 加载数据
		options = options || {}
		this.loadData(options)
	},
	/**
	 * 加载数据
	 */
	loadData(options) {
		options = options || {}
		app.http.request({
			url: 'art/get_detail',
			param: {aid:options.aid||45},
			done: rlt => {
				this.setData({ article: rlt.data.article })
				app.wxParse.wxParse('content', 'html', rlt.data.article.content, this, 5)
				options.complete && options.complete(rlt)
			}
		})
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
	onShareAppMessage: function () {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			var art = this.data.article

			var info = {
				title: art.title || art.brief20,
				path: '/pages/circle/detail?aid=' + art.id
			}
			if (art.pictures.length > 0) {
				info.imageUrl = art.pictures[0]
			}

			app.http.request({
				check: true,
				url: 'art/do_share',
				param: {
					aid: art.id,
				},
			})

			return info
		}
	},
	onPageScroll: function (e) {
		
	},

	handleTopicTap: function (e) {
		app.ui.modal('话题汇总展示功能完善中...')
	},
	handleMsgTypeToggle(e){
		this.setData({
			msgType:e.currentTarget.dataset.key
		})
	},

	handleMsg: function (e) {

		this.setData({
			statusBottom: -this.data.statusHeight,
			replyVisible: true,
		})

	},
	handleReplySend(e) {
		if (e.detail.value) {
			app.http.request({
				check: true,
				url: 'art/do_reply',
				param: {
					aid: this.data.article.id,
					msg: e.detail.value,
				},
				done: rlt => {
					console.log(rlt)
					if (rlt.status == 1) {
						app.ui.success('评论成功')
						// 如果后台直接审核，则自动插入回复列表，并更新相关数据
						if (rlt.data.audit == 1) {
							var art = this.data.article
							art.stat.msgs++
							rlt.data.user = app.getLoginUser()
							art.msgs= art.msgs||[]
							art.msgs.unshift(rlt.data)
							this.setData({
								article: art,
								replyVisible: true,
								replyMsg: ''
							})

						}
					}
					else {
						app.ui.modal(rlt.msg, { cancel: false })
					}
				}
			})
		}
	},
	handleReplyCancel() {

		this.setData({
			statusBottom: 0,
			replyVisible: false,
			replyMsg: ''
		})
	},
	handleFav: function (e) {
		var art = this.data.article
		art.stat.favs += 1
		art.stat.myfav = true
		art.favs = art.favs || []
		art.favs.unshift({
			user: app.getLoginUser()
		})
		this.setData({
			article: art,
			statusBottom: 0,
			replyVisible: false,
		})
		app.http.request({
			check: true,
			url: 'art/do_fav',
			param: {
				aid: art.id,
			},
		})
	},



	/**
	 * 关注用户
	 */
	attach(e) {
		app.http.request({
			url: 'user/attach',
			data: { uid: this.data.article.user.id },
			success: rlt => {
				let article = this.data.article
				article.user.relationship = rlt.data.rs
				this.setData({
					article: article
				})
			}
		})
	},
	/**
	 * 取消关注用户
	 */
	cancelAttach(e) {
		app.ui.modal('你要取消对' + (this.data.article.user.nick || '匿名用户') + '的关注吗？', {
			cancel: true,
			confirm: {
				text: '是',
				callback: () => {
					app.http.request({
						url: 'user/cancel_attach',
						data: { uid: this.data.article.user.id },
						success: rlt => {
							let article = this.data.article
							article.user.relationship = rlt.data.rs
							this.setData({
								article: article
							})
						}
					})
				}
			}
		})

	},
	/**
	 * 显示更多操作
	 */
	showUserMoreActions(e) {
		app.ui.sheets({
			'举报': () => {
				wx.setStorage({
					key: 'jubao-data',
					data: this.data.article.user
				})
				wx.navigateTo({
					url: '/pages/user/complain/index?id=' + this.data.article.user.id,
				})
			}
		})

	},
	/**
	 * 私信消息
	 */
	handleMsg(){
		wx.navigateTo({
			url: '/pages/user/chat/index?tid='+this.data.article.user.id,
		})
	},
})