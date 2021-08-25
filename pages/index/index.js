// index.js
import request from '../../static/request/request.js'


let allTopList = [];     // 存放所有排行榜完整数据
let currentPage = 0;     // 排行榜swiper当前所处的current
//let trackIdsList = []    //要播放歌单列表中所有歌曲的id

Page({
  data: {
   //轮播图数据
   bannerList: [],
   // 推荐歌单数据
   recommendList: [],
   //排行榜
   topList: [],
  },
  
  
  onLoad: async function (options) {
    //轮播图数据
    let bannerListData = await request('/banner', {type: 1});
    //console.log(bannerListData);
    this.setData({
      bannerList: bannerListData.banners
    })
    // 推荐歌单数据
    let recommendListData = await request('/personalized');
    //console.log(recommendListData);
    this.setData({
      recommendList: recommendListData.result
    })
    
    //获取排行榜列表
    let topListPri = await request('/toplist')
    topListPri.list.splice(5)
    topListPri = topListPri.list
    //console.log(topListPri);
    let index = 0
    let topListItem = {};
    let topList = [];  //将取得五个topListItem{}对象放入数组
    
    while(index < 5) {
      let topListData = await request('/playlist/detail', {id: topListPri[index].id})
      //请求示例：https://www.codeman.ink/api/playlist/detail?id=19723756
      topListItem = {name:topListData.playlist.name, id: topListData.playlist.id, tracks:topListData.playlist.tracks.slice(0,3)}
      index++;
      topList.push(topListItem)
      //console.log(topList);
      this.setData({
        topList,
      })
      //console.log(topListData.playlist.tracks.splice(0,10));    //五个榜所有的歌曲信息   五个相同名字内容不同的数组
      allTopList.push(topListData.playlist.tracks.splice(0,10))
    }
    //五个榜所有的歌曲信息   五个相同名字内容不同的数组   allTopList[0]  allTopList[1]  ...
    //console.log(allTopList);     
  },
  //跳转到搜索
  tosearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //跳转到每日推荐
  toRecommend() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    });
  },
  //跳转到歌单
  tomusicList() {
    wx.navigateTo({
      url: '/pages/musicList/musicList',
    })
  },
  //跳转到排行榜
  toRank() {
    wx.navigateTo({
      url: '/pages/rankSong/rankSong',
    })
    
  },
  //跳转到歌曲详情     首页排行榜中歌曲歌单与上面排行榜图标中歌曲歌单相同
  tosongDetail(event) {
    let songId = event.currentTarget.dataset.songid
    console.log(allTopList[currentPage]);     //得到点击的那个榜的所在歌单前十首所有歌曲全部数据
    wx.setStorageSync('playmusicList', allTopList[currentPage])
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + songId,
    })
  },
  //获取首页排行榜所处页码    
  handleCurrentPage(event){
    //console.log(event);
    currentPage = event.detail.current
  },
  //推荐歌单内跳转到歌曲列表
  tosongList(event){
    
    let musiclistid = event.currentTarget.dataset.musiclistid
    //console.log(musiclistid);
    wx.navigateTo({
      url: '/pages/songList/songList?musiclistid=' + musiclistid,
    })
  },
  
}) 