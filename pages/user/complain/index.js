// pages/user/complain/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user:null,
		remark:'',
		reasons: [{
			reason: '发布不良信息',
			checked:false,
		}, {
			reason: '发布虚假内容',
			checked: false,
		}, {
			reason: '发布违法违规内容',
			checked: false,
		}, {
			reason: '强制交易或消费',
			checked: false,
		}, {
			reason: '恶意抵毁，诽谤、辱骂他人',
			checked: false,
		}],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.getStorage({
			key: 'jubao-data',
			success: res=> {
				this.setData({
					user:res.data
				})
			},
			fail: function(res) {
				app.ui.modal('数据读取异常，请稍后再试',{
					confirm:()=>{
						app.pages.goBack()
					}
				})
			},
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
	checkReason(e){
		let index=e.target.dataset.index
		let reasons = this.data.reasons
		reasons[index].checked = e.detail.value
		this.setData({
			reasons:reasons
		})
	},
	inputRemark(e){
		this.setData({
			remark:e.detail.value
		})
		console.log(this.data.remark)
	},
	/**
	 * 提交投诉结果
	 */
	submit(){
		let reasons=[]
		for(var x in this.data.reasons){
			if(this.data.reasons[x].checked){
				reasons.push(this.data.reasons[x].reason)
			}
		}
		let remark = this.data.remark
		if(reasons.length<=0 && !remark){
			app.ui.modal('请选择或输入投诉的原因，方便我们处理')
		}

		app.ui.modal('确定要提交对 '+this.data.user.nick +' 的投诉吗？',{
			cancel:true,
			confirm:{
				text:'提交',
				callback:()=>{
					app.http.request({
						url:'cst/user/complain',
						data:{
							uid:this.data.user.id,
							reasons:reasons,
							remark:remark,
						},
						done:rlt=>{
							if(rlt.status==1){
								app.ui.success('提交成功',{
									success:()=>{
										app.pages.goBack()
									}
								})
							}
							else{
								app.ui.modal(rlt.msg)
							}
						}
					})
				}
			}
		})

	}
})