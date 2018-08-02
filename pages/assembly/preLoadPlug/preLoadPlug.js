var preCallback;
var interval;
var request = require("../../../utils/request.js");
var domain = request.getDomain();
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
    preProcess:0,
    isShow:0,
    buttonAnim:null,
    preCallback:null,
    bgImg:""
  },

  /**
   * 组件的方法列表
   */
  methods: {

    hidePreLoad:function(){
      this.setData({
        isShow:0
      });
    },

    showPreLoad:function(c){
      var outThis = this;
      var bgImgUrl = domain+"/imgs/battle_bg.jpg";
      bgImgUrl = "";
      //bgImgUrl = "../../imgs/battle_bg.jpg";
      var iconImgUrl = domain +"/imgs/battle_icon.png";

      /*
      var bgImg = new Image()
      bgImg.onload = function () {
        outThis.setData({
          bgImg: bgImgUrl
        })
      }
      image.src = bgImgUrl;

      var iconImg = new Image()
      iconImg.onload = function () {
        outThis.setData({
          iconImg: iconImgUrl
        })
      }
      iconImg.src = iconImgUrl;
      */
      this.setData({
        isShow:1,
        bgImg: bgImgUrl,
        iconImg: iconImgUrl
      });
      preCallback = c;
    },
    startClick:function(e){
      console.log(JSON.stringify(e));
      var outThis = this;
      this.loadToPreProgress(90,null,100);
      var loginPlug = this.selectComponent("#loginPlug");
      loginPlug.openSocket(e,{
        success:function(){
          outThis.loadToPreProgress(100,{
            success:function(){
              if(preCallback){
                preCallback.success();
              }
            }
          }, 1000);
        },
        fail:function(){
          outThis.showError();
        }
      });
    },

    showError:function(){
      if (interval) {
        clearInterval(interval);
      }
    },
    loadToPreProgress:function (process,callback,time) {
      if (interval) {
        clearInterval(interval);
      }
      if(!time){
        time = 10;
      }
      var outThis = this;
      var preProcess = this.data.preProcess;
      if (process > preProcess) {
          interval = setInterval(function () {
          preProcess++;
          outThis.setData({
            "preProcess": preProcess
          });
          if (process <= preProcess) {
            clearInterval(interval);
          }
          if(process>=100){
            outThis.setData({
              isShow:0
            });
            if(callback){
              callback.success();
            }
            clearInterval(interval);
          }
        }, time);
      }
    }
  }
})
