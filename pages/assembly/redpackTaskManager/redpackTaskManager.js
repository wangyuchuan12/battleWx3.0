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
    addImg: domain + "/imgs/create.png",
    submitImg: domain + "/imgs/submit.png",
    mode:0,
    tasks:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(redPackId){
      this.setData({
        redPackId:redPackId
      });
    },

    initTasks:function(){
      var outThis = this;
      var redPackId = this.data.redPackId;
      redPackRequest.tasksRequest(redPackId,{
        success:function(tasks){
          outThis.setData({
            tasks:tasks
          });
        }
      });
    },

    toBack:function(){
      this.setData({
        mode:0
      });
      this.initTasks();
    },

    submitClick:function(){
      var outThis = this;
      var redPackId = this.data.redPackId;
      redPackRequest.submitRedpackRequest(redPackId,{
        success:function(){
          var myEventDetail = {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('toBack', myEventDetail, myEventOption);
        },
        fail:function(){

        }
      });
    },

    taskClick:function(){
      this.setData({
        mode:1
      });
      var redPackId = this.data.redPackId;
      var redpackTaskEdit = this.selectComponent("#redpackTaskEdit");
      redpackTaskEdit.init(redPackId);
    }
  }
})
