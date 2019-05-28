// pages/user/chat/index.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		defUserPhoto: app.data.defUserPhoto,
		me: app.getLoginUser(),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		options.tid=103
		this.loadData(options)
	},

	loadData(options){
		if(!options.tid || options.tid<=0){
			app.ui.modal('无效的用户标识:tid='+options.tid)
			return
		}
		let history = wx.getStorageSync('msg-history')||{}
		if(history[options.tid]){
			this.setData(history[options.tid])

			wx.nextTick(()=>{
				wx.createSelectorQuery().select('.list').boundingClientRect(function (rect) {
					wx.pageScrollTo({
						scrollTop: rect.height + 70
					})
				}).exec()
			})
		}
		else{
			app.http.request({
				url: 'cst/user/get_chat_history',
				data: { uid: options.tid },
				success: rlt => {
					wx.setNavigationBarTitle({
						title: rlt.data.user.nick || '匿名用户',
					})
					this.setData({
						list: rlt.data.list,
						user: rlt.data.user
					})

					wx.nextTick(() => {
						wx.createSelectorQuery().select('.list').boundingClientRect(function (rect) {
							wx.pageScrollTo({
								scrollTop: rect.height + 70
							})
						}).exec()
					})
				}
			})
		}
		
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

	},

	handleReplySend(e) {
		
		if (!e.detail.value) {
			app.ui.modal('请勿发送空消息')
			return
		}
		let list = this.data.list
		let item={}
		let time = (new Date).time()
		let group = (new Date).format('H:m')
		item.rid = this.data.user.id
		item.uid = (app.getLoginUser()||{}).id
		// item.type = 3
		// item.status=0,
		item.time = time
		item.content = e.detail.value

		item.wx_key = list.length+1
		if (time - (this.data.last||0)>300){
			list.push({"group" :group})
		} 
		list.push(item)

		let history = wx.getStorageSync('msg-history') || {}
		history[this.data.user.id]={
			user:this.data.user,
			list:list,
			last:time
		}
		wx.setStorage({
			key: 'msg-history',
			data: history,
		})
		this.setData({
			list:list,
			last:time,
			replyMsg:''
		})

		wx.nextTick(() => {
			wx.createSelectorQuery().select('.list').boundingClientRect(function (rect) {
				wx.pageScrollTo({
					scrollTop: rect.height + 70
				})
			}).exec()
		})
		app.http.request({
			check: true,
			url: 'cst/user/msg',
			param: {
				uid: this.data.user.id,
				msg: e.detail.value,
			},
			done: rlt => {
				if (rlt.status == 1) {
					var list = this.data.list
					for(var x in list){
						if(list[x].time ==rlt.data.time){
							list[x]=rlt.data
						}
					}
					history[this.data.user.id].list = this.data.list
					wx.setStorage({
						key: 'msg-history',
						data: history,
					})
					this.setData({
						list:list
					})
				}
				else {
					app.ui.modal(rlt.msg, { cancel: false })
				}
			}
		})
	}
})