// pages/rankSong/rankSong.js
import request from '../../static/request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let rankListData = await request('/toplist/detail')
    //console.log(rankListData.list[0].id);
    let rankList = [[], []]
    let res  = rankListData.list
    
    res.forEach(res => {
      if (res.tracks.length != 0) {
        rankList[0].push(res)
      } else {
        rankList[1].push(res)
      }
    })
    // console.log(rankList);
    this.setData({
      rankList,
    })
    
  },
  //跳转到歌曲列表
  tosongList(event){
    
    let musiclistid = event.currentTarget.dataset.musiclistid
    //console.log(musiclistid);
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