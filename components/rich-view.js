// components/htmler.js
var wxParse= require('./richview/wxParse.js').wxParse
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		content:{
			type:String,
			value: null,
			observer(newVal, oldVal, changePath) {
				if (newVal) {
					wxParse('rich', 'html', newVal, this, 5)
				}
			}
			
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
