const CryptoJS = require('sha1.js')
const md5 = require('md5.js')

var IntfUrl = "http://47.106.220.95/intf";
var webUrl = "http://47.106.220.95";

var appId = "APP";
var tokenId = wx.getStorageSync('tokenId') || "0DD0D0EC0CEB49139EBD8A29EC52B07D";
var intfKey = "3E7D290524A5943KDD4224167DBF45F2";

const postServerCode = function (inCode, param, successFun, errorFun, postType) {
  post(inCode, "", "", param, successFun, errorFun, postType);
}

const post = function (inCode, beanName, methodName, param, successFun, errorFun, postType) {
  inCode = inCode == undefined || inCode == null ? "" : inCode;
  beanName = beanName == undefined || beanName == null ? "" : beanName;
  methodName = methodName == undefined || methodName == null ? "" : methodName;
  if (postType == undefined || postType == "" || postType == null) {
    postType = "POST";
  }
  var url = IntfUrl +"?"+ inCode;
  if (param == null || param == undefined) {
    wx.showModal({
      title: '提示',
      content: '提交参数为空',
      showCancel: false
    })
    return;
  }
  //计算sign
  var inParam = {};
  inParam.inCode = inCode;
  inParam.beanName = beanName;
  inParam.method = methodName;
  inParam.appId = appId;
  inParam.tokenId = tokenId;
  var d = new Date();
  inParam.time = d.getTime().toString();
  var round = Math.round(Math.random() * 1000);
  inParam.rd = round.toString();
  param.inCode = inCode;
  inParam.content = param;

  var paramArray = new Array(intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content));
  paramArray.sort();
  var str = "[";
  for (var i = 0; i < paramArray.length; i++) {
    str += paramArray[i];
    if (i != paramArray.length - 1) {
      str += ", ";
    }

  }
  str += "]";
  var sign = CryptoJS.SHA1(str).toString();
  inParam.sign = sign;
  wx.request({
    url: url,
    data: inParam,
    method: postType,
    success: function (res) {
      wx.hideLoading();
      // console.log(res);
      if (res.data.status == '200') {
        successFun(res.data.content)
      } else if (res.data.status == '403') {
        // var app = getApp();
        wx.showModal({
          title: '警告',
          content: '用户未授权或授权已过期，请重新授权',
          showCancel: false
        })
        if (typeof errorFun == "function") {
          errorFun(res);
        }
      } else {
        if (typeof errorFun == "function") {
          errorFun(res);
          return;
        }
        wx.showModal({
          title: '提示',
          content: res.data.message || '系统搬砖咯，请稍等重试~~',
          showCancel: false
        })
      }

    },
    fail: function (res) {
      wx.hideLoading();
      if (typeof errorFun == "function") {
        errorFun(res);
      } else {
        wx.showModal({
          title: '提示',
          content: '系统搬砖咯，请稍等重试~~',
          showCancel: false
        })
      }
    }
  })
}
//get URL加密
const signUrl = function (orgiUrl) {
  var paramArray = new Array();
  var name, value, paramStr;
  if (orgiUrl != undefined) {
    var realUrl = orgiUrl.substring(0, orgiUrl.indexOf("?"));
    var index = realUrl.lastIndexOf("/");
    var url = orgiUrl.substring(index + 1);
    var idx = 0;
    if ((idx = url.indexOf("&")) > 0) {
      paramStr = url.substring(0, idx);
      var params = url.substring(idx + 1).split("&");
      for (var i in params) {
        if (params[i].split("=")[1] !== "null" && params[i].split("=")[1] !== "") {
          paramArray.push(params[i]);
        }
      }
    } else {
      paramStr = url;
    }
  }
  if (paramArray.length > 0)
    paramStr += "&" + paramArray.sort().join("&");
  paramStr += "&sign=" + md5.md5(paramStr);
  return webUrl + paramStr;
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
    ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
  if (withMs) {
    ret += '.' + formatLeadingZeroNumber(ms, 3)
  }
  return ret
}

module.exports = {
  formatTime,
  formatLocation,
  fib,
  formatDateTime,
  postServerCode: postServerCode,
  signUrl: signUrl
}
