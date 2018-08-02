var request = require("../../../utils/request.js");
var socketUtil = require("../../../utils/socketUtil.js");
var userStatusRequest = require("../../../utils/userStatusRequest.js");
var loginCallback;
var openSocketCallback;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    content:"",
    type:1,
    isShow:false,
    userId:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function (title) {
      wx.showLoading({
        title: title,
        mask: true
      });
    },
    hideLoading: function () {
      wx.hideLoading();
    },
    showLoginType:function(){
      var outThis = this;
      userStatusRequest.userStatusInfoRequest({
        isLine:function(){

        },
        notLine:function(){
          
        },
        notLogin:function(){
          outThis.setData({
            content: "您还没登陆，请先登陆",
            type: 0,
            isShow: true
          });
        }
      });
      
    },

    doStart: function (l, o, c, processCallback){
      var outThis = this;
      wx.getUserInfo({
        success: function (resp) {
          var signature = resp.signature;
          var userInfo = resp.userInfo;
          var data = new Object();
          data.detail = new Object();
          data.detail.userInfo = userInfo;
          data.detail.signature = resp.signature;
          outThis.userInfoHandler(data, {
            success: function () {
              if (l && l.success) {
                l.success();
              }
              outThis.openSocket(data, {
                success: function (sss) {
                  if (o && o.success) {
                    o.success();
                  }
                }
              });
            }
          })
        },
        fail: function () {
          outThis.showOpenSocketType(l, o, c, processCallback);
        }
      });
    },

    startOnCheck: function (l, o, c, processCallback){
      var outThis = this;

      userStatusRequest.userStatusInfoRequest({
        isLine: function (data) {
          if (c && c.call) {
            c.call(data);
          }
          /*var interval = setInterval(function () {
            var isOpenSocket = outThis.data.isOpenSocket;
            if (isOpenSocket) {
              outThis.showOpenSocketType(null, null, null, null);
            }
          }, 20000);*/
        },
        notLine: function () {
          outThis.doStart(l, o, c, processCallback);
        },
        notLogin: function () {
          outThis.doStart(l, o, c, processCallback);
        },
        isProgress:function(roomId){

          /*var interval = setInterval(function () {
            var isOpenSocket = outThis.data.isOpenSocket;
            if (isOpenSocket) {
              outThis.showOpenSocketType(null, null, null, null);
            }
          }, 20000);*/
          
        },
        fail: function () {
          outThis.setData({
            content: "是否连接服务器",
            type: 1,
            isShow: true
          });
        }
      });
    
    },

    showOpenSocketType: function (loginCallback, openSocketCallback, isLineCallback, processCallback) {
      
      this.setData({
        loginCallback: loginCallback,
        openSocketCallback: openSocketCallback
      });
      
      var outThis = this;
      userStatusRequest.userStatusInfoRequest({
        isLine: function (data) {
          console.log(".....data:" + JSON.stringify(data));
          if (isLineCallback && isLineCallback.call){
            isLineCallback.call(data);
          }
        },
        notLine: function () {
          console.log("notLine");
          outThis.setData({
            content: "是否连接服务器",
            type: 1,
            isShow: true
          });
        },

        isProgress: function (roomId) {
          if (processCallback && processCallback.call){
            processCallback.call(roomId);
          }
        },

        notLogin: function () {
          console.log("notLogin");
          outThis.setData({
            content: "是否连接服务器",
            type: 1,
            isShow: true
          });
        },
        fail:function(){
          outThis.setData({
            content: "是否连接服务器",
            type: 1,
            isShow: true
          });
        }
      });
     
    },

    userInfoHandler:function(e,callback){
      var outThis = this;
      this.setData({
        isShow:false
      });
      this.showLoading("用户登陆中");
      var signature = e.detail.signature;
      var userInfo = e.detail.userInfo;
      var nickname = userInfo.nickname;
      var gender = userInfo.gender;
      var language = userInfo.language;
      var city = userInfo.city;
      var province = userInfo.province;
      var country = userInfo.country;
      var avatarUtl = userInfo.avatarUrl;
      userInfo.signature = signature;
      var loginCallback = this.data.loginCallback;
      wx.login({
        success:function(resp){
          var code = resp.code;
          request.requestLogin({
            unRegist: function (data) {
              var openId = data.openId;
              userInfo.openId = openId;
              request.requestRegist({
                exists: function () {

                },
                success: function () {
                  request.requestLogin({
                    success: function (data) {
                      outThis.hideLoading();
                      var myEventDetail =
                        {userId:data.id} // detail对象，提供给事件监听函数
                      var myEventOption = {} // 触发事件的选项
                      outThis.triggerEvent('loginSuccess', myEventDetail, myEventOption);
                      if (loginCallback && loginCallback.success){
                        loginCallback.success();
                      }
                      if (callback) {
                        callback.success();
                      }
                    }
                  });
                },
                fail: function () {
                  if (callback) {
                    callback.fail();
                  }
                  if (loginCallback && loginCallback.fail) {
                    loginCallback.fail();
                  }
                }
              }, userInfo);
            },
            success: function (data) {
              outThis.hideLoading();
              if (callback) {
                callback.success();
              }
              var myEventDetail =
                {userId:data.id} // detail对象，提供给事件监听函数
              var myEventOption = {} // 触发事件的选项
              outThis.triggerEvent('loginSuccess', myEventDetail, myEventOption);
              if (loginCallback && loginCallback.success) {
                loginCallback.success();
              }
            },
            fail: function () {
              if (callback) {
                callback.fail();
              }
            }
          }, code);
        }
      });
      
    },

    openSocket:function(e,callback){
      var outThis = this;
      var signature = e.detail.signature;
      var userInfo = e.detail.userInfo;
      if(!userInfo){
        callback.fail();
        return;
      }
      var nickname = userInfo.nickname;
      var gender = userInfo.gender;
      var language = userInfo.language;
      var city = userInfo.city;
      var province = userInfo.province;
      var country = userInfo.country;
      var avatarUtl = userInfo.avatarUrl;
      userInfo.signature = signature;
      outThis.showLoading();
      var openSocketCallback = outThis.data.openSocketCallback;
      this.userInfoHandler(e,{
        success:function(){
          outThis.showLoading("连接服务器");
          socketUtil.openSocket({
            open:function(){
              outThis.setData({
                isOpenSocket:1
              });
              outThis.hideLoading();
              var myEventDetail =
                {} // detail对象，提供给事件监听函数
              var myEventOption = {} // 触发事件的选项
              outThis.triggerEvent('openSocketSuccess', myEventDetail, myEventOption);
              if (openSocketCallback && openSocketCallback.success){
                openSocketCallback.success();
              }

              socketUtil.setOnCloseCallback({
                onClose:function(){
                  outThis.showOpenSocketType();
                }
              });

              if (callback){
                callback.success();
              }
            }
          })
        },
        fail:function(){
          console.log(".....loginPlug.openSocket.fail");
          if (openSocketCallback && openSocketCallback.fail) {
            openSocketCallback.fail();
          }
        }
      });
    }
  }
})
