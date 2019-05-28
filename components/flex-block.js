// components/flexblock.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		size:{
			type:Number,
			value:40
		},
		top:{
			type:String,
			value:'50%'
		},
		right:{
			type:String,
			value:'10rpx'
		},
		blocks:{
			type:Array,
			value:[]// none|trolley|post|top|share|del
		},
		trolley: {
			type: Number,
			value: 0
		},
		theme:{
			type:String,
			value:'dark'// light|dark
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},
	// options:{
	// 	addGlobalClass: true,
	// },
	
	//externalClasses: ['icon-trolley', 'icon-top', 'icon-post', 'icon-more'],
	/**
	 * 组件的方法列表
	 */
	methods: {
		handleBlockTap(e){
			switch (e.target.dataset.key) {
				case 'top':
					wx.pageScrollTo({
						scrollTop: 0,
						duration: 400,
					})
					break;
				case 'post':
					wx.navigateTo({
						url: '/pages/circle/post',
					})
					break;
				case 'trolley':
					wx.navigateTo({
						url: '/pages/shop/trolley',
					})
					break;
				default:
			}

		}
	}
})
