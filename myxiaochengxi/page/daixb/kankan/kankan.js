const app = getApp()
const util = require('../../../util/util.js')
var listsTem = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        id: 1,
        name: '视图容器1',
        url: "../../../page/component/resources/kind/view.png"
      }
    ],
    searchInputValue : ""
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
    var wxThis = this;
    // wxThis.refreshData(null);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    listsTem = [];
    this.refreshData(null);
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
   
    var wxThis = this;
    console.log("输入内容：" + wxThis.data.searchVlaue);
    wxThis.refreshData(wxThis.data.lists);

    setTimeout(function(){
        wx.stopPullDownRefresh();
    },1000);

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

  },
  /**
   * 
   * 绑定查找事件
   */
  bindKeySearchInput : function(evt){
    console.log(this);
    console.log("输入内容："+evt.detail.value);
    this.setData({
      searchInputValue: evt.detail.value
    });
  },
  refreshData: function (lists) {
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    })
    var wxThis = this;
    if (lists == undefined || lists == null) {
      lists = [];
    }
    var length = lists.length;
    for (var i = length; i < 1 + length; i++) {
      var m = {};
      m.id = i + 1;
      m.name = "视图容器" + (i + 1);
      m.url = "../../../page/component/resources/kind/view.png";
      listsTem.push(m);
    }

    length = listsTem.length;
    lists = [];

    for (var i = length - 1; i >= 0; i--) {
      lists.push(listsTem[i]);
    }

    wxThis.setData({
      lists: lists
    });

    setTimeout(function () {
      wx.hideLoading();
    }, 1000);

  },
  /**
   * 
   * 清空输入值
   */
  cleanSearchInput : function(evt){
    this.setData({
       searchInputValue : ""
    })
  },
  /***
   * 
   * 搜索开始
   */
  bindClickSearch : function(){
    var wxThis = this;
    var queryValue = wxThis.data.searchInputValue;
    var lists = wxThis.data.lists;
    wxThis.refreshData(lists);
  }
})