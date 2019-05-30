// components/tab-bar.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
	properties: {
		visible: {
			type: Boolean,
			value: true
		},
		type: {
			type: String,
			value: "good"
		},
		curr: {
			type: Number,
			value: 0
		},
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
		height: app.systemInfo.tabBarHeight,
		icons: [{
			unsel: "https://res.shibu365.com/i/2019-05-28/da9109c54bc34cb9a41f848b8cd8eeb0.png",
			sel: "https://res.shibu365.com/i/2019-05-28/452a812330644937afa7e7d471e53850.png",
			path: '/pages/index/index',
		}, {
			unsel: "https://res.shibu365.com/i/2019-05-28/06c9760bf4fd413081dc1461fc0d6375.png",
			sel: "https://res.shibu365.com/i/2019-05-28/9e548d178ee0432e927dd0f655bf1cd8.png",
			path: '/pages/task/index',
		}, {
			unsel: "https://res.shibu365.com/i/2019-05-28/bcd75f7d380944b6a22f982ee483be3f.png",
			sel: "https://res.shibu365.com/i/2019-05-28/8afac3748d9f411aa8ab496656ecf66e.png",
			path:'/pages/circle/index',
		}, {
			unsel: "https://res.shibu365.com/i/2019-05-28/9ccdaa484b4c447db862120f65937687.png",
			sel: "https://res.shibu365.com/i/2019-05-28/daa821552d154082974af8016b71799d.png",
			path:'/pages/user/index'
		}],
		addnew: "https://res.shibu365.com/i/2019-05-28/c595dc6e068e4a2e8206bf931b8abf19.png"
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
		handleMsg() {
			this.triggerEvent('msg', {}, {})
		},
		handleNavTabTap(e) {
			wx.switchTab({
				url: this.data.icons[e.target.dataset.index].path,
			})
			this.triggerEvent('page-nav', { curr: e.target.dataset.index }, {})
		},
		handleAddNew() {
			this.triggerEvent('add-new', {}, {})
			wx.navigateTo({
				url: '/pages/circle/post',
				success: function(res) {},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	}
})