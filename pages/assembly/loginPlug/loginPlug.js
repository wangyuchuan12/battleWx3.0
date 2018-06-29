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
    isShow:false
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

    showOpenSocketType: function (l,o) {
      loginCallback = l;
      openSocketCallback = o;
      var outThis = this;
      userStatusRequest.userStatusInfoRequest({
        isLine: function () {

        },
        notLine: function () {
          outThis.setData({
            content: "是否连接服务器",
            type: 1,
            isShow: true
          });
        },
        notLogin: function () {
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
                    success: function () {
                      outThis.hideLoading();
                      var myEventDetail =
                        {} // detail对象，提供给事件监听函数
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
            success: function () {
              outThis.hideLoading();
              if (callback) {
                callback.success();
              }

              var myEventDetail =
                {} // detail对象，提供给事件监听函数
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
      console.log(JSON.stringify(e));
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
      this.userInfoHandler(e,{
        success:function(){
          outThis.showLoading("连接服务器");
          socketUtil.openSocket({
            open:function(){
              console.log("......opensuccess");
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
