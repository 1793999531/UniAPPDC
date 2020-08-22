import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store
const app = new Vue({
    ...App
})
Vue.prototype.wxRequest= function(method, url, data, callback){
	  console.log(method,url,data,callback)
	    return new Promise(function (resolve, reject) {
	      if(data){
	        wx.request({
	          url: url,
	          method: method,
	          header: { 'content-type': 'application/json' },
	          dataType: 'json',
	          data: data,
	          responseType: 'text',
	          success: (data) => {
	            if (callback) {
	              callback(data)
	            }
	            resolve(data)
	          }
	        })
	      }else{
	        wx.request({
	          url: url,
	          method: method,
	          header: { 'content-type': 'application/json' },
	          dataType: 'json',
	          responseType: 'text',
	          success: (data) => {
	            if (callback) {
	              callback(data)
	            }
	            resolve(data)
	          },
	          fail:(err)=>{
	            console.log(err)
	          }
	        })
	      }
	    })
}
app.$mount()
