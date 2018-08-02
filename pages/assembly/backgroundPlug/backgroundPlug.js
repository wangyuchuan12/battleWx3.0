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
    scrollLeft:0,
    currentBackgroundId:"home",
    danItems:[],
    pkItems:[],
    homeItems:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initItems:function(){
      
      var danItems = new Array();
      for(var i=0;i<50;i++){
        danItems.push({
          imgUrl: domain+"/imgs/caodi.jpg"
        });
      }
      this.setData({
        danItems: danItems
      });

      var pkItems = new Array();
      for (var i = 0; i < 50; i++) {
        pkItems.push({
          imgUrl: domain + "/imgs/zhandou.jpg"
        });
      }
      this.setData({
        pkItems: pkItems
      });

      var homeItems = new Array();
      for (var i = 0; i < 50; i++) {
        homeItems.push({
          imgUrl: domain + "/imgs/xuedi.jpg"
        });
      }
      this.setData({
        homeItems: homeItems
      });
    },

    toScene:function(id,callback){

      var outThis = this;
      outThis.setData({
        scrollLeft: 0
      });
      setTimeout(function(){
        outThis.setData({
          currentBackgroundId: id
        });
        if(callback&&callback.end){
          callback.end();
        }
      },10);
  
     /* if (interval){
        clearInterval(interval);
      }
      var outThis= this;

      setTimeout(function(){
        interval = setInterval(function () {
          var scrollLeft = outThis.data.scrollLeft;
          scrollLeft = scrollLeft+1;
          outThis.setData({
            scrollLeft: scrollLeft
          });
        },1000);
      },5000);*/
    },
  }
})
