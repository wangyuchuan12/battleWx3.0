//var domain = "http://www.vlingquan.com";
//var domain = "https://www.chengxihome.com";
//var domain = "http://www.fisherman7.com";
var domain = "http://172.20.10.2";
//根据code登陆用户bbin
var loginByJsCodeUrl = domain + "/api/common/login/loginByJsCode";
var registerUserByJsCode = domain + "/api/common/login/registerUserByJsCode";
var wxPayConfigUrl = domain + "/api/battle/wxPayConfig";
var loadFileUrl = domain + "/api/common/resource/upload";

var masonryPayUrl = domain + "/api/battle/masonryPay";

var beanPayUrl = domain + "/api/battle/beanPay";

var createPaymemberVoucherUrl = domain +"/api/battle/createPaymemberVoucher";
var token;
var isLogin;

var openSettingFlag = false;

var openUserSettingCallbacks = new Array();

var loginLuck = false;

//请求总函数，是所有请求的工具


function getDomain() {
  return domain;
}

function requestWithLogin(url, params, callback) {

  request(url, params, {
    success: function (resp) {
      callback.success(resp);
    },
    fail: function () {
      
    }
  })

}

function requestUpload(filePath, callback) {
  var sessionId = wx.getStorageSync("SESSIONID");
  var header;
  if (sessionId) {
    header = {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': 'JSESSIONID=' + sessionId
    }
  } else {
    header = {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  wx.uploadFile({
    url: loadFileUrl,
    filePath: filePath,
    name: 'file',
    header: header,
    success: function (resp) {
      if (resp.statusCode == 200) {
        callback.success(JSON.parse(resp.data));
      } else {
        callback.fail();
      }
    },
    fail: function () {
      callback.fail();
    }
  });
}

function request(url, params, callback, data) {
  var sessionId = wx.getStorageSync("SESSIONID");
  var header;
  if (sessionId) {
    header = {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': 'JSESSIONID=' + sessionId
    }
  } else {
    header = {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }

  //token = "229bb9d5-eda5-4af5-8914-823203341afc";
  //token = "73d0fd6f-2d23-4e4f-85eb-773b70ee1474";
  //token = "6513c982-f411-4bb9-b1d8-c781a622d60e";
  params.token = token;
  wx.request({
    url: url,
    data: params,
    header: header,
    method: "post",
    complete: function (res) {
      console.log("complete");
    },
    success: function (res) {
      var header = res.header;
      var setCookie;
      if (header) {
        setCookie = header["Set-Cookie"];
      }
      var sessionStr;
      if (setCookie) {
        var array = setCookie.split(";");
        if (array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].startsWith("JSESSIONID=")) {
              sessionStr = array[i];
              break;
            }
          }
        }
      }

      var sessionId;
      if (sessionStr) {
        sessionId = sessionStr.substring("JSESSIONID=".length);
      }

      if (sessionId) {
        wx.setStorageSync("SESSIONID", sessionId);
      }

      if (res.errorMsg = "request:ok") {
        callback.success(res.data);
      } else {
        callback.fail(res.data);
      }

    },
    fail: function (err) {
      callback.fail(err);
    }

  });
}

//获取支付配置
function requestWxPayConfig(id, callback) {
  request(wxPayConfigUrl, { goodId: id }, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      }
    },
    fail: function () {
      callback.fail();
    }
  });
}


function requestPayMentWithMasonry(goodId, callback) {
  var params = new Object();
  params.goodId = goodId;
  requestWithLogin(masonryPayUrl, params, {
    success: function (resp) {
      callback.success();
    },
    fail: function () {
      callback.fail();
    }
  });
}

function requestPayMentWithBean(goodId, callback) {
  var params = new Object();
  params.goodId = goodId;
  requestWithLogin(beanPayUrl, params, {
    success: function (resp) {
      callback.success();
    },
    fail: function () {
      callback.fail();
    }
  });
}

//支付
function requestPayMent(params, callback) {
  var timestamp = params.timestamp;
  requestLogin({
    success: function () {
      wx.requestPayment({
        timeStamp: timestamp,
        nonceStr: params.nonceStr,
        package: params.pack,
        signType: params.signType,
        paySign: params.paySign,
        total_fee: params.cost,
        success: function (resp) {
          if (resp.errMsg == "requestPayment:ok") {
            callback.success();
          }
        },
        fail: function () {
          callback.fail();
        }
      });
    },
    fail: function () {
      callback.fail();
    }
  });
}

function createPaymemberVoucher(costBean,costLove,callback){
  var params = new Object();
  if(costBean){
    params.costBean = costBean;
  }

  if(costLove){
    params.costLove = costLove;
  }
  requestWithLogin(createPaymemberVoucherUrl, params, {
    success: function (resp) {
      if(resp.success){
        callback.success();
      }else{
        callback.fail();
      }
      
    },
    fail: function () {
      callback.fail();
    }
  });
}

function openSetting(callback) {
  wx.openSetting({
    success: function (res) {
      callback.success(res);
    },
    fail: function () {
      callback.fail();
    }
  });
}

function openUserInfoSetting(callback) {

  if (callback) {
    openUserSettingCallbacks.push(callback);
  }

  if (openSettingFlag) {
    return;
  }
  openSettingFlag = true;
  openSetting({
    success: function (res) {
      if (res.authSetting["scope.userInfo"]) {
        for (var i = 0; i < openUserSettingCallbacks.length; i++) {
          var callback = openUserSettingCallbacks[i];
          callback.success();
        }
        openSettingFlag = false;
      } else {
        openSettingFlag = false;
        openUserInfoSetting();
      }
    },
    fail: function () {
      // console.log("fail2");
      // openUserInfoSetting();
    }
  });
}


function testSetUserInfo() {
  /*  wx.setStorageSync("userInfo",{
      "code": "1",
      "nickName": "test", "gender": 1,
      "avatarUrl": "ss",
      "openId":123
    });
  
    var userInfo = wx.getStorageSync("userInfo");
  
    console.log("userInfo:"+JSON.stringify(userInfo));*/
}

//获取用户信息数据
function getUserInfo(callback) {
  /* var userInfo = wx.getStorageSync("userInfo");
   console.log(JSON.stringify(userInfo));
   if (userInfo) {
     callback.success(userInfo);
     return;
   }*/

  wx.getUserInfo({
    withCredentials: false,
    success: function (res) {
      wx.setStorageSync("userInfo", res.userInfo);
      callback.success(res.userInfo);
    },
    fail: function (res) {
      openUserInfoSetting({
        success: function () {
          getUserInfo(callback);
        }
      });
    }
  })
}


function requestRegist(callback,userInfo) {
  request(registerUserByJsCode, {
    "openId": userInfo.openId,
    "code":userInfo.code,
    "nickName": userInfo.nickName, "gender": userInfo.gender,
    "language": userInfo.language, "city": userInfo.city,
    "province": userInfo.province, "country": userInfo.country,
    "avatarUrl": userInfo.avatarUrl
  }, {
      success: function (resp) {
        if (resp.success) {
          //注册成功
          callback.success();
          var data = resp.data;
          token = data.token;
          callback.success();
        } else {
          //用户已存在
          if (resp.errorCode == 403) {
            callback.exists();
          } else {
            callback.fail();
          }

        }
      },
      fail: function (resp) {
        //注册失败
        callback.fail();
      }
    });
}

//请求登陆
function requestLogin(callback, code) {

  var params = new Object();
  if(token){
    params.token = token;
  }

  if (code){
    params.code = code;
  }
  request(loginByJsCodeUrl, params, {
      success: function (resp) {
        if (resp.success) {
          token = resp.data.token;
          callback.success(resp.data.userInfo);
        } else {
          if (resp.errorCode == 401) {
            if (callback && callback.unRegist){
              callback.unRegist(resp.data);
            }
          } else if (resp.errorCode == 0 || resp.errorCode == 1) {
            
          }
        }

      },
      fail: function () {
        console.log("login fail3");
        callback.fail();
      }
    });
}

module.exports = {
  request: request,
  getUserInfo: getUserInfo,
  requestPayMent: requestPayMent,
  requestLogin: requestLogin,
  requestWxPayConfig: requestWxPayConfig,
  getDomain: getDomain,
  testSetUserInfo: testSetUserInfo,
  requestWithLogin: requestWithLogin,
  requestUpload: requestUpload,
  requestPayMentWithMasonry: requestPayMentWithMasonry,
  requestPayMentWithBean: requestPayMentWithBean,
  createPaymemberVoucher: createPaymemberVoucher,
  requestRegist: requestRegist
}