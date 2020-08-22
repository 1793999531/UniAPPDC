<template>
	<view>
		<!--index.wxml-->
		<view class="container">
		  <view class="userinfo">
		    <button v-if="!hasUserInfo && canIUse" open-type="getUserInfo" @click="getUserInfo()"> 微信登陆 </button>
		    <block v-else>
		      <image bindtap="bindViewTap" class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover"></image>
		      <text class="userinfo-nickname">用户名：{{userInfo.nickName}}</text> 
		    </block>  
		  </view>
		  <view class="userInfo_wrap">
		     <view class="address">我的地址:<input v-model="userAddress" :disabled="modifyDataAble"></input></view>
		    <view>我的电话:<input v-model="userPhone" maxlength="11" :disabled="modifyDataAble"></input></view>
		  </view>
		</view>
		<button v-if="modifyDataButText=='确定'" @click = "getLocation()">定位</button>
		<button  @click= "modifyData()" :data-item="userAddress" style="margin-top: 20rpx;"> {{modifyDataButText}} </button>
	</view>
</template>

<script>
	//获取应用实例
	const app = require("../../static/libs/wxApi.js")
	console.log(app)
	app.onLaunch()
	import regeneratorRuntime from '../../static/libs/runtime.js'
	var QQMapWX = require('../../static/libs/qqmap-wx-jssdk.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				usersUrl: 'https://www.lpllfd.cn/dingcan?coll=wxDB&doc=users',
				modifyDataAble:true,  //是否可以编辑资料
				modifyDataButText:'点击编辑资料',
				userAddress: '',
				userPhone: '',
				userInfo: {},
				hasUserInfo: false,
				canIUse: true,
				address:""
			}
		},
		methods: {
			//事件处理函数
			bindViewTap () {
			  wx.navigateTo({
			    url: '../logs/logs'
			  })
			},
	
			reload(){
			  console.log("reload")
			  //this.onReady()
			},
			getLocation(){
			  let that = this
			  wx.chooseLocation({
			    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			    success (res) {
			      const latitude = res.latitude
			      const longitude = res.longitude
			      console.log(res)
			        that.userAddress=res.name
			   
			   //    wx.openLocation({
			   //      latitude,
			   //      longitude,
			   //      scale: 18
			   //    })
			    },
				fail (res) {
					console.log('fail:',res)
				}
			   })
			},
			getUserInfo (e) {
				app.onLaunch()
			},
			//用户点击修改资料或确定按钮
			modifyData() {
			  let that = this
			  console.log(this.modifyDataButText)
			  if(that.modifyDataButText=='确定'){
			      this.modifyDataAble=true
			      this.modifyDataButText='点击修改资料'
			    console.log(that.userAddress)
			    var data={
			     name: that.userInfo.nickName,
			      phone: that.userPhone,
			      address: that.userAddress
			    } 
			    that.wxRequest("get",this.usersUrl+'&userName='+that.userInfo.nickName,null,function(res){
			      console.log(res.data.length)
			      if(res.data.length!=0){
					  console.log('record 1 ---',data)
			        that.wxRequest("put",that.usersUrl+'&userName='+that.userInfo.nickName,data,null)
			      }else{
			        that.wxRequest("post",that.usersUrl,data)
			      }
			    })
			    wx.showToast({
			      title: '修改成功',
			      duration: 1500,
			      mask: false,
			    });
			  }else{
			      this.modifyDataAble=false
			      this.modifyDataButText='确定'
			  }
			  
			  
			},
			getMongoData(){
			  let that = this
			  //获取当前登录的用户信息
			  // console.log(this.usersUrl,'--------aa')
			  let curUserInfo=that.wxRequest("get",this.usersUrl+'&userName='+this.userInfo.nickName,null)
			  // console.log(typeof(curUserInfo))
			  curUserInfo.then(function(obj){
				  console.log('--------22')
			    console.log(obj)
			    console.log(obj.data.length)
			    if(obj.data.length!=0){
			        that.userAddress=obj.data[0].address
			        that.userPhone= obj.data[0].phone
			    }
			  })
			  
			}
			
		},
			onLoad(options) {
				console.log('user.vue onLoad') 
				this.$store.dispatch('getUserInfo')
			  /*判断是第一次加载还是从position页面返回
			  如果从position页面返回，会传递用户选择的地点*/
			  if (options.address != null && options.address != '') {
			    //设置变量 address 的值
			      this.address= options.address
			  } else {
			    // 实例化API核心类
			    qqmapsdk = new QQMapWX({
			      //此key需要用户自己申请
			      key: 'UA5BZ-G3V6D-6HB4M-PW5M4-JBOEE-B7BI6'
			    });
			    var that = this;
			    // 调用接口
			    qqmapsdk.reverseGeocoder({
			      success: function (res) {
			          that.address=res.result.address
			      },
			      fail: function (res) {
			        //console.log(res);
			      },
			      complete: function (res) {
			        //console.log(res);
			      }
			    });
			  }
					// console.log('---------a',this.$store.state.userInfo)	
			  if (this.$store.state.userInfo) {
				  console.log('---------b')	
			      this.userInfo= this.$store.state.userInfo,
			      this.hasUserInfo= true
			    console.log(this.userInfo.nickName)
			  }else {
			    // 在没有 open-type=getUserInfo 版本的兼容处理
			    wx.getUserInfo({
			      success: res => {
					  console.log('---------d')	
					  console.log(res)
			        this.$store.state.userInfo = res.userInfo
			          this.userInfo= res.userInfo
			          this.hasUserInfo= true
			      }
			    })
			  }
			  this.getMongoData()
			}
	}
</script>
	
<style>
/**index.wxss**/
page{
  padding: 10rpx;
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 200px;
}
.userInfo_wrap{
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 50rpx;
  flex-direction: column;
}
.userInfo_wrap input{
  display: inline-block;
  
  margin-left: 30rpx;
}
.userInfo_wrap view{
  
  display: flex;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
</style>
