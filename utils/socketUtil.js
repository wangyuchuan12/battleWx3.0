//var domain = "wss://www.chengxihome.com";
//var domain = "ws://www.chengxihome.com";
var domain = "ws://172.20.10.2";
var request = require("request.js");
var token;
var callbacks = new Array();

var openCallback;

var closeCallback;

var isOpen = 0;

var time = 0;

var userInfo;

function closeSocket(){
  wx.closeSocket();
}

function setOnCloseCallback(c){
  closeCallback = c;
}

function registerCallback(code,callback){
  removeCallback(code);
  var obj = new Object();
  obj.code = code;
  obj.callback = callback;
  callbacks.push(obj);
}

function removeCallback(code){
  if(!callbacks||!callbacks.length){
    return;
  }
  
  for(var i=0;i<callbacks.length;i++){
    var callback = callbacks[i];
    if(callback.code==code){
      callbacks.splice(i,1);
    }
  }
}

wx.onSocketMessage(function (resp) {
  
  data = resp.data;
  data = data.replace(" ", "");
  if (typeof data != 'object') {
    data = data.replace(/\ufeff/g, "");//重点
  }
  var data = JSON.parse(data);
  for (var i = 0; i < callbacks.length; i++) {
    var callback = callbacks[i];
    if (callback.code == data.code) {
      callback.callback.call(data.data);
      if (callback.code == "publishRest") {
        console.log("啦啦啦啦啦啦啦啦啦");
      }
    }
  }
});

function openSocket(callback){
  isOpen = 0;
  request.requestLogin({
    success: function (u) {
      userInfo = u;
      token = userInfo.token;
      var url = domain + url + "?token=" + token;
      doOpenSocket();
      /*
      wx.closeSocket({
        url: domain + url + "?token=" + token,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (data) {
          doOpenSocket();
        },
        complete: function (res) {
        },
        fail: function (err) {
          doOpenSocket();
        }
      });*/
    },
    fail:function(){
    }
  })
  openCallback = callback
  
  
  function doOpenSocket(){
    time++;
    if(time>5){
      return;
    }
    var url = "/socket";
    wx.connectSocket({
      url: domain + url+"?token=" + token,
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (data) {
        
      },
      complete: function (res) {
        console.log('complete: ', res);
      },
      fail: function (err) {
        console.log("openSocketFail")
        setTimeout(function(){
          //doOpenSocket();
        },5000);
        
      }
    });
  }

  

  wx.onSocketOpen(function (res) {
    console.log("连接打开了");
    isOpen = 1
    if (openCallback){
      openCallback.open(userInfo);
      openCallback = null;
    }
    /*wx.sendSocketMessage({
      data: "你好，我叫王煜川",
      success:function(res){
        console.log("success:"+JSON.stringify(res));
      },
      fail:function(res){
        console.log("fail:" + res);
      }
    });*/
  });

  wx.onSocketClose(function (res) {
    isOpen = 0;
    console.log("onSocketClose");
    setTimeout(function () {
      if (!closeCallback){
        doOpenSocket();
      }else{
        closeCallback.onClose();
      }
      
    }, 5000);
    
  });

  wx.onSocketError(function (res) {
    console.log("onSocketError");
    setTimeout(function () {
      if (isOpen==0){
        //doOpenSocket();
      }
    }, 5000);
  });
}

module.exports = {
  openSocket: openSocket,
  registerCallback: registerCallback,
  removeCallback: removeCallback,
  closeSocket: closeSocket,
  setOnCloseCallback: setOnCloseCallback
}
