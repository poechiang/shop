// pages/index/join.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		step:1,
		voicePath:null,
		videoPath:null,
		recording:false,
		curr:0,
		neeUpload:false,
		videorecording:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var cache = wx.getStorage({
			key: 'ifjoin',
			success: res=> {
				
				this.setData({

					step:res.data.step,
					voicePath:res.data.voice
				})
			},
		})

		this.recorder = wx.getRecorderManager()
		this.recorder.onStart(res=>{
			this.setData({
				recording:true,
				curr:0
			})
			this.t=setInterval(()=>{
				this.setData({
					curr: this.data.curr+1
				})	
			}, 100)
		})
		this.recorder.onStop(res => {
			clearInterval(this.t)

			this.setData({
				recording:false,
				curr:0,
				voicePath: res.tempFilePath,
				neeUpload:true,
			})
		})

		this.audio = wx.createInnerAudioContext()

		this.camera = wx.createCameraContext(this)
	},

	handleStartRecAudio(){
		if(this.data.voicePath){
			app.ui.modal('确定要清除之前录音重新录制吗？',{
				confirm:()=>{
					
					this.setData({
						voicePath:null
					})

					this.recorder.start({
						duration: 10000,//10秒
					})
				},
				cancel:true
			})
		}
		else{
			this.recorder.start({
				duration: 10000,//10秒
			})
		}
	},
	handlePlayRecAudio(){
		this.audio.src = this.data.voicePath
		this.audio.play()
		// wx.playVoice({
		// 	filePath: this.data.voicePath,
		// 	duration: 10,
		// })
	},
	handleNext() {
		var step = this.data.step
		var cache = wx.getStorageSync('ifjoin')||{}
		if(step==1){
			cache.step = 1
			if(this.data.neeUpload){
				app.http.uploadFile({
					file: this.data.voicePath,
					name: 'rec',
					success: rlt => {
						this.setData({
							voicePath: rlt.data.url,
							neeUpload:false
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
		else if(step==2){

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



		this.setData({
			step:step + 1
		})
		cache.step+=1
		wx.setStorage({
			key: 'ifjoin',
			data: cache,
		})
	},
	handleVideoUpload(){
		// this.camera.startRecord({
		// 	timeoutCallBack:(res)=>{
		// 		console.log(res.tempThumbPath, res.tempVideoPath)
		// 	}
		// })

		wx.chooseVideo({
			camera:"front",
			success:res=>{
				console.log(res.tempFilePath)
				this.setData({
					videoPath:res.tempFilePath,
					neeUpload:true
				})
			},
			fail:res=>{
				console.log(res)
			}
		})

	},
	handleJoin() {
		//app.ui.modal("后续功能等完善")

				wx.switchTab({
					url: '/pages/index/index',
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
		
	}
})