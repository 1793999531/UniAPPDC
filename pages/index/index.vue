<template>
	<!-- 菜单轮播图 -->
	<view class="slider">
	  <swiper autoplay indicator-dots circular>
	    <swiper-item class="swiper_item" item-id="" v-for="(item,index) in swiperList" v-key="index">
	      <image class="" :src="'https://www.lpllfd.cn/static/dingcan/'+item.img" :data-item="item.name" mode="widthFix">
	      </image>
	
	    </swiper-item>
	  </swiper>
	</view>
	<block v-if="condition">
	<!--菜品详细信息-->
	<view class="menu_wrap">
	  <view class="food_wrap"  v-for="(item,index) in swiperList" v-key="index">
	
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
	      <button bindtap="reduce" :data-index="index" class="reduce" size="mini">-</button>
	      <input class="foodNum" :data-foodNum="foodNum" style="width: 40px;" :value="foodNum[index].foodNum" />
	      <button bindtap="plus" :data-index="index" class="plus" size="mini">+</button>
	    </view>
	  </view>
	
	</view>
	</block>
	<view v-else>加载中...</view>
	<!--确定订单按钮-->
	<button bindtap = "submitOrder">确定订单</button>
	
	<!--版本信息-->
	<view class="copyright">
	  <text class="cr" selectable="false" space="false" decode="false">
	    @copyrightHXZ
	  </text>
	</view>
</template>

<script>
	//获取应用实例
	const app = getApp()
	//import regeneratorRuntime from '../../utils/runtime.js'
	let common = require("../../static/libs/api.js")
	export default {
		data() {
			return {
				swiperList: [],
				foodNum: [],
				userInfo: "",
				foodSelectRecord: [],
				orderUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=order',
				orderFlagUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=orderFlag',
				usersUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=users',
				total:0,
				foodSequenceFlag:0, //食物顺序标记
				condition:false
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
		  if (app.globalData.userInfo) {
		    this.setData({
		      userInfo: app.globalData.userInfo,
		    })
		    console.log(this.data.userInfo)
		    this.getFoodNum()
		  } else {
		    app.userInfoReadyCallback = res => {
		      this.setData({
		        userInfo: app.globalData.userInfo,
		      })
		      console.log('callback')
		      this.getFoodNum()
		    }
		  }
		  this.getSwiperList()
		
		},
		
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {
		  this.getFoodNum();
		  let that = this
		    that.setData({
		      condition:true
		    })
		},
		methods: {
			//减少菜品数量
			reduce: function (e) {
			  let curIndex = e.currentTarget.dataset.index
			  if (this.data.foodNum[curIndex].foodNum != 0) {
			    let that = this;
			    let arrIndex = "foodNum[" + curIndex + "].foodNum"
			    this.setData({
			      [arrIndex]: that.data.foodNum[curIndex].foodNum - 1
			    })
			  }
			},
			
			//增加菜品数量
			plus: function (e) {
			  //console.log("plus")
			
			  let that = this;
			  let curIndex = e.currentTarget.dataset.index
			  // console.log(that.data.foodNum)
			  // console.log(curIndex)
			  // console.log(that.data.foodNum[1].foodNum + 1)
			  let arrIndex = "foodNum[" + curIndex + "].foodNum"
			  that.setData({
			    [arrIndex]: that.data.foodNum[curIndex].foodNum + 1
			  })
			},
			//获得轮播图列表
			getSwiperList: function () {
			  wx.request({
			    url: "https://www.lpllfd.cn/dingcan?coll=dingcanDB&doc=menu",
			    success: (res) => {
			      console.log(this.data.foodNum)
			      console.log("获得轮播图列表")
			      let that = this;
			     let swiperList = res.data
			      let len = res.data.length
			     // console.log(len)
			      console.log("aaaaaaaaaaaaaa")
			      console.log(res.data)
			      if (len != 0) {
			        if (res.statusCode == 200) {
			          that.setData({
			            swiperList: swiperList
			          })
			        }
			        for (var i = 0; i < len; i++) {
			          var temp = {
			            id: swiperList[i].id,
			            imgSrc:swiperList[i].img,
			            name: swiperList[i].name,
			            price: swiperList[i].Price,
			            foodNum: null,
			            userName: this.data.userInfo.nickName,
			            foodSequenceFlag:this.data.foodSequenceFlag+1
			          }
			          this.data.foodNum.push(temp)
			        }
			        
			      }
			      console.log("获得轮播图列表结束")
			    }
			  })
			
			},
			getFoodNum: function () {
			  let that = this;
			  let foodNum = common.wxRequest("get", this.data.orderUrl + '&userName=' + this.data.userInfo.nickName, null)
			  foodNum.then(function (res) {
			    console.log("获得食物数量信息")
			    console.log(res)
			    let len = res.data.length
			    let temp = that.data.foodNum
			      for(var i=0;i<temp.length;i++){
			        let temp2 = "foodNum[" + i + "].foodNum"
			        that.setData({
			          [temp2]:null
			        })
			      }
			    if (len != 0) {
			      
			      for (var i = 0; i < len; i++) {
			        let selectedFoodId = res.data[i].id //已选择购买的食物id
			        let arrIndex = "foodNum[" + (selectedFoodId - 1) + "].foodNum"
			        that.setData({
			          [arrIndex]: res.data[i].foodNum
			        })
			      }
			    }
			    console.log(that.data.foodNum)
			    console.log("获得食物数量结束")
			  })
			},
			submitOrder: function () {
			  let that = this;
			  var userName = this.data.userInfo.nickName
			  console.log("submit")
			  let swiperList = this.data.swiperList
			  console.log(swiperList)
			  let userNameData = {
			    "userName": userName
			  }
			  common.wxRequest("post", this.data.orderFlagUrl + '&userName=' + userName, userNameData)
			  for (var i = 0; i < swiperList.length; i++) {
			    let curFoodNum = this.data.foodNum[i].foodNum//当前菜品是否已选择购买数量
			    console.log(i + ":" + curFoodNum)
			    
			    if (curFoodNum != null &&curFoodNum!=0) {
			      console.log("common:"+app.globalData.total)
			      app.globalData.total+=swiperList[i].price*curFoodNum
			      //查询菜品是否已存在
			
			      var foodData = {
			        id: swiperList[i].id,
			        imgSrc:"https://www.lpllfd.cn/static/dingcan/"+ swiperList[i].img,
			        name: swiperList[i].name,
			        price: swiperList[i].Price,
			        foodNum: curFoodNum,
			        userName: this.data.userInfo.nickName
			      }
			      console.log(foodData)
			      common.wxRequest("post", this.data.orderUrl + '&userName=' + userName+"&id="+swiperList[i].id, foodData,function(res){
			        console.log(res)
			      })
			
			    } else if (curFoodNum == 0) {//查询菜品是否已存在,存在就删除
			      common.wxRequest("delete",this.data.orderUrl+'&userName=' + userName+"&id="+swiperList[i].id,null,function(){
			        console.log('delete')
			      })
			    }
			  }
			  wx.showToast({
			    title: '添加成功',
			    duration: 1500,
			  });
		}
	}
}
</script>

<style>
page{
  padding: 5rpx;
}

.slider{
  margin-top: 10rpx;
}
.menu_wrap{
  flex-wrap: wrap;
  margin-top: 10rpx;
}
.food_wrap{
  width: 50%;
  display: inline-block;
  padding: 10rpx;
  margin-top: 10rpx;
}
.foodCount{
  display: flex;
}
.reduce,.plus{
  display: flex;
  flex: 1;
}
.foodNum{
  display: flex;
  flex: 3;
}
.food_wrap image{
  width: 320rpx;
}
.foodPrice,.foodName{
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm_wrap{
  margin-top: 10rpx;
}


</style>
