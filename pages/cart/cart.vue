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
				<view class="delBut_wrap"> <button class="delBut" @click="del(index)" :data-id="item.id" 
					 size="mini">删除</button></view>
			</view>
		</view>
		<view class="footer_wrap">
			<button class="pay" @click="pay()" size="mini">去支付</button>
			<button class="cancel" @click="cancelOrder()" size="mini">取消订单</button>
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
			del(index) {
				let that = this
				that.$store.state.menu[index].num = '';
				//更新支付金额
				that.$store.dispatch('countTotal')
				
			},
			//支付
			pay() {
				let that = this
				let id; //数据库中已购买的订单长度
				let userFoodInfo = that.userFoodInfo;
				let flag = false;
				// console.log("pay-----")
				// console.log(that.URInfo)
				for(let item of that.$store.state.menu){
					if(item.num!==''){
						flag = true;
					}
				}
				
				if (this.userInfo) {
					if (that.URInfo.length == 0) {
						wx.showToast({
							title: '你还未填写地址',
							duration: 1500,
						});

					} else if (!flag) {
						wx.showToast({
							title: '你还未选取菜品',
							duration: 1500,
						});
					} else {
						that.wxRequest("get", that.baseUrl+"?coll=houtaiOrder&doc=account", null, function(res) {
							console.log(res)
							if (res.data.length != 0) {
								id = res.data.length
							} else {
								id = 0
							}
							console.log("-------c:" + that.$store.state.total)
							console.log(that.URInfo)
							var recData = {
								name: that.URInfo.name,
								address: that.URInfo.address,
								phone: that.URInfo.phone,
								priTotal: that.$store.state.total,
								id: id + 1 + ""
							}
							console.log(recData)
							
							console.log("------------aaa")

							if (id == 0) {
								id = 1;
							} else {
								id = id + 1;
							}
							
							console.log(that.$store.state.menu)
							//把所买菜品post进数据库
							for (var i = 0; i < that.$store.state.menu.length; i++) {
					
								// console.log(that.$store.state.menu[i].num!=='',that.$store.state.menu[i].num)
								if(that.$store.state.menu[i].num!==''){
									var recOrder = {
										imgUrl: that.$store.state.menu[i].img,
										foodName: that.$store.state.menu[i].name,
										foodPrice: that.$store.state.menu[i].price,
										foodNum: that.$store.state.menu[i].num,
										flag: i + 1,
										id: id + ""
									};
									
									((i)=>{
										console.log(i)
										common.wxRequest("post", that.baseUrl+"?coll=houtaiOrder&doc=order", recOrder, function(res) {
											// console.log("insert to order")
											//console.log(that.$store.state.menu,i)
											//console.log(that.$store.state.menu[i],that.$store.state.menu[i].num)
											that.$store.state.menu[i].num = ''
											wx.showToast({
												title: '支付成功',
												duration: 1500,
											});
										})
									})(i)
									
								}
								
							}
							common.wxRequest("post", that.baseUrl+"?coll=houtaiOrder&doc=account", recData, function(res) {
								console.log("insert to account")
							})
							that.$store.state.total = 0;
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
			cancelOrder: function () {
				var flag = false;
			  for(var item of this.$store.state.menu){
				  if(item.num!==''){
					  item.num = ''
					  flag = true;
				  }
				  
			  }
				if(flag){
					this.$store.dispatch('countTotal')
					wx.showToast({
					  title: '已取消',
					  duration: 1500,
					});
				}
			}

		},
		computed: {
			userFoodInfo() {
				return this.$store.state.menu
			},
			getTotal() {
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
			// console.log("onshow")
			 let that = this
			 //获取用户注册信息
			 common.wxRequest("get", that.usersUrl + "&userName=" + that.userInfo.nickName, null, function (res) {
			   console.log(res)
			   if(res.data[0].address!=""&&res.data[0].phone!=""){
			       that.URInfo= res.data[0]
			   }
			   
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
	
	.delBut_wrap>.delBut{
		padding: 0 10rpx;
		font-size: 30rpx;
		background-color: red;
		color: white;
	}
/* 	.food_wrap>.pay{
		width:150rpx;
		font-size: 31rpx;
		padding: 0;
	}
	.food_wrap>.cancel{
		width:200rpx;
		font-size: 31rpx;
		padding: 0;
	} */
	.footer_wrap {
		display: flex;
		margin-top: 30rpx;
	}
</style>
