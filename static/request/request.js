 //给data,method设置默认值

 import config from './config'

 // ES6默认值
 export default (url, data = {}, method = 'GET') => {
     return new Promise((resolve, reject) =>
         wx.request({
            
             url: config.host + url,
             data,
             method,
            
             success: (res) => {
                
                 // resolve修改promise的状态为成功状态resolved
                 resolve(res.data);
             },
             fail: (err) => {
                 // console.log("请求失败", err);
                 // reject修改promise的状态为失败状态rejected
                 reject(err)
             }
         }))
 }