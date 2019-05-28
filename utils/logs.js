
module.exports={
	push(arg,group){
		group = group||'_list_'
		var list,logs = wx.getStorageSync('logs') || {_list_:[]}
		logs[group] = logs[group]||[]
		//list = logs[group]
		logs[group].unshift({dt:Date.now(),data:arg})
		wx.setStorageSync('logs', logs)
	},
	clear(){
		wx.setStorageSync('logs', {_list_:[]})
	}
}