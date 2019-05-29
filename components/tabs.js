// components/tabs.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		items: {
			type: Array,
			value: [],
		},
		key: {
			type: String,
			value: ''
		},
		height: {
			type: Number,
			value: 40
		},
		currentIndex: {
			type: Number,
			value: -1,
		},
		top: {
			type: Number,
			value: 0,
		},
		dock: {
			type: Boolean,
			value: true,
		},
		width: {
			type: String,
			value: '100%'
		},
		shadow: {
			type: Boolean,
			value: true
		},
		align: {
			type: String,
			value: 'stretch'
		},
		space: {
			type: Number,
			value: 5
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		currentTab: null,
		dockTop: -40,
		isFixed: false,
	},
	options: {
		addGlobalClass: true,
		multipleSlots: true,
		
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		handleTabToggle: function (e) {
			var index = e.target.dataset.index
			if (index == this.data.currentIndex) {
				return
			}
			var tab = this.data.items[index]
			this.setData({
				currentIndex: index,
				currentTab: tab
			})
			this.triggerEvent('change', { index: index, tab: tab }, {})
		}
	},

	lifetimes: {
		ready() {
			if(this.properties.dock){
				
				var winHeight = app.systemInfo.windowHeight,
					top = this.properties.top
				var page = app.pages.current(),
					handler=app.pages.current().onPageScroll
				
				page.onPageScroll = e=>{
					var fixed = this.properties.isFixed,
						dockTop = this.data.dockTop
					if (!fixed && e.scrollTop > winHeight) {
						console.log(1)
						this.setData({
							isFixed: true,
						})
					}
					if (dockTop < 0 && e.scrollTop > winHeight * 2) {
						console.log(2)
						this.setData({
							dockTop: top
						})
					}

					if (dockTop >= 0 && e.scrollTop < winHeight * 2) {
						console.log(3)
						this.setData({
							dockTop: -40
						})
					}

					if (fixed && e.scrollTop < winHeight) {
						console.log(4)
						this.setData({
							isFixed: false,
						})
					}

					setTimeout(()=>{
						handler.call(page,e)
					},0)

				}
			}
			
		}
	}
})
