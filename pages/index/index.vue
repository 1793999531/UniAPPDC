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
			<view class="copyright">
				<text class="cr" selectable="false" space="false" decode="false">
					@copyrightHXZ
				</text>
			</view>
		
	</view>
</template>

<script>
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
			//减少菜品数量
			reduce(index) {
				this.$store.dispatch('wxLogin')
				var num = this.$store.state.menu[index].num 
				console.log(num,num !== '')
				if (num=== 1) {
						this.$store.state.menu[index].num = ''
				}else if(num !== ''){
					this.$store.state.menu[index].num--
				}
				this.$store.dispatch('countTotal')
			},
			//增加菜品数量
			plus(index) {
				this.$store.state.menu[index].num++
				this.$store.dispatch('countTotal')
			}
		},
		computed: {
			swiperList() {
				// console.log('---computed', this.$store.state.menu)
				return this.$store.state.menu
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function(options) {
			console.log("index.vue onload -----")
			this.$store.dispatch('getSwiperList')
			
			this.wxRequest()
			
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
