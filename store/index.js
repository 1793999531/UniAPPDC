import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		test:"hhh",
		cartInfo:[1],
		menu:[],
		total:'',
		userInfo:'',
		total:0
		
	},
	actions:{
		//获得轮播图列表
		getSwiperList(context) {
		  wx.request({
		    url: "https://www.lpllfd.cn/dingcan?coll=dingcanDB&doc=menu",
		    success: (res) => {
		      console.log(res.data)
		      console.log("获得轮播图列表")
		     // let that = this;
		     //let swiperList = res.data
			 context.state.menu = res.data
		      let len = res.data.length
		      console.log(res.data)
			  
		      // if (len != 0) {
		      //   if (res.statusCode == 200) {
		      //       context.state.swiperList = swiperList
		      //   }
		      //   // for (var i = 0; i < len; i++) {
		      //   //   var temp = {
		      //   //     id: swiperList[i].id,
		      //   //     imgSrc:swiperList[i].img,
		      //   //     name: swiperList[i].name,
		      //   //     price: swiperList[i].Price,
		      //   //     foodNum: null,
		      //   //     userName: this.userInfo.nickName,
		      //   //     foodSequenceFlag:this.foodSequenceFlag+1
		      //   //   }
		      //   //   this.foodNum.push(temp)
		      //   // }
		        
		      // }
		      console.log("获得轮播图列表结束")
		    }
		  })
		
		},
		getCartInfo(context){
			console.log("getcartinfo")
			console.log(context.state.cartInfo)
			if(context.state.cartInfo!=null){
				return context.state.cartInfo
			}else{
				return null
			}
		},
		countTotal(context){
			console.log('index.js countTotal fn')
			console.log(context.state.menu,'-----',context.state.menu[0].price)
			 var total=0;
			for(var i in context.state.menu){
				
				console.log(typeof context.state.menu[i].num)
				if(typeof context.state.menu[i].num =='number'){
					console.log(context.state.menu[i],context.state.menu[i].price)
					console.log()
					total+=context.state.menu[i].price*context.state.menu[i].num
				}
				
			}
			 console.log(total,'-----')
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
				
				            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				            // 所以此处加入 callback 以防止这种情况
				            // if (this.userInfoReadyCallback) {
				            //   this.userInfoReadyCallback(res)
				            // }
				          }
				        })
				      }
				    },
					fail: res => {
						console.log('wx.getSetting fail :' , res)
					}
				  })
		}
	},
	mutations:{
		getCartInfo(state){
			return "bbb"
		}
	}
})