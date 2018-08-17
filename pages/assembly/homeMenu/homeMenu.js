var request = require("../../../utils/request.js");
var battleRankRequest = require("../../../utils/battleRankRequest.js");
var domain = request.getDomain();
var interval;
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
    rankImgUrl: domain+"/imgs/rank.png",
    searchImgUrl: domain + "/imgs/search.png",
    danImgUrl: domain + "/imgs/dan.png",
    redPackHomeUrl: domain +"/imgs/redPackHome.png",
    putForwardUrl: domain +"/imgs/putForward.png",
    isCool:0,
    isInfo:0,
    panelMenusImg: domain +"/imgs/panelMenus.png",
    spaceImg: domain + "/imgs/questionBank.gif"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initRank:function(){
      var outThis = this;
      battleRankRequest.bInfo({
        success:function(data){
          var cool = data.cool;
          var rank = data.rank;
          var process = data.process;
          var diff = data.diff;
          var isCool = 0;
          if(cool){
            isCool = 1;
          }
          outThis.setData({
            isCool: isCool,
            rank:rank,
            process:process,
            diff: diff
          });
          outThis.countDown();
          if(isCool){
            var loveCool = outThis.selectComponent("#loveCool");
            loveCool.init(cool, 20);
          }
        },
        fail:function(){
          console.log(".........cool.fail");
        }
      });
    },

    countDown:function(){
      var outThis = this;
      clearInterval(interval);
      interval = setInterval(function(){
        var diff = outThis.data.diff;
        var second = diff / 1000;
        var hour = parseInt(second / 3600);
        var min = parseInt((second - hour * 3600) / 60);
        second = parseInt(second - hour * 3600 - min * 60);

        diff = diff - 1000;
        var isInfo = 0;
        if (diff > 0) {
          isInfo = 1;
        } else {
          isInfo = 0;
        }
        outThis.setData({
          diff: diff,
          second: second,
          hour: hour,
          min: min,
          isInfo: isInfo
        });
      },1000);
    },


    init:function(){
      //this.initRank();
    },
    initBackground: function () {
      var background = this.selectComponent("#background");
      background.initItems();
      background.toScene("home");
    },

    takeoutClick: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('takeoutMoney', myEventDetail, myEventOption);
    },

    toSpace:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toSpace', myEventDetail, myEventOption);
    },

    toRedPackList:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toRedPackList', myEventDetail, myEventOption);
    },

    toRank:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toRank', myEventDetail, myEventOption);
    },

    toQuick:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toQuick', myEventDetail, myEventOption);
    },
    toPk: function () {
      /*wx.navigateTo({
        url: '../pkRoom/pkRoom'
      });*/
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toPk', myEventDetail, myEventOption);
    },
    toPlay: function () {
      /*
      wx.navigateTo({
        url: '../luckDraw/luckDraw'
      });*/
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toPlay', myEventDetail, myEventOption);
    },
    toDanList: function () {
      /*wx.navigateTo({
        url: '../danList/danList'
      });*/
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toDanList', myEventDetail, myEventOption);
    },
    toRank: function () {
      /*
      wx.navigateTo({
        url: '../rankDanBattle/rankDanBattle'
      });*/
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toRank', myEventDetail, myEventOption);
    },
    toMall: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toMall', myEventDetail, myEventOption);
    }
  }
})
