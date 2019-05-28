// components/tab-bar.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		hasFav: {
			type: Boolean,
			value: false
		},
		shadow: {
			type: Boolean,
			value: true
		},
		align: {
			type: String,
			value: 'stretch'
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		height:app.systemInfo.tabBarHeight
	},
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		handleFav() {
			this.triggerEvent('fav', {}, {})
		},
		handleMsg(){
			this.triggerEvent('msg', {}, {})
		}
	}
})
