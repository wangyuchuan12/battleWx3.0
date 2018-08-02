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
    rewardImg:domain+"/imgs/banner.png",
    sunshineimg:domain+"/imgs/sunshine.png",
    sunshineAnimation:null,
    goodImg: domain +"/imgs/lifeLoveSolid.png",
    title:"",
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showGood:function(goodImg,title,content,callback){
      this.setData({
        goodImg:goodImg,
        title:title,
        content:content,
        callback:callback
      });
      this.sunshineAnnim();
    },

    buttonClick:function(){
      var callback = this.data.callback;
      callback.call();
    },

    sunshineAnnim:function(){
      var outThis = this;
      console.log("sunshineAnnim");
      var animation = wx.createAnimation({
        transformOrigin: "50% 50% 0",
        duration: 100000000,
        timingFunction: "linear",
        delay: 0
      });
      animation.rotate(15000000).step();


      setTimeout(function(){
        outThis.setData({
          "sunshineAnimation": animation.export()
        });
      },2000);
      
    }
  }
})
