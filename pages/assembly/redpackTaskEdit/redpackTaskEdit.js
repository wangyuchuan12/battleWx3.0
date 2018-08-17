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
    rank:null,
    rankPackId:null,
    mode:0
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

    redpackSelectItemClick:function(){
      this.setData({
        mode:1
      });
      var ranksPlug = this.selectComponent("#ranksPlug");
      ranksPlug.init();
    },

    rankCheck:function(e){
      this.setData({
        mode:0
      });
      var rankId = e.detail.rankId;
      var ranks = this.data.ranks;
      for(var i=0;i<ranks.length;i++){
        var rank = ranks[i];
        if(rank.id==rankId){
          this.setData({
            rank:rank
          });
          return;
        }
      }
    },

    beanInput:function(e){
      var beanNum = e.detail.value;
      this.setData({
        beanNum: beanNum
      });
    },

    processInput:function(e){
      var process = e.detail.value;
      this.setData({
        process: process
      });
    },

    submitTask:function(){
      var outThis = this;
      var params = new Object();
      params.beanNum = this.data.beanNum;
      params.process = this.data.process;
      params.rankId = this.data.rank.id;
      params.redpackId = this.data.rankPackId;
      redPackRequest.addTaskRequest(params,{
        success:function(){
          var myEventDetail = {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('toBack', myEventDetail, myEventOption);
        },
        fail:function(){

        }
      });
    },
    init:function(redPackId){
      this.initRanks();
      this.setData({
        rankPackId:redPackId
      });
    },
    selectRank: function (rank) {
      this.setData({ rank: rank });
    },
    initRanks: function () {
      var outThis = this;
      this.showLoading();
      redPackRequest.publicRanksRequest({
        success: function (ranks) {
          console.log(".......ranks:"+JSON.stringify(ranks));
          outThis.setData({
            ranks: ranks
          });
          outThis.hideLoading();

          if (ranks && ranks.length > 0) {
            outThis.selectRank(ranks[0]);
          }
        },
        fail: function () {
          outThis.hideLoading();
        }
      });
    }
  }
})
