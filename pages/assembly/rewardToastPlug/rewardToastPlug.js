var util = require("../../../utils/util.js");
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
    toasts:[/*{
      isShow:0,
      annim:null,
      id:1
    }, {
      isShow: 0,
      annim: null,
      id: 2
    },
    {
      isShow: 0,
      annim: null,
      id: 3
    }, {
      isShow: 0,
      annim: null,
      id: 4
    }, {
      isShow: 0,
      annim: null,
      id: 5
    }*/]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startAnnim:function(imgUrl,type,num,content){
      var outThis = this;
      var toasts = this.data.toasts;
      var uuid = util.uuid();
      var toast = {
        isShow: 1,
        annim: null,
        id: uuid,
        type:type,
        num:num,
        imgUrl:imgUrl,
        content: content
      };
      toasts.push(toast);
      this.setData({
        toasts: toasts
      });
      var index = toasts.length-1;
      var annim = wx.createAnimation({
        duration:4000,
        timingFunction:"ease"
      });
      annim.top(-100).opacity(0.1).step();
      var animKey = "toasts["+index+"].annim";
      var showKey = "toasts["+index+"].isShow"
      setTimeout(function(){
        outThis.setData({
          [animKey]: annim.export()
        });
      },100);

      setTimeout(function(){
        outThis.setData({
          [showKey]:0
        });
      },3000);
      
    }
  }
})
