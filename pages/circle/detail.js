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
    statusHeight: app.systemInfo.tabBarHeight,
		statusBottom:0,
		replyVisible: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 加载数据
		options = options || {}


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
    
		this.loadData(options)
    //console.log(app.getSystemInfo)
	},
	/**
	 * 加载数据
	 */
	loadData(options) {
		options = options || {}
		app.http.request({
			url: 'essay/get_detail',
			param: {id:options.id},
			done: rlt => {


        var favList = this.myFavEssayList
        var colList = this.myColEssayList

        var art = rlt.data
        if (favList.indexOf(art.id) >= 0) {
          art.inMyFavList = true
        }
        if (colList.indexOf(art.id) >= 0) {
          art.inMyColList = true
        }
				this.setData({ article: art })
				app.wxParse.wxParse('content', 'html', rlt.data.content, this, 5)
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

    this.retoId = e.currentTarget.dataset.posterid
    var nick = e.currentTarget.dataset.retonick
		this.setData({
			statusBottom: -this.data.statusHeight,
      replyVisible: true,
      placeholder: this.retoId ? ('回复' + nick) : '送上你的鼓励吧'
		})

    // this.setData({
    //   replyVisible: true,
    //   navBarVisible: false
    // })
	},
  handleReplySend(e) {
    if (e.detail.value) {

      var param = {
        aid: this.data.article.id,
          msg: e.detail.value,
        }
      if (this.retoId){
        param.rid= this.retoId
        }
      app.http.request({
        check: true,
        url: 'essay/do_reply',
        data:param,
        done: rlt => {
          if (rlt.status == 1) {
            app.ui.success('评论成功')

            var art = this.data.article
            art.comment_count++
            
            art.comments.unshift(rlt.data)


          }
          else {
            app.ui.modal(rlt.msg, { cancel: false })
          }

          this.setData({
            article: art,
            replyVisible: false,
            statusBottom: 0,
            replyMsg: ''
          })
        }
      })
    }
  },
  noTriggerEvent() { },
	handleReplyCancel() {

		this.setData({
			statusBottom: 0,
			replyVisible: false,
			replyMsg: ''
		})
  },
  handleCollect: function (e) {
    var art = this.data.article

    art.col_count += 1
    art.inMyColList = true
    this.setData({
      article: art
    })
    app.http.request({
      check: true,
      url: 'essay/do_collect',
      param: {
        aid: art.id,
      },
      success: rlt => {

        if (rlt.status == 1) {
          this.myColEssayList.push(art.id)
          wx.setStorage({
            key: 'ifthin_col_essay_list',
            data: this.myColEssayList,
          })
          art.collectors.unshift(rlt.data)
          app.ui.success()
        }
        else {
          app.ui.modal(rlt.msg)
          art.col_count -= 1
          art.inMyColList = false
          this.setData({
            article: art
          })
        }
      }
    })
  },
  handleFav: function (e) {
    var art = this.data.article
    art.fav_count += 1
    art.inMyFavList = true
    this.setData({
      article: art
    })
    app.http.request({
      url: 'essay/do_fav',
      param: {
        aid: art.id,
      },
      success: rlt => {
        if (rlt.status == 1) {
          this.myFavEssayList.push(art.id)
          wx.setStorage({
            key: 'ifthin_fav_essay_list',
            data: this.myFavEssayList,
          })

          art.favoritors.unshift(rlt.data)
          app.ui.success()
        }
        else {
          app.ui.modal(rlt.msg)

          art.fav_count -= 1
          art.inMyFavList = false
        }
        this.setData({
          article: art
        })
      }
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
	// handleMsg(){
	// 	wx.navigateTo({
	// 		url: '/pages/user/chat/index?tid='+this.data.article.user.id,
	// 	})
	// },

  previewImg(e){
    wx.previewImage({
      current:this.data.article.pictures[e.target.dataset.index],
      urls: this.data.article.pictures
    })
  }
})