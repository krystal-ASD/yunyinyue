import request from '../../static/request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    passward: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  clickInput(event) {
    let type = event.currentTarget.id;
    //console.log(event);
    this.setData({
      [type]: event.detail.value
    })
  },

  /*function showKou(title,icon) {
    wx.showToast({
      title,
      icon
    })
  },*/

  async login() {
    //console.log(this.data);
    let {phone,password} = this.data;

    //前端验证
    //手机号为空
    if(!phone) {
      //showKou('号码不能为空','error');
      wx.showToast({
        title: '号码不能为空',
        icon: 'error'
      })
      return;
    }
    //手机号格式错误
    let geshi= /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!geshi.test(phone)) {
      //showKou('号码格式错误','error');
      wx.showToast({
        title: '号码格式错误',
        icon: 'error'
      })
      return;
    }
    //密码为空
    if(!password){
      //showKou('密码不能为空','error');\
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return;
    }
    //后端网易云接口验证
    let result = await request('/login/cellphone', { phone, password, isLogin: true })
    //请求示例：https://www.codeman.ink/api/login/cellphone?phone=13387678392&password=159951&isLogin=true
    if(result.code === 200) {
      //showKou('登录成功','success');
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      }),
      
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))    //转成JSON对象储存
      //跳转到个人中心
      wx.reLaunch({
        url:'/pages/personal/personal'      //关闭所有页面，打开到应用内的某个页面   这样才能在personal页面onLoad里面显示

      })
    }else if(result.code ===  400) {
      //showKou('密码不能为空','error');
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
    }else if (result.code === 502) {
      //showKou('密码错误','error');
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      })
    } else {
      //showKou('登录失败，请重新登录!','error');
      wx.showToast({
        title: '登录失败，请重新登录!',
        icon: 'none'
      })
    }
  }

})
