// pages/shop/good/detail.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ready: {},
		good: null,
		group: null,
		groups: [{
			captain: { photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
			users: [
				{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
				{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '四哥', id: 94 }
			],
			info: { count: 3, price: 65 },
		}, {
				captain: { photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
				users: [
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '四哥', id: 94 }
				],
				info: { count: 3, price: 65 },
			}, {
				captain: { photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
				users: [
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '四哥', id: 94 }
				],
				info: { count: 3, price: 65 },
			}, {
				captain: { photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
				users: [
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '四哥', id: 94 }
				],
				info: { count: 3, price: 65 },
			}, {
				captain: { photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
				users: [
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '三哥', id: 92 },
					{ photo: "https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg", nick: '四哥', id: 94 }
				],
				info: { count: 3, price: 65 },
			}],//已有团购
		defUserPhoto: 'https://res.shibu365.com/i/2018-12-16/88e15fd6f83e4cd3bd2c579ed37ce7ec.jpg',
		statusHeight: app.systemInfo.tabBarHeight,
		statusBottom: 0,
		blocks: ['top'],
		trolleyCount: (wx.getStorageSync('trolley') || {}).total || 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(app.systemInfo)
		this.loadData()
	},
	loadData(cb) {

		var options = this.options
		if (!options.id) {
			app.ui.modal('指定的产品参数无效', {
				confirm: () => {
					app.pages.goBack()
				}
			})
			return
		}
		if (this.loading) return
		this.loading = true
		app.http.request({
			url: 'shop/get_group',
			param: { id: options.id },
			done: rlt => {
				if (rlt.status == 1) {
					if (!rlt.data.started) {
						this.remain = rlt.data.start - Date.time()
						this.setData({
							group: rlt.data,
							good: rlt.data ? rlt.data.meta.good : null,
							remain: app.util.calcDateTime(this.remain)
						})

						this.t = setInterval(() => {
							if (--this.remain <= 0) {
								clearInterval(this.t)
								var group = this.data.group
								group.started = true
								this.setData({
									remain: '',
									group: group
								})
							}
							else {
								this.setData({
									remain: app.util.calcDateTime(this.remain)
								})
							}
						}, 1000)
					}
					else{

						this.setData({
							group: rlt.data,
							good: rlt.data ? rlt.data.meta.good : null
						})
					}

				}
				else {
					app.ui.modal('指定产品不存在或已下架，看看其他产品吧', {
						success: () => {
							app.pages.goBack()
						}
					})

				}
				this.loading = false
				cb && cb(rlt)
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
		// this.setData({
		// 	trolleyCount: (wx.getStorageSync('trolley') || {}).total || 0,
		// })
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
		this.loadData(() => {
			wx.stopPullDownRefresh()
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (this.options.page > 0) {
			this.options.page++
			this.loadData()
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			var good = this.data.good,
				group = this.data.group

			var info = {
				title: good.group.title || good.title,
				path: '/pages/shop/group/detail?id=' + group.id
			}
			if (good.heads.length > 0) {
				info.imageUrl = good.heads[0]
			}

			app.http.request({
				check: true,
				url: 'good/do_share',
				param: {
					id: good.id,
				},
			})

			return info
		}
	},
	handleMsg(e) {
		console.log('reply invoke')
	},
	handleFav(e) {
		console.log('fav inoke')
	},
	handleToGroup(e) {
		wx.pageScrollTo({
			scrollTop: 50,
			duration: 400,
		})
	},
	handleOpenGroup(e) {
		var gid = e.target.dataset.gid,
			pid = e.target.dataset.pid,
			price = e.target.dataset.price

		wx.navigateTo({
			url: '/pages/shop/pay?id=' + this.data.good.id + '&gid=' + gid + '&pid=' + pid + '&price=' + price +'&t=open'
		})
	},
	handleJoinGroup(e) {
		var gid = e.target.dataset.gid,
			price = e.target.dataset.price


		wx.navigateTo({
			url: '/pages/shop/pay?id=' + this.data.good.id + '&gid=' + gid + '&price=' + price + '&t=join'
		})
	},
	handleBuy(e) {
		wx.navigateTo({
			url: '/pages/shop/pay?id=' + this.data.good.id,
		})
	},
})