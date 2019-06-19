// pages/index/join7.js/
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    step: 1,
    voicePath: null,
    videoPath: null,
    recording: false,
    curr: 0,
    neeUpload: false,
    videorecording: false,
    weights: {},
    yaowei:null,
    idouPhoto: null,
    iAgree: false
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    var cache = wx.getStorage({
      key: 'ifjoin',
      success: res => {

        this.setData({

          step: res.data.step||1,
          voicePath: res.data.voice || null,
          videoPath: res.data.voice || null,
          weights: res.data.weights || {},
          idouPhoto: res.data.idou||null,
          iAgree: res.data.iAgree || false,
          payPrice: res.data.amount||null,
          insertDate: res.data.insert||null
        })
      },
    })

    this.recorder = wx.getRecorderManager()
    this.recorder.onStart(res => {
      this.setData({
        recording: true,
        curr: 0
      })
      this.t = setInterval(() => {
        this.setData({
          curr: this.data.curr + 1
        })
      }, 100)
    })
    this.recorder.onStop(res => {
      clearInterval(this.t)

      this.setData({
        recording: false,
        curr: 0,
        voicePath: res.tempFilePath,
        neeUpload: true,
      })
    })

    this.audio = wx.createInnerAudioContext()

    this.camera = wx.createCameraContext(this)
  },

  handleStartRecAudio() {
    if (this.data.voicePath) {
      app.ui.modal('确定要清除之前录音重新录制吗？', {
        confirm: () => {

          this.setData({
            voicePath: null
          })

          this.recorder.start({
            duration: 10000,//10秒
          })
        },
        cancel: true
      })
    }
    else {
      this.recorder.start({
        duration: 10000,//10秒
      })
    }
  },
  handlePlayRecAudio() {
    this.audio.src = this.data.voicePath
    this.audio.play()
    // wx.playVoice({
    // 	filePath: this.data.voicePath,
    // 	duration: 10,
    // })
  },
  handleNext() {
    var step = this.data.step
    var cache = wx.getStorageSync('ifjoin') || {}
    if (step == 1) {
      cache.step = 1
      if (this.data.neeUpload) {
        app.http.uploadFile({
          file: this.data.voicePath,
          name: 'rec',
          success: rlt => {
            this.setData({
              voicePath: rlt.data.url,
              neeUpload: false
            })

            cache.voice = rlt.data.url
            wx.setStorage({
              key: 'ifjoin',
              data: cache,
            })
          }
        })
      }
      wx.setStorage({
        key: 'ifjoin',
        data: cache,
      })
    }
    else if (step == 2) {

      cache.step = 2
      if (this.data.neeUpload) {
        app.http.uploadFile({
          file: this.data.videoPath,
          name: 'video',
          success: rlt => {
            this.setData({
              videoPath: rlt.data.url,
              neeUpload: false
            })

            cache.video = rlt.data.url
            wx.setStorage({
              key: 'ifjoin',
              data: cache,
            })
          }
        })
      }
      wx.setStorage({
        key: 'ifjoin',
        data: cache,
      })
    }
    else if (step == 3) {

      cache.step = 3
      cache.weights = this.data.weights
      console.log(cache)
      if (this.data.neeUpload) {
        app.http.uploadFile({
          file: this.data.idouPhoto,
          name: 'idou',
          success: rlt => {
            this.setData({
              idouPhoto: rlt.data.url,
              neeUpload: false
            })

            cache.idou = rlt.data.url
            wx.setStorage({
              key: 'ifjoin',
              data: cache,
            })
          }
        })
      }
      wx.setStorage({
        key: 'ifjoin',
        data: cache,
      })
    }



    this.setData({
      step: step + 1
    })
    cache.step += 1
    wx.setStorage({
      key: 'ifjoin',
      data: cache,
    })
  },
  handleVideoUpload() {
    // this.camera.startRecord({
    // 	timeoutCallBack:(res)=>{
    // 		console.log(res.tempThumbPath, res.tempVideoPath)
    // 	}
    // })

    wx.chooseVideo({
      camera: "front",
      success: res => {
        console.log(res.tempFilePath)
        this.setData({
          videoPath: res.tempFilePath,
          neeUpload: true
        })
      },
      fail: res => {
        console.log(res)
      }
    })

  },
  handleJoin() {
    //app.ui.modal("后续功能等完善")


    app.http.request({
      url: 'user/join_plan_7',
      data: {
        // voice: this.data.voicePath,
        // video: this.data.videoPath,
        currWeight: this.data.weights.curr,
        targetWeight: this.data.weights.target,
        //idou: this.data.idouPhoto,
        yaowei:this.data.yaowei,
      },
      success: rlt => {
        if (rlt.status == 1) {

          var cache = wx.getStorageSync('ifjoin')||{};
          cache.state = "unpay"
          cache.payid = rlt.data.id
          cache.amount = rlt.data.amount
          cache.insert = rlt.data.stamp.insert.YmdHis
          cache.step = 5

          this.setData({
            payPrice: cache.amount,
            insertDate: cache.insert
          })
          wx.setStorage({
            key: 'ifjoin',
            data: cache,
            success: res => {
              this.handlePay()
            },
          })
        }
        else {
          app.ui.modal(rlt.msg)
        }
      }
    })
  },
  handlePay() {
    var cache = wx.getStorageSync('ifjoin')
    app.http.request({
      url: 'shop/pay_join_order',
      param: { id: cache.payid },
      done: rlt => {
        if (rlt.status == 1) {
          wx.requestPayment({
            timeStamp: rlt.data.timeStamp,
            nonceStr: rlt.data.nonceStr,
            package: rlt.data.package,
            signType: rlt.data.signType,
            paySign: rlt.data.paySign,
            success: function (res) {
              var cache = wx.getStorageSync('ifjoin');
              cache.state = "success"
              cache.step = 6
              wx.setStorage({
                key: 'ifjoin',
                data: cache,
              })
              wx.switchTab({
                url: '/pages/index/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            },
            fail: function (res) {
              var msg = res.errMsg
              if (msg == 'requestPayment:fail cancel') {
                msg = "支付未成功，请尽快完成支付！"
              }
              app.ui.modal(msg)
            },
          })
        }
        else {
          app.ui.modal(rlt.msg)
        }
      }
    })
  },










  handleCurrWeightInput(e) {

    var weights = this.data.weights || {}
    weights.curr = e.detail.value
    this.setData({
      weights: weights
    })
  },
  handleTargetWeightInput(e) {

    var weights = this.data.weights || {}
    weights.target = e.detail.value
    this.setData({
      weights: weights
    })

  },
  handleYaoweiInput(e) {
    this.setData({
      yaowei: e.detail.value
    })

  },
  handleChooseIdou() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          idouPhoto: res.tempFilePaths[0],
          neeUpload: true
        })
      },
    })
  },
  handleIAgreeToggle() {
    this.setData({
      iAgree: !this.data.iAgree
    })
  }
})