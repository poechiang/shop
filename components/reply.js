// components/reply.js.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		visible:{
			type:Boolean,
			value:false
		},
		msg:String,
		audio:Boolean,
		autoClose:{
			type:Boolean,
			value:true
		},
		placeholder:String,

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusHeight: app.systemInfo.tabBarHeight,
		focused: false,
		mode: {
			type: String,
			value: 'keyboad'
		},

	},
	options: {
		addGlobalClass: true,
	},
	lifetimes: {

		attached: function () {
			if (this.properties.visible) {
				setTimeout(() => {
					this.setData({
						focused: true
					})
				}, 400)
			}
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		_hide(){
			// this.setData({
			// 	visible:false
			// })
		},
		handleInput(e){
			this.setData({
				msg:e.detail.value
			})
		},
		handleBack(){
			this.canceled = true
			console.log('reply hide：back')
			setTimeout(() => {
				this.triggerEvent('cancel', { action: 'back' }, {})
				this._hide()
				this.canceled = false
			}, 400)
			
		},
		handleBlur() {
			setTimeout(() => {
				console.log('reply hide：blur ' + this.canceled)
				if (!this.canceled) {
						console.log('reply hide：blur')
						this.triggerEvent('cancel',{action:'blur'},{})
					this._hide()
				}
			}, 200)
		},
		handleSend(e) {
			this.canceled = true
			console.log('reply hide：send '+this.canceled)
			setTimeout(() => {
				console.log('reply hide：send')
				this.triggerEvent('send', {value:this.data.msg}, {})
				this._hide()
				this.canceled = false
			}, 400)
			
		},
		handleTypeToggle(){
			this.setData({
				mode:this.data.mode=='keyboad'?'audio':'keyboad'
			})
		},
		handleStartRec(){
			console.log('rec started')
		},
		handleCancelRec() {
			console.log('rec canceled')
		},
		handleSendRec() {
			console.log('rec sended')
		},
	}
})
