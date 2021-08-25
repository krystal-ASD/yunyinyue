// pages/recommendSong/recommendSong.js
import request from '../../static/request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    commendList: []
  },

  async getcommendList() {
    let commendListData = await request('/top/song');
    //console.log(commendListData);
    this.setData({
      commendList: commendListData.data
    }) 
  },
  gotosongDetail(event){
    //console.log(event);
    let song  = event.currentTarget.dataset.song
    //console.log(song); 
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + song.id + '&type=search',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getcommendList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})