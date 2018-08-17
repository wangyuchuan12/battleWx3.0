var socketUtil = require("../../../utils/socketUtil.js");
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.registerTaskComplete();
    },

    registerTaskComplete:function(){
      var outThis = this;
      socketUtil.registerCallback("taskComplete",{
        call:function(data){
          var redpackId = data.redpackId;
          var beanNum = data.beanNum;
          outThis.taskSuccess(beanNum,redpackId);
        }
      });
    },

    taskSuccess:function(beanNum,redPackId){
      var outThis = this;
      wx.showModal({
        title: '任务完成，获得'+beanNum+"智慧豆",
        content: '是否跳转到红包查看',
        confirmText:"跳转",
        success:function(data){
          if(data.confirm){
            var myEventDetail =
              { redpackId: redPackId} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('taskSuccess', myEventDetail, myEventOption);
            socketUtil.removeCallback("taskComplete");
          }
        }
      })
    }
  }
})
