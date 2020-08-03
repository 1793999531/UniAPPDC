    var total2=10
    //wx.request function
    let wxRequest =function (method, url, data, callback) {
      console.log('apijs---')
        return new Promise(function (resolve, reject) {
          console.log('--1',data)
          if(data){
            wx.request({
              url: url,
              method: method,
              header: { 'content-type': 'application/json' },
              dataType: 'json',
              data: data,
              responseType: 'text',
              success: (data) => {
                console.log('--1')
                if (callback) {
                  
                  callback(data)
                }
                resolve(data)
              }
            })
          }else{
            console.log('--4')
            wx.request({
              url: url,
              method: method,
              header: { 'content-type': 'application/json' },
              dataType: 'json',
              responseType: 'text',
              success: (data) => {
                console.log('--3')
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
      let test = () =>{
          console.log("testSuc")
      }
      //对外暴露
      module.exports = {
          test,
          wxRequest
      }