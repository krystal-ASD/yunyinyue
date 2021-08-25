// app.js
App({
  //利用全局设置记录播放状态   退出后再返回仍保持状态
  globalData: {
    isplay: false,       //当前歌曲是否播放
    songId: '',     //当前正在播放歌曲id
    playmusicList: [],  //存储一个歌单中全部歌曲数据   用于songDetail切换歌曲
    playmusicIndex: 0,     //当前正在播放音乐在播放列表中的索引
    trackIdsList: [],     //要播放歌单列表中所有歌曲的id    //没有作用
  },
  onLaunch() {
    
  },
 
})
