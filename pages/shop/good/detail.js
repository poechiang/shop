// pages/shop/good/detail.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		good: null,
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
		options = options || {}

		if (!options.id) {
			app.ui.modal('指定的产品参数无效', {
				confirm: () => {
					app.pages.goBack()
				}
			})
			return
		}

		this.loadData(options)
	},
	loadData(options) {

		options = options || {}
		app.http.request({
			url: 'shop/get_good',
			param: { id: options.id },
			done: rlt => {
				if (rlt.status == 1) {
					this.setData({ good: rlt.data })
					app.wxParse.wxParse('detail', 'html', rlt.data.detail, this, 5)
				}
				else {
					app.ui.modal('指定产品不存在或已下架，看看其他产品吧', {
						success: () => {
							app.pages.goBack()
						}
					})

				}
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
		this.setData({
			trolleyCount: (wx.getStorageSync('trolley') || {}).total || 0,
		})
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
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			var good = this.data.good

			var info = {
				title: good.group.title || good.title,
				path: '/pages/good/detail?id=' + good.id
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
	handleToTrolley(e) {
		wx.navigateTo({
			url: '/pages/shop/trolley',
		})
	},
	handleBuy(e) {
		wx.navigateTo({
			url: '/pages/shop/pay?id=' + this.data.good.id,
		})
	},
	addToTrolley(e) {
		var gid = e.currentTarget.dataset.goodId,
			count = 1,
			trolley = wx.getStorageSync('trolley') || { list: {}, total: 0 }
		if (trolley.list[gid] > 0) {
			trolley.list[gid] += count
		}
		else {
			trolley.total = (trolley.total || 0) + 1
			trolley.list[gid] = count
		}


		wx.setStorageSync('trolley', trolley)
		this.setData({
			trolleyCount: trolley.total || 0
		})
		app.ui.success('添加成功')
	}
})