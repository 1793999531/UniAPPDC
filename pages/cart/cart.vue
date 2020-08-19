<template>
	<view class="box_wrap" hover-class="none" hover-stop-propagation="false">
		<view class="title">已点菜式</view>
		<view class="food_wrap">
			<view class="foodId">#</view>
			<view class="foodImg">图片</view>
			<view class="foodName">名字</view>
			<view class="foodPrice">价格</view>
			<view class="foodNum">数量</view>
			<view class="delBut_wrap">删除</view>
		</view>
		<view hover-class="none" hover-stop-propagation="false" v-for="(item,index) in userFoodInfo" :key="index">
			<view class="food_wrap" v-if="item.num!==''">
				<view class="foodId">{{index+1}}</view>
				<image class="foodImg" :src="'https://www.lpllfd.cn/static/dingcan/'+item.img"></image>
				<view class="foodName">{{item.name}}</view>
				<view class="foodPrice">{{item.price}}</view>
				<view class="foodNum">{{item.num}}</view>
				<view class="delBut_wrap"> <button class="delBut" bindtap="del" :data-id="item.id" style="font-size: 30rpx;background-color: red;color: white;"
					 size="mini">删除</button></view>
			</view>
		</view>
		<view class="footer_wrap">
			<button @click="pay()" style="width:150rpx;font-size: 31rpx;" size="mini">去支付</button>
			<button @click="cancelOrder()" style="width:200rpx;font-size: 31rpx;" size="mini">取消订单</button>
			需支付：{{getTotal}}￥
		</view>
	</view>
</template>

<script>
	//获取应用实例
	let common = require("../../static/libs/api.js")
	export default {
		data() {
			return {
				userInfo: "",
				URInfo: "", //用户注册时的信息
				orderUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=order',
				orderFlagUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=orderFlag',
				usersUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=users',
				baseUrl: 'https://www.lpllfd.cn/dingcan'
			}
		},
		methods: {
			//删除菜品函数
			del: function(e) {
				let that = this
				let curId = e.currentTarget.dataset.id
				console.log(e.currentTarget.dataset.id)
				common.wxRequest("delete", that.orderUrl + "&userName=" + that.userInfo.nickName + "&id=" + curId, null,
					function(res) {
						console.log(res.data)
						that.getUserFoodInfo()
					})
			},
			//支付
			pay() {
				let that = this
				let id; //数据库中已购买的订单长度
				let userFoodInfo = that.userFoodInfo;
				console.log("pay-----")
				console.log(that.URInfo)
				if (this.userInfo) {
					if (that.URInfo.length == 0) {
						wx.showToast({
							title: '你还未填写地址',
							duration: 1500,
						});

					} else if (userFoodInfo == "") {
						wx.showToast({
							title: '你还未选取菜品',
							duration: 1500,
						});
					} else {
						common.wxRequest("get", that.baseUrl+"?coll=houtaiOrder&doc=account", null, function(res) {
							console.log(res)
							if (res.data.length != 0) {
								id = res.data.length
							} else {
								id = 0
							}
							console.log("-------c:" + id)
							console.log(that.URInfo)
							var recData = {
								name: that.URInfo.name,
								address: that.URInfo.address,
								phone: that.URInfo.phone,
								priTotal: that.total,
								id: id + 1 + ""
							}
							console.log(recData)
							common.wxRequest("post", that.baseUrl+"?coll=houtaiOrder&doc=account", recData, function(res) {
								console.log("insert to order")
							})
							console.log("------------aaa")

							if (id == 0) {
								id = 1;
							} else {
								id = id + 1;
							}
							console.log("-------b:" + id)
							console.log(userFoodInfo)
							//把所买菜品post进数据库
							for (var i = 0; i < userFoodInfo.length; i++) {
								var recOrder = {
									imgUrl: userFoodInfo[i].imgSrc,
									foodName: userFoodInfo[i].name,
									foodPrice: userFoodInfo[i].price,
									foodNum: userFoodInfo[i].foodNum,
									flag: i + 1,
									id: id + ""
								}
								console.log("--------")
								console.log(recOrder)
								common.wxRequest("post", that.baseUrl+"?coll=houtaiOrder&doc=order", recOrder, function(res) {
									console.log("insert to order")
									common.wxRequest("delete", that.orderUrl + "&userName=" + that.userInfo.nickName +
										"&delAll=true", null,
										function(res) {
											console.log("delete")
										})
									// that.getUserFoodInfo()
									wx.showToast({
										title: '支付成功',
										duration: 1500,
									});
								})
							}
						})
					}
				} else {
					wx.showToast({
						title: '你还未登录',
						duration: 1500,
					});
				}

			},
			//取消订单
			// cancelOrder: function () {
			//   console.log(this.userInfo)
			//   if (this.userFoodInfo) {
			//     common.wxRequest("delete", this.orderUrl + "&userName=" + this.userInfo.nickName + "&delAll=true", null, function (res) {
			//       console.log(res)
			//     })
			//     this.getUserFoodInfo()
			//     wx.showToast({
			//       title: '已取消',
			//       duration: 1500,
			//     });
			//   }

			// }

		},
		computed: {
			userFoodInfo() {

				setTimeout(() => {
					console.log('computed', this.$store.state.menu)

				}, 1500)
				return this.$store.state.menu
			},
			getTotal() {


				console.log('hhhaaa---', this.$store.state.total)

				return this.$store.state.total


			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {

			console.log("cart.vue onLoad")
			var that = this;
			if (this.$store.state.userInfo) {
				console.log('---------b')
				this.userInfo = this.$store.state.userInfo,
				console.log(this.userInfo.nickName)
			} else {
				wx.getUserInfo({
					success: res => {
						this.userInfo = res.userInfo
					}
				})
			}

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			// setTimeout(() => {
			// 	console.log('onShow', this.$store.state.menu)
			// }, 1500)


			// app.globalData.total2 += 5
			// this.getUserFoodInfo()

			 let that = this
			 //获取用户注册信息
			 common.wxRequest("get", that.usersUrl + "&userName=" + that.userInfo.nickName, null, function (res) {
			   console.log(res)
			   if(res.data[0].address!=""&&res.data[0].phone!=""){
			       that.URInfo= res.data[0]
			   }
			   console.log("onshow")
			   console.log(that.URInfo)
			 })
		}
	}
</script>


<style>
	page {
		padding: 5rpx;
	}

	.title {
		font-size: 55rpx;
		height: 120rpx;
		background-color: #6aa;
	}

	.food_wrap {
		margin-top: 30rpx;
		display: flex;
	}

	.title,
	.foodId,
	.foodImg,
	.foodName,
	.foodPrice,
	.foodNum,
	.delBut_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.food_wrap>.foodImg {
		flex: 4;
		height: 100rpx;
		border-radius: 100rpx;
	}

	.food_wrap>.foodId {
		flex: 1;
	}

	.food_wrap>.foodName {
		flex: 2;
	}

	.food_wrap>.foodPrice {
		flex: 2;
	}

	.food_wrap>.foodNum {
		flex: 2;
	}

	.food_wrap>.delBut_wrap {
		flex: 2;
	}

	.footer_wrap {
		display: flex;
		margin-top: 30rpx;
	}
</style>
