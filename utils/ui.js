const defOptions = {
	title: '',
	content: '',
	showCancel: true,
	cancelText:'取消',
	cancelColor: '#E64340',
	confirmText: '知道了',
	confirmColor: '#1AAD19',
	icon: '',
	image: '',
	duration: 1500,
	mask: true,
	success: function (res) { },
	fail: function (res) { },
	complete: function (res) { },
}
const toastCore = (title, options) => {
	title = title || false
	options = Object.extend({}, defOptions, options || {})
	if (title === false) {
		wx.hideToast()
	}
	else {
		options.title = title+''
		let success = options.success
		if(success && options.duration>0){
			options.success = res=>{
				setTimeout(()=>{
					success(res)
				},options.duration)
			}
		}
		wx.showToast(options)
	}
}
module.exports = {
	loading:(title,options)=>{
		title=title||false
		options = Object.extend({},defOptions,options||{})
		if(title===false){
			wx.hideLoading()
		}
		else{
			options.title = title
			wx.showLoading(options)
		}
	},
	toast:toastCore,
	success: (title, options)=> {
		toastCore(title||'操作成功',Object.extend({},defOptions,{
			image:'/static/images/success.png'
		},options||{}))
	},
	info: (title, options) =>{
		
		toastCore(title, Object.extend({},defOptions, {
			image: '/static/images/info.png'
		}, options || {}))
	},
	warn: (title, options) => {
		toastCore(title, Object.extend({}, {
			image: '/static/images/warn.png'
		}, options || {}))
	},
	error: function (title, options) {
		toastCore(title||'操作失败', Object.extend({},defOptions, {
			image: '/static/images/error.png'
		}, options || {}))
	},
	modal:(content, options) =>{
		options = options || {}
		if(Object.isFunction(options)){
			options={
				confirm:{
					callback:options
				}
			}
		}
		var cancel = options.cancel||false,
			confirm=options.confirm||true

		options = options || {}
		options.content = content
		if(cancel===false){
			options.showCancel = false
		}
		else if (Object.isString(cancel)) {
			options.showCancel = true
			if (options.cancel.startWith('#')) {
				options.cancelColor = cancel
			}
			else {
				options.cancelText = cancel
			}
		} 
		else if (Object.isFunction(cancel)) {
			options.showCancel = true
			cancel={
				callback : cancel
			}
		}
		else if (cancel === true) {
		}
		else{
			options.showCancel = true
			cancel.color && (options.cancelColor = cancel.color)
			cancel.text && (options.cancelText = cancel.text)
		}
		if(confirm===false){
			options.showConfirm=false,
			options.confirmText=''
		}
		else if(Object.isString(confirm)){
			if (options.confirm.startWith('#')) {
				options.confirmColor = confirm
			}
			else {
				options.confirmText = confirm
			}
		} 
		else if (Object.isFunction(confirm)) {
			confirm = {
				callback: confirm
			}
		}
		else if(confirm===true){

		}
		else{
			options.showConfirm = true
			confirm.color && (options.confirmColor = confirm.color)
			confirm.text && (options.confirmText = confirm.text)
		}
		delete options.cancel
		delete options.confirm
		options.success = (res)=>{
			if(res.cancel){
				cancel.callback && cancel.callback(res)
			}
			else{
				confirm.callback && confirm.callback(res)
			}
		}
		console.log(Object.extend({}, defOptions, options));
		wx.showModal(Object.extend({},defOptions,options))
	},
	sheets:(callbacks,color)=>{
		var items=[]
		for (var x in callbacks){
			items.push(x)
		}
		wx.showActionSheet({
			itemList: items,
			itemColor: color ||'#F1A23B',
			success: function(res) {
				var key = items[res.tapIndex]
				callbacks && callbacks[key] && callbacks[key](res.tapIndex,key) 
			},
		})
	}
}