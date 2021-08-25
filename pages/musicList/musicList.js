// pages/musicList/musicList.js
import request from '../../static/request/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listTable: [],    //标签栏
    listShow: [],    //歌单显示
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlistTable();
    this.getlistShow();
  },
  //获取标签栏
  async getlistTable(){
    let Table = await request('/playlist/hot')
    //console.log(Table.tags);
    this.setData({
      listTable: Table.tags
    })
  },
  
  //获取显示歌单
  async getlistShow(){
    let listShow = await request('/top/playlist')
    //console.log(listShow);
    this.setData({
      listShow: listShow.playlists
    })
  },
  //跳转到歌曲列表
  tosongList(event){
    //console.log(event.currentTarget.dataset.musiclistid);
    let musiclistid = event.currentTarget.dataset.musiclistid
    wx.navigateTo({
      url: '/pages/songList/songList?musiclistid=' + musiclistid,
    })
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