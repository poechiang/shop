/**
 *  封装管理小程序页面栈
 */
var _pages = function () {

	var list = getCurrentPages()
	if (!list || list.length < 1) {
		return []
	}
	return list
}

module.exports = {
	pages: _pages,
	current: () => {
		var pages = _pages()
		if (!pages || pages.length < 1) {
			return null
		}
		return pages[pages.length - 1]
	},
	prev: () => {
		var pages = _pages()
		if (!pages || pages.length < 2) {
			return null
		}
		return pages[pages.length - 2]
	},
	goBack: (option) => {
		option = Object.extend({ delta: 1, refresh: true }, option || {})
		var pages = _pages()
		if (pages.length <= option.delta) {
			throw Error('超出当前页面栈最大回退深度')
		}
		var page = pages[pages.length - option.delta - 1];
		if (page && option.refresh === true) {
			// 如果在参数中指定返回上页时要求刷新，则：
			//	如果上一页存在方法refreshPage，则直接调用该方法
			//  否则调用onPullDownRefresh,如果没有则
			//	目标页面设置refreshOnShow开关，由目标页面在onshow方法中根据开关决定是否需要刷页面

			if (page.onPullDownRefresh) {
				page.onPullDownRefresh()
			}
			else if (page.refreshPage) {
				page.refreshPage()
			}
			else {
				page.setData({
					refreshOnShow: true
				})
			}
		}
		wx.navigateBack({
			delta: option.delta,
		})
	}
}