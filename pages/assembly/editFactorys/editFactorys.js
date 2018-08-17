var request = require("../../../utils/request.js");
var domain = request.getDomain();
var questionManagerRequest = require("../../../utils/questionManagerRequest.js");
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
    saveImg: domain + "/imgs/save.png",
    factorys:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(factoryId){
      this.initFactorys(factoryId);
    },

    factoryClick:function(e){
      var id = e.currentTarget.id;
      var myEventDetail =
        {id:id} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('selectFactory', myEventDetail, myEventOption);
    },

    initFactorys:function(factoryId){
      var outThis = this;
      questionManagerRequest.battleFactorys({
        success:function(fs){
          if(!fs||!fs.length){
            wx.showModal({
              title: '对不起你还未注册账户，不能创建题库'
            });
            var myEventDetail =
              {} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('toBack', myEventDetail, myEventOption);
            return;
          }
          outThis.setData({
            factorys:fs
          });
          if (factoryId){
            var myEventDetail =
              { id: factoryId} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('selectFactory', myEventDetail, myEventOption);
          }
        },
        fail:function(){

        }
      });
    }
  }
})
