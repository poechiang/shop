// pages/user/order/list.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orders:[],
		tabs: ['全部', '待付款', '待签收', '待评价', '已完成'],
		tabIndex: 0,
		
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
			tabIndex: options.t || 0,
		})
		this.loadData(options)

	},
	/**
	 * 加载数据
	 */
	loadData(options) {
		options = options || {}
		
		app.http.request({
			url: 'cst/shop/all_orders',
			param: {
				page: options.page || 1,
				filter: this.data.tabIndex,
			},
			done: rlt => {
				var page = rlt.page
				var list = rlt.data
				page.ended = page.curr == page.last
				page.empty = page.total == 0
				var old = this.data.orders || []
				this.setData({
					orders: page.curr == 1 ? list : old.concat(list),
					page: page
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
	onPageScroll: function (e) {}, 
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