// pages/songDetail/songDetail.js
import request from '../../static/request/request.js'
const app = getApp();    //获取全局对象
const backgroundAudioManager = wx.getBackgroundAudioManager();    //定义播放实例   全局作用域


let songId = ''    //当前正在播放歌曲id
let songUrl = ''    //当前正在播放歌曲url   根据url实现歌曲的声音播放
let playmusicList = []    //存储一个歌单中全部歌曲数据   用于songDetail切换歌曲
let playmusicIndex = 0  //当前正在播放歌曲在播放列表中的索引
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,  //当前歌曲是否播放
    songDetail: [],    //wxml页面songDetail要显示的内容   .songs
    songDetails: [],    //wxml页面songDetail要显示的内容   .songs[0]
    isLike: false,  //是否喜欢
    startTime: '00:00',       //页面上显示的歌曲当前已播放时长 
    finishTime: '00:00',      //页面上显示的歌曲总时长   finishTimeData格式化后数据
    currentWidth: 0,     //实时进度条宽度
    finishTimeData: '',     //播放总时长dt
    playmusicList: [],   //存储一个歌单中全部歌曲数据   用于songDetail切换歌曲
    moveHeight: 100,    //播放列表显示移动高度比例
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //console.log(options.songId);
    let musicId = options.songId   //传过来的歌曲id
    this.setData({
      isPlay: app.globalData.isPlay,
      isLike: false
    })
    songId = app.globalData.songId   //全局之前记录的正在播放的歌曲id

    if(songId == musicId){
      backgroundAudioManager.play()
      app.globalData.isplay = true
      console.log('执行了播放这首歌没放完返回其他页面再回来时触发');
    }else{
      backgroundAudioManager.pause() 
      console.log('执行了结束 进入歌曲页面之前上一首歌的播放');
    }

    //console.log(app.globalData.trackIdsList);
    //console.log(options.type);
    //获取播放歌曲所在歌单列表    切换下一首根据这个歌单顺序
    if(options.type == 'search'){     //搜索页面 和 每日推荐 中的歌曲使用之前本地存储的歌单
      playmusicList = wx.getStorageSync('playmusicList'); 
      this.setData({
        playmusicList
      })   
      playmusicIndex = wx.getStorageSync('playmusicIndex');   //获取之前全局播放歌曲所在歌单中索引
      let seaData = await request('/song/detail',{ids: options.songId})    //请求当前歌曲详细数据
      console.log(seaData.songs[0].id);
     
      //查询当前歌曲是否在当前歌单(当前所有歌曲id数组中是否有该歌曲id)   若不在则插入
      if (!playmusicList.some(item => { return item.id == seaData.songs[0].id })) {
        // console.log(info.id);
        playmusicList.splice(1, 0, seaData.songs[0])
        console.log('这首歌被加入当前播放列表了');
        this.setData({
          playmusicList
        })  
      };
       
    }else{                                   //从其他页面终端歌曲 有歌曲自身所在歌单传入
      playmusicList = wx.getStorageSync('playmusicList');
      this.setData({
        playmusicList
      })   
      //console.log(this.data.playmusicList);
    }
    this.getplaymusicIndex(options.songId)     //获取歌单后再获取当前歌曲在歌单中索引

    await this.getsongDetail(options.songId);    //获取传入歌曲详情
    console.log('我是调用后执行的');

    //在全局配置中判断哪首音乐在播放   记录歌曲播放与否状态  
    /*if(app.globalData.isplay && app.globalData.songId === this.data.songId) {
      this.setData({
        isplay: true,
      })
    }*/
    /*监听音乐播放状态  使系统和显示状态一致*/
    
    //监听播放
    backgroundAudioManager.onPlay( () => {    //回调函数
      this.controlIsplay(true);
      app.globalData.songId = songId
    });
    //监听暂停
    backgroundAudioManager.onPause( () => {
      this.controlIsplay(false);
    });
    //监听停止
    backgroundAudioManager.onStop( () => {
      this.controlIsplay(false);
    });  
    //监听音乐实时播放进度
    backgroundAudioManager.onTimeUpdate( () => {
      let startTimeData = backgroundAudioManager.currentTime
      //console.log(startTimeData);
      let startTime = this.formatDuring(startTimeData*1000);
      //毫秒到秒*1000    百分比*100
      let currentWidth = backgroundAudioManager.currentTime / this.data.finishTimeData * 100000;
      //console.log(currentWidth);
      this.setData({
        startTime,
        currentWidth
      })
    });
    //监听音乐播放结束
    backgroundAudioManager.onEnded( () => {
      backgroundAudioManager.stop();   //停止播放
      this.songSwitch(1);
      //将进度条长度实时播放时间还原成0 未播放前
      this.setData({
        startTime: '00:00', 
        currentWidth: 0,
        isplay: false
      })
    });
  },
  //修改播放状态
  controlIsplay(isplay){
    this.setData({
      isplay
    })
    app.globalData.isplay = isplay
  },
  //获取歌曲详情
  async getsongDetail(ids){
    let songDetailData = await request('/song/detail',{ids})
    //console.log(songDetailData.songs[0].dt);
    songId = songDetailData.songs[0].id
    console.log('通过进入页面传入参数请求得到的songId:',songId);
    app.globalData.songId = songId
    let finishTimeData = songDetailData.songs[0].dt
    let finishTime = this.formatDuring(finishTimeData);
    console.log('finishTime:',finishTime);
    this.setData({
      songDetail: songDetailData.songs,
      songDetails: songDetailData.songs[0],
      finishTime,
      finishTimeData
    })
    this.controlSong(true, songDetailData.songs[0].id);
    
    //动态显示顶部歌曲标题
    wx.setNavigationBarTitle({
      title: this.data.songDetails.name
    })
    // 第一次执行没有playmusicList的数据，在获取到playmusicList之后再执行getplaymusicIndex
    if (playmusicList.length != 0) {
      this.getplaymusicIndex(this.data.songDetails.id)
      wx.setStorageSync('playmusicIndex', playmusicIndex)
      wx.setStorageSync('playmusicList', playmusicList)
    }
  },
  //通过url播放歌曲
  async controlSong(isplay, id, songUrl) {   //参数songUrl可传可不传
    
    if(isplay){     //播放
      if(!songUrl){    //如果songUrl存在   不在发请求  避免重复发请求
        console.log('获取url播放歌曲');
        let songUrlData = await request('/song/url', { id, br: 320000 })
        songUrl = songUrlData.data[0].url    //歌曲播放url
        console.log('songUrl:',songUrl);
      }

      //歌曲不允许播放   这首歌显示了在页面上没有版权无法播放
      if(songUrl == null){
        wx.showToast({
          title: '无法播放该歌曲，已自动为您切换下一首',
          icon: 'none',
          success: () => {
            this.songSwitch(1);
          }
        })
        return
      }
      
      backgroundAudioManager.src = songUrl
      //console.log(this.backgroundAudioManager.src);
      backgroundAudioManager.title = this.data.songDetails.name     //backgroundAudioManager需要指定src,title
      console.log('播放被执行了');
      backgroundAudioManager.play()
    } else {        //暂停
      backgroundAudioManager.pause()
      console.log('暂停被执行了');
    }
  },
  //转换成分秒   处理页面上时间显示
  formatDuring(mss) {
    var minutes = Math.floor((mss % 3600000) / 60000);
    var seconds = Math.floor((mss % 60000) / 1000);
    return  minutes +":"+ seconds;
  },
  //按键播放歌曲
  handlesongPlay() {
    console.log('点击切换暂停或播放');
    let isplay = !this.data.isplay;    //通过按键获取歌曲播放状态
    /*this.setData({
      isplay
    })*/
    //console.log(isplay);
    //console.log(this.data.songId);
    this.controlSong(isplay, songId, songUrl);     
    //参数齐全 直接执行controlSong中play()
  },
  
  //获取当前播放歌曲在歌单中的索引
  getplaymusicIndex(songId){
    console.log('playmusicList:', playmusicList);
    playmusicIndex = playmusicList.findIndex(item => { return item.id == songId })
  },
  //点击切换歌曲    上一首下一首
  async handleSwitch(event){
    let type = event.currentTarget.dataset.type
    //点击切歌按钮关闭当前播放音乐
    backgroundAudioManager.stop();

    if(type == 'pro') {
      console.log('点击切换到上一首');
      this.songSwitch(-1);
    }else if(type == 'next') {
      console.log('点击切换到下一首');
      this.songSwitch(1);
    }

  },
  //实现切换歌曲
  async songSwitch(n){
    console.log('前',playmusicIndex);
    playmusicIndex = playmusicIndex + n;
    console.log('后',playmusicIndex);
    playmusicIndex = playmusicIndex < 0 ? playmusicList.length - 1 : playmusicIndex;    
    playmusicIndex = playmusicIndex > playmusicList.length - 1 ? 0 : playmusicIndex;

    let nextsongId = playmusicList[playmusicIndex].id;
    app.globalData.songId = nextsongId
    //传入songId请求
    await this.getsongDetail(nextsongId);
    

  },
  //实现喜欢歌曲
  getisLike(){
    this.setData({
      isLike: true,
    })
  },
  //点击遮罩层    取消播放列表显示
  handleCancelList(){
    this.setData({
      moveHeight: 100
    })
  },
  //点击显示播放列表
  handleShowList(){
    this.setData({
      moveHeight: 0
    })
  },
  
  /* 
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