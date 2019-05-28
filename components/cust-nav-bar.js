// components/cust-nav-bar.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		horizontal:{
			type:String,
			value:'center'
		},
		height:{
			type:Number,
			value:app.systemInfo.navigateBarHeight,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusHeight: app.systemInfo.statusBarHeight,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	},
	lifetimes: {
		// ready() {
		// 	app.getSystemInfo(res => {
		// 		this.setData({
		// 			statusHeight: res.statusBarHeight,
		// 			height:res.navigateBarHeight,
		// 		})
		// 	})
		// },
	},
})
