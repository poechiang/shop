// components/delay-loading.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		empty: {
			type: [Boolean,String],
			value: false
		},
		ended: {
			type: [Boolean,String],
			value: false
		},
		display:{
			type:String,
			value:'block'
		},
		height:{
			type:Number,
			value:25
		}
	},

	/**
	 * 组件的初始数据
	 */


	/**
	 * 组件的初始数据
	 */
	data: {
		currentTab: null,
	},
	options: {
		addGlobalClass: true,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
