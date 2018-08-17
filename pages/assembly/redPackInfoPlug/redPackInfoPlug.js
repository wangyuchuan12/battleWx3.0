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
    moneyImg: domain + "/imgs/money.png",
    tasks:null,
    redPack:null,
    beanImg: domain + "/imgs/bean.png",
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
    init:function(id){
      this.setData({
        id:id
      });
      this.initInfo();
    },

    initRandom:function(){
      var outThis = this;
      redPackRequest.randomRedpackRequest({
        success: function (data) {
          var id = data.redPackId;
          outThis.setData({
            id:id
          });
          outThis.initInfo();
        },
        fail:function(){
          wx.showModal({
            title: '没有红包'
          });
          var myEventDetail = {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('toBack', myEventDetail, myEventOption);
        }
      });
    },

    toBack:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    taskItemClick:function(e){
      var outThis = this;
      var id = e.currentTarget.id;
      var tasks = this.data.tasks;
      for(var i=0;i<tasks.length;i++){
        var task = tasks[i];
        if(task.id==id){
          var myEventDetail ={rankId:task.rankId} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('toRankInfo', myEventDetail, myEventOption);
        }
      }
    },

    redpackOpenClick:function(){
      var tasks = this.data.tasks;
      for(var i=0;i<tasks.length;i++){
        var task = tasks[i];
        if(task.status!=2){
          wx.showModal({
            title: '任务还没有全部做完',
            content: '做完任务之后再领取'
          });
          return;
        }
      }
      var outThis = this;
      this.showLoading();
      var outThis = this;
      var id = this.data.id;
      var redPack = this.data.redPack;
      redPackRequest.receiveRequest(id,{
        success:function(data){
          outThis.hideLoading();
          wx.showModal({
            title: '领取成功'
          });
          outThis.initInfo();

          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('flushAttr', myEventDetail, myEventOption);
        },
        fail:function(){
          wx.showModal({
            title: '领取失败'
          });
          outThis.hideLoading();
        }
      });
    },

    initInfo:function(){
      var outThis = this;
      var id = this.data.id;
      redPackRequest.infoRequest(id,{
        success:function(data){
          outThis.setData({
            tasks: data.tasks,
            redPack: data.redpack,
            distributions: data.distributions
          });
        },
        fail:function(){
          
        }
      });
    }
  }
})
