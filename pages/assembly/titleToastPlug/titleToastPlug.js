// pages/assembly/titleToastPlug/titleToastPlug.js
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
    fontSize:30,
    title:"",
    subTitle:"",
    animation:null,
    isShow:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTitle:function(title,subtitle){
      console.log(".....................showTitle");
      var outThis = this;
      this.setData({
        title:title,
        subtitle:subtitle,
        isShow:1
      });

      setTimeout(function(){
        var animation = wx.createAnimation({
          duration: 5000,
          timingFunction: "ease"
        });

        animation.opacity(0.1).step();

        outThis.setData({
          animation: animation.export()
        });

        setTimeout(function () {
          outThis.setData({
            isShow: 0
          });
        }, 4000);
      },1000);
    }
  }
})
