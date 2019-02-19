const app = getApp()
const util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        id: 1,
        name: '用户管理',
        url: "../../../page/component/resources/kind/view.png"
      },
      {
        id: 2,
        name: '我的收藏',
        url: "../../../page/component/resources/kind/view.png"
      },
      {
        id: 3,
        name: '浏览记录',
        url: "../../../page/component/resources/kind/view.png"
      },
      {
        id: 4,
        name: '系统设置',
        url: "../../../page/component/resources/kind/view.png"
      },
      {
        id: 5,
        name: '系统版本',
        url: "../../../page/component/resources/kind/view.png"
      }
    ],
    userName: "张三",
    userLogo: "../resource/image/user_img.jpg",
    userPhone: "136*******9",
    userAuth : false
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
    //授权信息查看
    wx.getSetting({
      success(res) {
        console.log(res.authSetting);
      }
    })

    //处理用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res.data);
        var user = res.data;
        if (user == undefined || user.userName == undefined){
           return;
        }
       
        wxThis.setData({
          userName: user.userName,
          userLogo: user.userLogo,
          userPhone: user.userPhone,
          userAuth : true
        })
      },
    })
   
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

  },
  getWxUserInfo : function(evt){
    
    console.log(evt)
    var u = evt.detail.rawData
    if(u == undefined || u == null){
       wx.showModal({
         title: '提示',
         content: '获取用户失败，请重试'
       })
       return;
    }
    console.log(u)
    console.log(typeof u === "string")
    if (typeof u === "string"){
       u = JSON.parse(u);
    }
    var user = {}
    user.userName = u.nickName == undefined ? "" : u.nickName
    user.userLogo = u.avatarUrl == undefined ? "" : u.avatarUrl
    user.userPhone = "136*******4"
    user.city = u.city;
    user.province = u.province;
    user.country = u.country;
    wx.setStorageSync("userInfo", user); 

    this.setData({
      userName: user.userName,
      userLogo: user.userLogo,
      userPhone: user.userPhone,
      userAuth: true
    })
    
  }
})