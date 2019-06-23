// pages/circle/index.js
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		articles:[],
		defUserPhoto:app.data.defUserPhoto,
		blocks:['post','top'],
		currCity:null,
		tabs: ['狂人社区', '我的', '收藏'],
		tabIndex:0,
		page:{ended:false,empty:false},
		bottomLoading:{
			height:0,
			opacity:0
		},
		replyVisible:false,
		navBarVisible:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 加载数据
		options=options||{}
		options.complete=()=>{
			this.setData({
				bottomLoading: {
					height: 0,
					opacity: 0
				}
			})
		}
		wx.getStorage({
			key: 'ifthin_fav_essay_list',
			success: res => {
				this.myFavEssayList = res.data || []
			},
		})
		wx.getStorage({
			key: 'ifthin_col_essay_list',
			success: res => {
				this.myColEssayList = res.data || []
			},
		})
		this.setData({
			tabIndex:options.tab||0,
			bottomLoading: {
				height: 41,
				opacity: 1
			}
		})
		this.loadData(options)
		// 定位当前城市
		app.locate(loc=>{
			this.setData({
				currCity:{
					name: loc.isMunicipality?loc.province:loc.city,
					adcode:loc.adcode
				}
			})
		})
		wx.hideShareMenu()

	},
	/**
	 * 加载数据
	 */
	loadData(options){
		
		var type = 'all'
			
		if (this.data.tabIndex == 1) {
			type = 'my'
		}
		else if (this.data.tabIndex == 2) {
			type = 'col'
		}

		app.http.request({
			url: 'essay/get_all_essays',
			param:{
				type:type,
				page:options.page||1,
				adcode: this.data.currCity ? this.data.currCity.adcode : 0,
			},
			done:rlt=>{
				var page = rlt.page
				var list = rlt.data
				page.ended = page.curr == page.last
				page.empty = page.total == 0
				var old = this.data.articles||[]

				var favList = this.myFavEssayList
				var colList = this.myColEssayList
				
				for(var x in list){
					var art = list[x]
					if (favList.indexOf(art.id) >= 0) {
						art.inMyFavList = true
					}
					if (colList.indexOf(art.id) >= 0) {
						art.inMyColList = true
					}
				}

				this.setData({
					articles: page.curr == 1 ? list : old.concat(list),
					page:page
				})
				
				options.complete && options.complete(rlt)
			}
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.loadData({
			page:1,
			complete:()=>{
				wx.stopPullDownRefresh()
			}
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if(this.data.page.ended){
			return
		}
		this.setData({
			bottomLoading:{
				height:41,
				opacity:1
			}
		})
		this.loadData({
			page: this.data.page.curr + 1 || 1,
			complete:()=>{
				console.log(456)
				this.setData({
					bottomLoading: {
						height: 0,
						opacity: 0
					}
				})
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			var index = res.target.dataset.index,
				art = this.data.articles[index]

			var info = {
				title: art.title||art.brief20,
				path: '/pages/circle/detail?aid='+ art.id
			}
			if(art.pictures.length>0){
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
	handleTabChange(e){
		this.setData({
			tabIndex:e.detail.index,
			bottomLoading: {
				height: 41,
				opacity: 1
			},
			articles:[],
			page:{
				ended:false,
				empty:false
			}
		})
		this.loadData({
			page: 1,
			complete: () => {
				console.log(123)
				this.setData({
					bottomLoading: {
						height: 0,
						opacity: 0
					}
				})
			}
		})
	},
	handleViewDetail(e){
		wx.navigateTo({
			url: '/pages/circle/detail?aid='+e.currentTarget.dataset.id,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	handleTopicTap:function(e){
		app.ui.modal('话题汇总展示功能完善中...')
	},
	handleLocChange: function (e) {
		app.ui.modal('城市切换功能完善中...')
	},
	handleLocRestore: function (e) {
		app.ui.modal('请先登录')
	},
	// doLocate(){
	// 	wx.getLocation({
	// 		type: 'GCJ02',
	// 		altitude: true,
	// 		success: (res) => {
	// 			getApp().amapwx.getRegeo({
	// 				location: res.longitude + ',' + res.latitude,//location的格式为'经度,纬度'
	// 				success: (data) => {
	// 					if (!data && data.length <= 0) {
	// 						console.warn('位置解析失败！')
	// 						return
	// 					}
						
	// 					data = data[0].regeocodeData.addressComponent
	// 					console.log(data)
	// 					this.setData({
	// 						currCity: {
	// 							name: data.city.replace(/(市$)|(区$)/, ''),
	// 							code: data.adcode
	// 						}
	// 					})
	// 				},
	// 				fail: function (info) { }
	// 			});

	// 			getApp().amapwx.getWeather({
	// 				success: (data) => {
	// 					console.log(data);
	// 					//成功回调
	// 				},
	// 				fail: (info) => {
	// 					//失败回调
	// 					console.log(info)
	// 				}
	// 			})
	// 		},
	// 		fail: function (res) { },
	// 		complete: function (res) { },
	// 	})
	// },
	handleMsg:function(e){
		
    this.currArtIndex = e.currentTarget.dataset.index
    this.retoId = e.currentTarget.dataset.posterid
    var nick = e.currentTarget.dataset.retonick
		this.setData({
			replyVisible: true,
			navBarVisible: false,
      placeholder:this.retoId?('回复'+nick):'送上你的鼓励吧'
		})

	},
	handleReplySend(e) {
		if(e.detail.value){
			var param = {

        aid: this.data.articles[this.currArtIndex].id,
        msg: e.detail.value,
      }
      if(this.retoId){
        param.rid = this.retoId
      }
			app.http.request({
				check:true,
				url:'essay/do_reply',
				data:param,
				done: rlt => {
					if(rlt.status==1){
						app.ui.success('评论成功')
						
						var list = this.data.articles, index = this.currArtIndex
						var art = list[index]
						art.comment_count++
						//rlt.data.user = app.getLoginUser()
            art.comments.unshift(rlt.data)
						
						
					}
					else{
						app.ui.modal(rlt.msg, { cancel: false })
					}

					this.setData({
						articles: list,
						replyVisible: false,
						navBarVisible: true,
						replyMsg: ''
					})
				}
			})
		}
	},
	noTriggerEvent(){},
	handleReplyCancel() {
		this.currArtIndex = -1
		this.setData({
			replyVisible: false,
			navBarVisible: true,
			replyMsg: ''
		})
	},
	handleCollect: function (e) {
		var index = e.currentTarget.dataset.index,
			list = this.data.articles,
			art = list[index]

		art.col_count += 1
		art.inMyColList = true
		this.setData({
			articles: list
		})
		app.http.request({
			check: true,
			url: 'essay/do_collect',
			param: {
				aid: list[index].id,
			},
			success:rlt=>{

				if (rlt.status == 1) {
					this.myColEssayList.push(art.id)
					wx.setStorage({
						key: 'ifthin_col_essay_list',
						data: this.myColEssayList,
					})
					app.ui.success()
				}
				else {
					app.ui.modal(rlt.msg)
					art.col_count -= 1
					art.inMyColList = false
					this.setData({
						articles: list
					})
				}
			}
		})
	},
	handleFav: function (e) {
		var index = e.currentTarget.dataset.index,
			list = this.data.articles,
			art = list[index]
		art.fav_count += 1
		art.inMyFavList = true
		this.setData({
			articles: list
		})
		app.http.request({
			url: 'essay/do_fav',
			param: {
				aid: art.id,
			},
			success: rlt => {
				if(rlt.status==1){
					this.myFavEssayList.push(art.id)
					wx.setStorage({
						key: 'ifthin_fav_essay_list',
						data: this.myFavEssayList,
					})
					app.ui.success()
				}
				else{
					app.ui.modal(rlt.msg)

					art.fav_count -= 1
					art.inMyFavList = false
        }
        this.setData({
          articles: list
        })
			}
		})
	},
	/**
	 * 关注用户
	 */
	attach(e){
		let uid = e.target.dataset.uid

		app.http.request({
			url:'user/attach',
			data:{uid:uid},
			success:rlt=>{
				let arts = this.data.articles
				for(var i =0; i<arts.length;i++){
					let user = arts[i].user
					if(user.id == uid){
						user.relationship=rlt.data.rs
					}
				}
				this.setData({
					articles:arts
				})
			}
		})
	},
	/**
	 * 取消关注用户
	 */
	cancelAttach(e) {
		let uid = e.target.dataset.uid
		let nick = e.target.dataset.unick

		app.ui.modal('你要取消对' + (nick || '匿名用户') + '的关注吗？', {
			cancel: true,
			confirm:{
				text:'是',
				callback:()=>{
					app.http.request({
						url: 'user/cancel_attach',
						data: { uid: uid },
						success: rlt => {
							let arts = this.data.articles
							for (var i = 0; i < arts.length; i++) {
								let user = arts[i].user
								if (user.id == uid) {
									user.relationship = rlt.data.rs
								}
							}
							this.setData({
								articles: arts
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
		let index = e.target.dataset.index
		app.ui.sheets({
			'举报': () => {

				wx.setStorage({
					key: 'jubao-data',
					data: this.data.articles[index].user
				})
				wx.navigateTo({
					url: '/pages/user/complain/index?id=' + this.data.articles[index].user.id,
				})
		}})

	},

  previewImg(e) {
    var art

    for (var x in this.data.articles) {
      if (this.data.articles[x].id == e.target.dataset.artid) {
        art = this.data.articles[x]
      }
    }
    wx.previewImage({

      current: art.pictures[e.target.dataset.index],
      urls: art.pictures
    })
  }
})