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
    "remainSecord": 0,
     clockImg: domain + "/imgs/clock.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startRoundProgress: function (secord, callback) {
      var outThis = this;
      var step = 0;
      var interval = setInterval(function(){
        console.log("step:"+step);
        step++;
        outThis.setData({
          remainSecord:secord-step
        });
        if(step>=secord){
          clearInterval(interval);
          if(callback){
            callback.end();
          }  
        }
      },1000);
    },
    startCoundDown: function (secord, callback) {
      
      console.log("...secord:"+secord);
      this.startRoundProgress(secord, callback);
    }
  }
})
