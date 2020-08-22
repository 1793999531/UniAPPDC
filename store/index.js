import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		test:"hhh",
		menu:[],
		total:'',
		userInfo:'',
		total:0
		
	},
	actions:{
		
		//获得轮播图列表
		getSwiperList(context) {
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
			    console.log(loginRes.authResult);
			    // 获取用户信息
			    uni.getUserInfo({
			      provider: 'weixin',
			      success: function (infoRes) {
			        console.log('用户昵称为：' + infoRes.userInfo.nickName);
			      }
			    });
			  }
			});

			uni.showLoading({
			    title: '加载中'
			});
		  wx.request({
		    url: "https://www.lpllfd.cn/dingcan?coll=dingcanDB&doc=menu",
		    success: (res) => {
			 context.state.menu = res.data
		      let len = res.data.length
			  uni.hideLoading()
		    }
		  })
		
		},
		countTotal(context){
			// console.log('index.js countTotal fn')
			 var total=0;
			for(var i in context.state.menu){
				if(typeof context.state.menu[i].num =='number'){
					total+=context.state.menu[i].price*context.state.menu[i].num
				}
			}
			 context.state.total = total
		},
		getUserInfo(context){
			console.log('index.js getUserInfo fn ---')
				  // console.log(this.globalData)
				  // 展示本地存储能力
				  var logs = wx.getStorageSync('logs') || []
				  logs.unshift(Date.now())
				  wx.setStorageSync('logs', logs)
				  // 登录
				  wx.login({
				    success: res => {
				      // 发送 res.code 到后台换取 openId, sessionKey, unionI
					  console.log('wx.login suc :' , res)
				    }
				  })
				  // 获取用户信息
				  wx.getSetting({
				    success: res => {
						
				      if (res.authSetting['scope.userInfo']) {
				        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				        wx.getUserInfo({
				          success: res => {
				            console.log('wx.getSetting suc :' , res)
				            // 可以将 res 发送给后台解码出 unionId
				            context.state.userInfo = res.userInfo
	
				          }
				        })
				      }
				    },
					fail: res => {
						console.log('wx.getSetting fail :' , res)
					}
				  })
		},
		wxLogin(context){
			
		},
		wxLoginTest(){
			uni.login({
			  // provider: 'weixin',
			  success: function (loginRes) {
				  console.log('wxlogin ---')
			    console.log(loginRes);
			  }
			})
		}
		  
	},
	mutations:{
	}
})