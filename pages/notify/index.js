// pages/notify/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orders: [],
		tabs: [{
			img:'https://res.shibu365.com/i/2019-02-18/94858e76111b4b85aaac68dc4b1fdd63.png',
			title:'评论和 @',
			path:'/pages/notify/comments',
		}, {
			img: 'https://res.shibu365.com/i/2019-02-18/9bcaa1b74ead47ad9da6c98c3d5cf0a3.png',
			title: '收藏',
			path: '/pages/notify/comments',
		}, {
			img: 'https://res.shibu365.com/i/2019-02-18/43f088b6debc4a04885c4498f5ec310c.png',
			title: '粉丝',
			path: '/pages/notify/comments',
		}],
		tabIndex: 0,
		tabFixed: false,
		assists:[],
		page: { ended: false, empty: false },
		bottomLoading: {
			height: 0,
			opacity: 0
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 加载数据
		options = options || {}
		this.setData({
			tabIndex: options.tab || 0,
		})


		this.loadData(options)

	},
	/**
	 * 加载数据
	 */
	loadData(options) {
		options = options || {}
		app.http.request({
			url: 'cst/notify/official_assists',
			done: rlt => {
				this.setData({
					assists:rlt.data
				})

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
		if(!this.data.assists || this.data.assists.length<=0){
			this.loadData()
		}
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

		this.loadData({
			page: 1,
			complete: () => {
				wx.stopPullDownRefresh()
			}
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

		if (this.data.page.ended) {
			return
		}
		this.setData({
			bottomLoading: {
				height: 41,
				opacity: 1
			}
		})
		this.loadData({
			page: this.data.page.curr + 1 || 1,
			complete: () => {
				this.setData({
					bottomLoading: {
						height: 0,
						opacity: 0
					}
				})
			}
		})
	},
	onPageScroll: function (e) {
	},
	handleTabChange(e) {
		this.setData({
			tabIndex: e.detail.index,
			bottomLoading: {
				height: 41,
				opacity: 1
			},
			orders: [],
			page: {
				ended: false,
				empty: false
			}
		})
		this.loadData({
			page: 1,
			complete: () => {
				this.setData({
					bottomLoading: {
						height: 0,
						opacity: 0
					}
				})
			}
		})
	},
})