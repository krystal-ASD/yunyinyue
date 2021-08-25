// pages/search/search.js
import request from '../../static/request/request.js'
let timer = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDefault: '',    // 默认搜索内容
    hotsongList: [],       //热搜榜数据
    searchContent: '',     //搜索输入数据
    searchKey: [],       //关键词模糊匹配
    isClearInput: false,      // 是否显示清空输入框
    searchResult: [],      //搜索单曲结果
    searchResults: [],     //搜索歌单结果
    searchType: 0,    //单曲or歌单
    state: 0,     //显示页面
    Type: ''
  },
  // 获取默认搜索内容
  async getsearchDefault(){
    let searchDefaultData = await request('/search/default')
    this.setData({
      searchDefault: searchDefaultData.data.showKeyword
    })
  },
  // 获取热搜榜数据
  async gethotsongList(){
    let hotsongListData = await request('/search/hot/detail')
    this.setData({
      hotsongList: hotsongListData.data
    })
  },
  
  handleSearch(event){
    //console.log(event.detail.value.trim());
    this.setData({
      searchContent: event.detail.value.trim()  //去掉空格
    }) 

    //函数节流
    clearInterval(timer)
    timer = setTimeout(() => {
      //console.log('定时器');
      this.getsearchKey(this.data.searchContent)
    }, 500)
    //是否显示清空按钮
    if(this.data.searchContent !== ''&& this.data.isClearInput == false){
      this.setData({
        isClearInput: true
      })
    }else if(!this.data.searchContent && this.data.isClearInput == true){
      this.setData({
        isClearInput: false
      })
    }
  },

  //清空搜索框
  cleanInput(){
    //console.log('我被调用了');
    //console.log('内容:',this.data.searchContent);
    this.setData({
      searchKey: [],
      searchDefault: '',
      searchContent: '',
      state: 0
    }) 
    //console.log('我要:',this.data.searchContent);
  },
  //关键词模糊匹配
  async getsearchKey(keywords){
    if(!this.data.searchContent){
      this.setData({
        searchKey: [],
        state: 0
      })
      return;
    }
    let searchKeyData = await request('/search/suggest', { keywords, type: 'mobile' })
    //console.log(searchKeyData);
    let searchKey = searchKeyData.result.allMatch;
    //console.log(searchKey);
    this.setData({
      searchKey,
      state: 1
    })
    
  },
  /*handleSearch(event){
    //console.log(event);
    this.setData({
      searchContent: event.detail.value.trim()  //去掉空格
    })  
    this.debounce(this.getsearchKey(), 500);
  },
  //函数防抖
  debounce(func, wait) {
    let timer
    return () => {
		clearTimeout(timer)
        timer = setTimeout(func, wait);
    }
  },
  //关键词模糊匹配
  async getsearchKey(){
    
    let searchKeyData = await request('/search/suggest', { keywords: this.data.searchContent, type: 'mobile' })
    console.log(searchKeyData);
    
      this.setData({
        searchKey: searchKeyData.result.allMatch
      })
    
    console.log(searchKey);
  },*/
  //回车确认触发
  async enterSearch(event){
    //console.log(event.detail.value.trim());
    let searchContentData = event.detail.value.trim()
    //console.log('searchContentData:',searchContentData);
    if(searchContentData === '') {
      searchContentData = this.data.searchDefault
    }
    
    await this.getsearchResult(searchContentData);
    this.setData({
      searchContent: searchContentData
    })
    
  },
  //点击热搜榜搜索
  async handleResou(event){
    //console.log(event.currentTarget.dataset.keywords);
    /*await this.getsearchResult(event.currentTarget.dataset.keywords);
    this.setData({
      searchContent: event.currentTarget.dataset.keywords
    })*/
    this.getSousuo(event);
  },
  //点击推荐关键字搜索
  async handleKeywords(event){
    //console.log(event.currentTarget.dataset.keywords);
    /*await this.getsearchResult(event.currentTarget.dataset.keywords);
    this.setData({
      searchContent: event.currentTarget.dataset.keywords
    })*/
    this.getSousuo(event);
  },
  //封装关键字搜索
  async getSousuo(event){
    await this.getsearchResult(event.currentTarget.dataset.keywords);
    this.setData({
      searchContent: event.currentTarget.dataset.keywords
    })
  },
  //获取搜索结果
  async getsearchResult(keywords){
    this.setData({
      state: 2
    })
    //console.log(this.data.state);
    let type = 1
    let searchType = this.data.searchType
    /*let searchResult = []
    let searchResults = []
    //console.log('keywords:',keywords);
    if (searchType == 0) {
      type = 1
      let searchResultData = await request('/search', { keywords, limit: 20, offset: 0, type: 1 })
      searchResult = searchResultData.result.songs
      console.log(searchResult);
    } else if (searchType == 1) {
      type = 1000
      let searchResultDatas = await request('/search', { keywords, limit: 20, offset: 0, type: 1000 })
      searchResults = searchResultData.result.playlists
      console.log('tpe:',searchResults);
    }*/
    let searchResultData = await request('/search', { keywords, limit: 20, offset: 0, type: 1 })
    let searchResult = searchResultData.result.songs

    let searchResultDatas = await request('/search', { keywords, limit: 20, offset: 0, type: 1000 })
    //console.log(searchResultDatas);
    let searchResults = searchResultDatas.result.playlists
    //console.log(searchResults);
    //console.log('type:',type)
    //let searchResultData = await request('/search', { keywords, limit: 20, offset: 0, type })
     //url示例： https://www.codeman.ink/api/search?keywords=是&limit=20&offset=0&type=1   1:单曲   1000:歌单
    //console.log(searchResultData.result.songs);
    /*console.log(searchResultData.result.songs);
    if (type == 1) {
      //console.log('songs:',searchResultData.result.songs);
      searchResultData = searchResultData.result.songs
      //console.log(searchResultData);
    } else if (type == 1000) {
      searchResultData = searchResultData.result.playlists
    }
    searchResult[searchType].push(...searchResultData)*/
    //console.log('searchResult:',searchResult);
    this.setData({
      searchResult,
      searchResults
    })

  },
  //单曲歌单切换
  tab_slide(event){
    //console.log('slide:',event);
    this.setData({
      searchType: event.detail.current
    });
  },
  tab_click(event){
    //console.log('click:',event);
    //console.log(this.data.searchType);
    //console.log(event.currentTarget.dataset.title);
    if (this.data.searchType === event.currentTarget.dataset.title) {
      return false;
    } else {
      this.setData({
        searchType: event.currentTarget.dataset.title
      })
    }
    
  },
  //跳转到单曲播放页面
  tosongDetail(event) {
    //console.log(this.data.searchResult);
    //console.log(event.currentTarget.dataset.songid);
    let songId = event.currentTarget.dataset.songid
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + songId + '&type=search',    //告诉歌曲是搜索列表
    })
  },
  //跳转到歌单页面
  tosongList(event){
    let musiclistid = event.currentTarget.dataset.musiclistid
    wx.navigateTo({
      url: '/pages/songList/songList?musiclistid=' + musiclistid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getsearchDefault();
    this.gethotsongList();
    
  }
})
  