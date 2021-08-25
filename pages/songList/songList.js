// pages/songList/songList.js
import request from '../../static/request/request.js'

const app = getApp();

let playmusicList = []    //存储一个歌单中全部歌曲数据   用于songDetail切换歌曲
let trackIdsList = []    //要播放歌单列表中所有歌曲的id
let musiclistid = ''   //当前歌单id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList: {},    //通过歌单id请求整个歌单详细数据   用于歌单自己页面数据显示
    playmusicList: [],  //存储一个歌单中全部歌曲数据   用于songDetail切换歌曲
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async  function (options) {
    //清空之前的全局记录
    playmusicList = []
    
    musiclistid = options.musiclistid
    //console.log(options.musiclistid);     获取传入的当前歌单id
    let songListData = await request('/playlist/detail', { id: options.musiclistid, s: 0 })
    //要播放歌单列表中所有歌曲的数据（包括id）（小程序限制只取了前十首）   下一步要把歌曲id单独取出来    得到只包括要切换时所有歌曲id的数组trackIdsList然后传入全局    
    //console.log('trackIds:', songListData.playlist.trackIds.slice(0,10));      
    let res = songListData.playlist.trackIds.slice(0,10)
    res.forEach( res => {
      trackIdsList.push(res.id)
    });  
    //将trackIdsList保存app.js 在songDetail中
    app.globalData.trackIdsList = trackIdsList;
    //console.log('trackIdsList:',app.globalData.trackIdsList);    //要播放歌单列表中所有歌曲的id


    //判断当前musiclistid是否和storage中的musiclistid相同
    if(wx.getStorageSync('musiclistid') == options.musiclistid) {
      console.log('相同，点击播放该歌单歌曲后退出再次进入');     
      //只有点击该歌单中歌曲进行播放后   本地才会存储该歌单id和全部歌曲数据
      console.log('之前存储的playmusicList:', wx.getStorageSync('playmusicList') );
      let playmusicList = wx.getStorageSync('playmusicList')
      //把之前本地存储的歌单中全部歌曲数据传入    不再发送API请求
      songListData.playlist.tracks = playmusicList;
    }
    playmusicList.push(...songListData.playlist.tracks.slice(0,10));
    //console.log('playmusicList:', playmusicList);

    //获取当前页面的数据显示
    //let songListData = await request('/playlist/detail', { id: options.musiclistid, s: 0 })
    let songList = songListData.playlist
    //console.log(songList);
    this.setData({
      songList
    })
  },
  //跳转到歌曲详情页面
  tosongDetail(event){

    let songId = event.currentTarget.dataset.songid
    //console.log(songId);

    //点击播放此歌单中歌曲  将歌单全部数据和歌单id存入本地
    wx.setStorageSync('playmusicList',playmusicList)
    wx.setStorageSync('musiclistid', musiclistid)
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + songId,
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