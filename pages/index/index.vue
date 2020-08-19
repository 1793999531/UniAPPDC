<template>
	<view>
		<!-- 菜单轮播图 -->
		<view class="slider">
			<swiper autoplay indicator-dots circular>
				<swiper-item class="swiper_item" item-id="" v-for="(item,index) in swiperList" :key="index">
					<image class="" :src="'https://www.lpllfd.cn/static/dingcan/'+item.img" :data-item="item.name" mode="widthFix">
					</image>

				</swiper-item>
			</swiper>
		</view>
		<block v-if="condition">
			<!-- aa{{getTotal()}} -->
			<!--菜品详细信息-->
			<view class="menu_wrap">
				<view class="food_wrap" v-for="(item,index) in swiperList" :key="index">

					<view class="image_wrap">
						<image class="" :src="'https://www.lpllfd.cn/static/dingcan/'+item.img" mode="widthFix"></image>
					</view>
					<view class="foodInfo">
						<view class="foodName">
							{{item.name}}
						</view>
						<view class="foodPrice">
							价格：{{item.price}}
						</view>
					</view>

					<view class="foodCount">
						<button @click="reduce(index)" :data-index="index" class="reduce" size="mini">-</button>
						<input class="foodNum" :data-foodNum="foodNum" :value="item.num" />
						<button @click="plus(index)" :data-index="index" class="plus" size="mini">+</button>
					</view>

				</view>

			</view>
		</block>
		<view v-else>加载中...</view>
		<!--确定订单按钮-->
		<!-- 	<button @click = "submitOrder">确定订单</button> -->

		<!--版本信息-->
		<view class="copyright">
			<text class="cr" selectable="false" space="false" decode="false">
				@copyrightHXZ
			</text>
		</view>
	</view>
</template>

<script>
	//获取应用实例
	const app = require("../../static/libs/wxApi.js")

	//import regeneratorRuntime from '../../utils/runtime.js'
	let common = require("../../static/libs/api.js")
	export default {
		data() {
			return {
				foodNum: [],
				userInfo: "",
				foodSelectRecord: [],
				orderUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=order',
				orderFlagUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=orderFlag',
				usersUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=users',
				total: 0,
				foodSequenceFlag: 0, //食物顺序标记
				condition: false
			}
		},
		methods: {
			getTotal() {
				console.log("gettotal index ---")
				// var tatol = ''
				// console.log(this.$store.state.menu[0].price)
				// for(var i in this.$store.state.menu){
				// 	//console.log(this.$store.state.menu[i].price)
				// 	tatol+=this.$store.state.menu[i].num*this.$store.state.menu[i].price
				// }
				// return 'tatol'


			},
			//减少菜品数量
			reduce(index) {
				this.$store.dispatch('countTotal')
				if (this.$store.state.menu[index].num >= 1) {
					this.$store.state.menu[index].num--
				}
			},

			//增加菜品数量
			plus(index) {

				this.$store.state.menu[index].num++
				this.$store.dispatch('countTotal')
			},

			getFoodNum() {
				let that = this;
				let foodNum = common.wxRequest("get", this.orderUrl + '&userName=' + this.userInfo.nickName, null)
				foodNum.then(function(res) {
					console.log("获得食物数量信息")
					console.log(res)
					let len = res.data.length
					for (var i = 0; i < that.foodNum.length; i++) {
						//let temp2 = "foodNum[" + i + "].foodNum"
						that.foodNum[i] = null
						// that.setData({
						//   [temp2]:null
						// })
					}
					if (len != 0) {

						for (var i = 0; i < len; i++) {
							let selectedFoodId = res.data[i].id //已选择购买的食物id
							// let arrIndex = "foodNum[" + (selectedFoodId - 1) + "].foodNum"
							// that.setData({
							//   [arrIndex]: res.data[i].foodNum
							// })
							that.foodNum[selectedFoodId - 1] = res.data[i].foodNum
						}
					}
					console.log(that.foodNum)
					console.log("获得食物数量结束")
				})
			},
			submitOrder() {
				//   let that = this;
				//   var userName = this.userInfo.nickName
				//   console.log("submit")
				//   let swiperList = this.swiperList
				//   console.log(swiperList)
				//   let userNameData = {
				//     "userName": userName
				//   }
				//   common.wxRequest("post", this.orderFlagUrl + '&userName=' + userName, userNameData)
				//   for (var i = 0; i < swiperList.length; i++) {
				//     let curFoodNum = this.foodNum[i].foodNum//当前菜品是否已选择购买数量
				//     console.log(i + ":" + curFoodNum)

				//     if (curFoodNum != null &&curFoodNum!=0) {
				//       console.log("common:"+app.globalData.total)
				//       app.globalData.total+=swiperList[i].price*curFoodNum
				//       //查询菜品是否已存在

				//       var foodData = {
				//         id: swiperList[i].id,
				//         imgSrc:"https://www.lpllfd.cn/static/dingcan/"+ swiperList[i].img,
				//         name: swiperList[i].name,
				//         price: swiperList[i].Price,
				//         foodNum: curFoodNum,
				//         userName: this.userInfo.nickName
				//       }
				//       console.log(foodData)
				//       common.wxRequest("post", this.orderUrl + '&userName=' + userName+"&id="+swiperList[i].id, foodData,function(res){
				//         console.log(res)
				//       })

				//     } else if (curFoodNum == 0) {//查询菜品是否已存在,存在就删除
				//       common.wxRequest("delete",this.orderUrl+'&userName=' + userName+"&id="+swiperList[i].id,null,function(){
				//         console.log('delete')
				//       })
				//     }
				//   }
				wx.showToast({
					title: '添加成功',
					duration: 1500,
				});
			}
		},
		computed: {
			swiperList() {
				console.log('---computed', this.$store.state.menu)
				return this.$store.state.menu
			},
			cartNum() {
				console.log('fn  cartNum ---')
				this.$store.dispatch('getCartInfo')
				console.log(this.$store.state.cartInfo)
				if (this.$store.state.cartInfo != null) {
					return this.$store.state.cartInfo;
				} else {
					return ''
				}

			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function(options) {
			console.log("index.vue onload -----")
			console.log('hhh---', app)

			this.$store.dispatch('getSwiperList')
			// if (app.globalData.userInfo) {
			//   this.setData({
			//     userInfo: app.globalData.userInfo,
			//   })
			//   console.log(this.userInfo)
			//   this.getFoodNum()
			// } else {
			//   app.userInfoReadyCallback = res => {
			//     this.setData({
			//       userInfo: app.globalData.userInfo,
			//     })
			//     console.log('callback')
			//     this.getFoodNum()
			//   }
			// }
			//this.getSwiperList()

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getFoodNum();
			this.condition = true;
			console.log("index onshow---");
		}

	}
</script>

<style>
	page {
		padding: 5rpx;
	}

	.slider {
		margin-top: 10rpx;
	}

	.menu_wrap {
		flex-wrap: wrap;
		margin-top: 10rpx;
	}

	.food_wrap {
		width: 45%;
		display: inline-block;
		padding: 10rpx;
		margin-top: 10rpx;
	}

	.foodCount {
		display: flex;
	}

	.reduce,
	.plus {
		display: flex;
		flex: 1;
	}

	.foodNum {
		display: flex;
		flex: 3;
		width: 40px;
		text-align: center;
	}

	.food_wrap image {
		width: 320rpx;
	}

	.foodPrice,
	.foodName {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.confirm_wrap {
		margin-top: 10rpx;
	}
</style>
