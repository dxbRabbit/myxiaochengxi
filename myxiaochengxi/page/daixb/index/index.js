// page/daixb/index/index.js

//获取应用实例
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
        url:"../../../page/component/resources/kind/view.png"
      }
    ],
    imgUrls: [
      {
        url:"http://xdt.52cfzy.com/image/xzindex1.jpg",
        id: 1
      },
      {
        url: "http://xdt.52cfzy.com/image/xzindex1.jpg",
        id: 2
      },
      {
        url: "http://xdt.52cfzy.com/image/xzindex2.jpg",
        id: 3
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    currentLocation: '广州车陂街道办',
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
    // wxThis.refreshLocation();
    // wxThis.refreshData(null);

    //初始化 手机信息
    wx.getSystemInfo({
      success(res) {
        console.log(res);
        wx.setStorageSync("phoneOS", res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow>>>>>");
    listsTem = [];
    this.refreshData(null);
    this.refreshLocation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide>>>>>");
   
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
    var lists = wxThis.data.lists;
    wxThis.refreshData(lists);
    wxThis.refreshLocation();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
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
   * 刷新地理位置 
   * 
   * */
  refreshLocation: function () {
    var thisWx = this;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        thisWx.setData({
          locationAddr: "解析中。。。",
          currentLatitude : res.latitude,
          currentLongitude : res.longitude
        })
        thisWx.refreshLocationCn(res.latitude, res.longitude,function(res){
          var content = res;
          var formattedAddress = "";
          if (typeof content === "string"){
            var c = JSON.parse(content);
            formattedAddress = c.formattedAddress;
          }else {
            formattedAddress = content.formattedAddress;
          }
          thisWx.setData({
            locationAddr:formattedAddress
          })

        });
       
      }
    })
  },
  /** 
   * 地址解析 - 逆地理编码
   * 
   */
  refreshLocationCn: function (latitude, longitude,callFun) {
    var latAndlng = latitude + "," + longitude;
    var inParam = {};
    inParam.type ="queryLocation";
    inParam.latAndlng = latAndlng;
    util.postServerCode("888888", inParam,function(res){
         console.log(res);
         callFun(res);
    });

  },
  refreshData : function(lists){
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    })
    var wxThis = this;
    if (lists ==undefined || lists == null){
      lists = [];
    }
    var length = listsTem.length;
    for (var i = length; i < 1 + length; i++) {
      var m = {};
      m.id = i + 1;
      m.name = "视图容器" + (i + 1);
      m.url = "../../../page/component/resources/kind/view.png";
      listsTem.push(m);
    }

    length = listsTem.length;
    lists = [];

    for (var i = length -1;i>=0;i--){
       lists.push(listsTem[i]);
    }

    wxThis.setData({
      lists: lists
    });

    setTimeout(function(){
      wx.hideLoading();
    },1000);
   
  },
  toViewMap : function(){
    var wxThis = this;
    var latitude = wxThis.data.currentLatitude;
    var longitude = wxThis.data.currentLongitude;
    console.log(wxThis);
    console.log("latitude>>>" + latitude);
    console.log("longitude>>>>" + longitude);
    // wx.showModal({
    //   title: '弹窗标题',
    //   content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
    //   showCancel: false,
    //   confirmText: '确定'
    // })
   wx.showModal({
      content: '弹出地图，是否再次确认',
      confirmText: '确定',
      cancelText: '取消',
      success(res){
        if (res.confirm){
          wx.openLocation({
            latitude,
            longitude,
            scale: 18
          })
        }
      }
    })
  },
  clickItem : function(evt){
    console.log(evt);
  }
})