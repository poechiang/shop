// pages/circle/post.js
const app = getApp()
const uploadFiles=(files,index)=>{
	var page = app.pages.current()
	
	var art = page.data.article,
		count = files.length
	app.con.debug('开始上传照片' + count + '张')
	app.ui.loading('正在上传')
	app.http.uploadFile({
		files: files,
		success(res) {
			if (--count <= 0) {
				app.ui.loading(false)
			}
			if (index >= 0) {
				art.pictures.splice(index,1,res.data[0].url)
			}
			else{
				art.pictures.push(res.data[0].url)
			}
			
			page.setData({
				article: art
			})
		}
	})
}
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		article:{
			content:'',
			meta:{
				allow: {
					fav: 1,
					zan: 1,
					reply: 1
				},
			},
			visible: 0,
			pictures:[],
			adcode:'',
			city:''
		},
		limitTotal: 140,
		limitWarn: 100,
		max:-1,
		visibilities: ["所有人可见", "关注的人可见", "仅粉丝可见", "仅好友可见", "仅自己可见"],
		
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		app.locate({
			success:loc=>{
				this.setData({
					currCity: {
						adcode:loc.adcode,
						city:loc.isMunicipality?loc.province:loc.city
					}
				})
			},
			fail:()=>{
				app.con.warn('定位失败，直接使用当前登录用户的默认位置信息')
				var user = app.getLoginUser()
				this.setData({
					currCity: {
						adcode: user.adcode,
						city: user.city_desc,
					}
				})
			}
		})

		// app.weather(weather => {
		// 	console.log(weather)
		// })
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
	handleContentInput(e){
		var art=this.data.article
		art.content = e.detail.value
		this.setData({
			article:art
		})
	},
	handleAddFiles() {
		var that = this
		wx.chooseImage({
			count: 9 - this.data.article.pictures.length,
			success: (res) => {
				uploadFiles(res.tempFilePaths)
			},
			fail: function(res) {
				app.con.error(res)
			},
		})
	},
	handleCityToggle() {

	},
	handleVisibeChange(e) {
		var art = this.data.article
		art.visible = e.detail.value ? 4 : 0
		console.log(art.visible)
		this.setData({
			article:art
		})
	},
	handleChangeReply(e) {
		var art = this.data.article
		art.meta.allow.reply = e.detail.value ?1:0
		this.setData({
			article: art
		})

	},
	handleChangeShare(e) {
		var art = this.data.article
		art.meta.allow.zan = e.detail.value ?1:0
		this.setData({
			article: art
		})
	},
	handleChangeFav(e) {
		var art = this.data.article
		art.meta.allow.fav = e.detail.value ?1:0
		this.setData({
			article: art
		})
	},
	handlePost() {
		var art = this.data.article
		if(this.data.currCity){
			art.adcode = this.data.currCity.adcode
			art.city = this.data.currCity.city
		}

		app.http.request({
			url:'art/post',
			param:art,
			done:rlt =>{
				if(rlt.status==1){
					app.ui.success('发表成功',{
						success:()=>{
							app.pages.goBack()
						}
					})
					
				}
				else{
					app.ui.modal(rlt.msg,{
						cancel:false
					})
				}
			}
		})
	},
	handleShowActionSheet(e){
		var that = this,
			index = e.currentTarget.dataset.index
			
		wx.showActionSheet({
			itemList: ['替换','移除'],
			success:res=>{
				switch(res.tapIndex){
					case 0://替换
						wx.chooseImage({
							count: 1,
							success: (res) => {
								uploadFiles(res.tempFilePaths,index)
							},
							fail: function (res) {
								app.con.error(res)
							},
						})
					break
					case 1://移除
						var art = that.data.article
						art.pictures.splice(index,1)
						that.setData({
							article:art
						})
					break
					default:
				}

			}
		})
	}
})