var request = require("../../../utils/request.js");
var domain = request.getDomain();
var redPackRequest = require("../../../utils/redPackRequest.js");
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
      moneyImg:domain+"/imgs/money.png",
      redpackImg: domain + "/imgs/redPack.png",
      backImg: domain + "/imgs/back2.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function (title) {
      if (!title) {
        title = "";
      }
      wx.showLoading({
        mask: true,
        title: title
      });
    },

    hideLoading: function () {
      wx.hideLoading();
    },
    init:function(){
      this.initList();
    },
    initList:function(){
      this.showLoading();
      var outThis = this;
      redPackRequest.listRequest({
        success: function (redPacks){
          outThis.setData({
            redPacks: redPacks
          });
          outThis.hideLoading();

          if(redPacks&&redPacks.length){
            /*var myEventDetail =
              { id: redPacks[0].id} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('toRedPackInfo', myEventDetail, myEventOption);*/
            

            redPackRequest.randomRedpackRequest({
              success:function(data){
                var myEventDetail =
                  { id: data.redPackId} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('toRedPackInfo', myEventDetail, myEventOption);
              }
            });
            
          }else{
            outThis.toBack();
            wx.showModal({
              title: '对不起，没有红包'
            });
          }
          
        },
        fail:function(){
          outThis.hideLoading();
        }
      })
    },

    toBack:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    editRedpackClick:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('editRedpack', myEventDetail, myEventOption);
    },

    redPackItemClick:function(e){
      var id = e.currentTarget.id;

      console.log(".........id:"+id);
      var myEventDetail =
        {id:id} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toRedPackInfo', myEventDetail, myEventOption);
    }
  }
})
