// pages/shop/good/list.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ready:false,
		banners: [],
		groups: [],
		tabs: ['推荐', '热销'],
		blocks: ['top', 'trolley'],
		tabIndex: 0,
		
		page: { ended: false, empty: false },
		bottomLoading: {
			height: 0,
			opacity: 0
		},
		trolleyCount: (wx.getStorageSync('trolley') || {}).total || 0
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		options = options || {}
		options.load = {
			banner: true,
			good: true,
		}
		this.loadData(options)
	},
	loadData(options) {
		options = options || {}
		app.http.request({
			url: 'cst/shop/get_banners',
			data:{type:2},
			done: rlt => {
				if (rlt.status == 1) {
					this.setData({
						banners: rlt.data
					})
				}
			}
		});

		app.http.request({
			url: 'cst/shop/all_groups',
			param: {
				page: options.page || 1,
				filter: this.data.tabIndex,
			},
			done: rlt => {

				var page = rlt.page
				var list = rlt.data
				page.ended = page.curr == page.last
				page.empty = page.total == 0
				var old = this.data || []
				this.setData({
					groups: page.curr == 1 ? list : old.concat(list),
					page: page,
					ready:true,
				})

				console.log(rlt,this.data.groups)
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
			load: { banner: false },
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
	},
	goshop(){
		wx.switchTab({
			url: '/pages/shop/index',
		})
	}
})