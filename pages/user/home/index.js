// pages/user/home/index.js
const app = getApp()
Page({

  page: {
    my: {},
    col: {},
    fav: {}
  },
  articles: {
    my: [],
    col: [],
    fav: []
  },
	/**
	 * 页面的初始数据
	 */
	data: {
		defUserPhoto: app.data.defUserPhoto,
    tabs: ['Ta的动态', 'Ta喜欢的', 'Ta的收藏'],
		user:{},
    articles: null,
    bottomLoading: {
      height: 0,
      opacity: 0
    },
    page: { ended: false, empty: false }
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		if (!options.id) {
			app.ui.modal('无效的用户标识', {
				cancel: false
			})
			return
		}

		app.http.request({
			url: 'user/get_home_data',
			param: { user_id: options.id },
			done: (rlt) => {
				this.setData({
					user: rlt.data,
          tabs: ['Ta的动态 '+rlt.data.my_count, 'Ta喜欢的 '+rlt.data.fav_count, 'Ta的收藏 '+rlt.data.col_count]
				})
			}
		})
    app.http.loadHzhList(this.options.id,rlt => {
        this.setData({
          hzhList: rlt.data || []
        })
    })
		options.page = 1

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
	},

	loadData:function(options){

		var options = options||{}
    var type

    switch (this.tabIndex){
      case 1:
        type = 'fav'
        break
      case 2:
        type = 'col'
        break
      default:
        type = 'my'
    }

		app.http.request({
			url: 'essay/get_all_essays',
			param: {
        uid:options.id,
        type:type,
        page:options.page||1
			},
			done: rlt => {
				var page = rlt.page
				var list = rlt.data
				page.ended = page.curr == page.last
				page.empty = page.total == 0
				var old = this.data.articles || []


        var favList = this.myFavEssayList
        var colList = this.myColEssayList

        for (var x in list) {
          var art = list[x]
          if (favList.indexOf(art.id) >= 0) {
            art.inMyFavList = true
          }
          if (colList.indexOf(art.id) >= 0) {
            art.inMyColList = true
          }
        }
        this.page[type] = page
        this.articles[type] = page.curr == 1 ? list : old.concat(list);
				this.setData({
					articles: this.articles[type],
          page:page,
				})

				options.complete && options.complete(rlt)
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

	handleTabChange(e) {
    this.tabIndex = e.detail.index

    var type

    switch (this.tabIndex) {
      case 1:
        type = 'fav'
        break
      case 2:
        type = 'col'
        break
      default:
        type = 'my'
    }

		this.setData({
			articles: this.articles[type],
			page: this.page[type]
		})
    
		if(this.articles[type].length<=0){

      this.setData({
        bottomLoading: {
          height: 41,
          opacity: 1
        }
      })

      this.loadData({
        complete:()=>{

          this.setData({
            bottomLoading: {
              height: 0,
              opacity: 0
            }
          })
        }
      })
    }

		
	},

  handleTopicTap: function (e) {
    app.ui.modal('话题汇总展示功能完善中...')
  },
  handleLocChange: function (e) {
    app.ui.modal('城市切换功能完善中...')
  },
  handleLocRestore: function (e) {
    app.ui.modal('请先登录')
  },
  handleMsg: function (e) {

    this.currArtIndex = e.currentTarget.dataset.index
    this.retoId = e.currentTarget.dataset.posterid
    var nick = e.currentTarget.dataset.retonick
    
    this.setData({
      replyVisible: true,
      placeholder: this.retoId ? ('回复' + nick) : '送上你的鼓励吧'
    })

  },
  handleReplySend(e) {
    if (e.detail.value) {
      var param = {

        aid: this.data.articles[this.currArtIndex].id,
        msg: e.detail.value,
      }
      if (this.retoId) {
        param.rid = this.retoId
      }
      app.http.request({
        check: true,
        url: 'essay/do_reply',
        data: param,
        done: rlt => {
          if (rlt.status == 1) {
            app.ui.success('评论成功')

            var list = this.data.articles, index = this.currArtIndex
            var art = list[index]
            art.comment_count++
            //rlt.data.user = app.getLoginUser()
            art.comments.unshift(rlt.data)


          }
          else {
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
  noTriggerEvent() { },
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
      success: rlt => {

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
        if (rlt.status == 1) {
          this.myFavEssayList.push(art.id)
          wx.setStorage({
            key: 'ifthin_fav_essay_list',
            data: this.myFavEssayList,
          })
          app.ui.success()
        }
        else {
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
	attach(e) {
		app.http.request({
			url: 'user/attach',
			data: { uid: this.data.user.id },
			success: rlt => {
				let user = this.data.user
				user.relationship = rlt.data.rs
				this.setData({
					user: user
				})
			}
		})
	},
	/**
	 * 取消关注用户
	 */
	cancelAttach(e) {
		app.ui.modal('你要取消对' + (this.data.user.nick || '匿名用户') + '的关注吗？', {
			cancel:true,
			confirm: {
				text: '是',
				callback: () => {
					app.http.request({
						url: 'user/cancel_attach',
						data: { uid: this.data.user.id },
						success: rlt => {
							let user = this.data.user
							user.relationship = rlt.data.rs
							this.setData({
								user: user
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
					data: this.data.user
				})
				wx.navigateTo({
					url: '/pages/user/complain/index?id=' + this.data.user.uid,
				})
			}
		})

	},
})