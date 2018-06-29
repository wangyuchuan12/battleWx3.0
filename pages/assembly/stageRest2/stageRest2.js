var socketUtil = require("../../../utils/socketUtil.js");

var battleRestRequest = require("../../../utils/battleRestRequest.js");
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
    members: [],
    memberInfo:null,
    room: null,
    isShow: 0,
    restId: "",
    isReadyButtonShow: 1,
    isBackButtonShow: 0,
    //0表示关卡 1表示排名
    mode:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showView: function () {
      this.setData({
        isShow: 1
      });
    },

    setMember: function (member) {
      
      this.setData({
        memberInfo:member
      });

    },

    setMembers:function(members){
      this.setData({
        members:members
      });
    },

    setRoom:function(room){
      this.setData({
        room: room
      });
    },

    hideView: function () {
      this.setData({
        isShow: 0
      });
    },

    showReadyButton: function () {
      this.setData({
        isReadyButtonShow: 1
      });
    },

    hideReadyButton: function () {
      this.setData({
        isReadyButtonShow: 0
      });
    },

    showBackButton: function () {
      this.setData({
        isBackButtonShow: 1
      });
    },

    stageRestReady: function (e) {
      var id = e.target.id;
      var stageIndex = id.substring("stageRest_".length);
      console.log("...............stageIndex:"+stageIndex);
      this.setData({
        isReadyButtonShow: 0
      });
      var outThis = this;
      var restId = this.data.restId;
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;
      battleRestRequest.ready(battleId, roomId, {
        success: function () {
          var myEventDetail =
            { stageIndex: stageIndex} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('stageRestReady', myEventDetail, myEventOption);
        }
      })
    },

    sortMembers: function (members) {
      members.sort(function (member1, member2) {
        if (member1.process >= member2.process) {
          return -1;
        } else {
          return 1;
        }
      })
    },

    memberInfoClick:function(){
      this.setData({
        mode:1
      });
    },

    ranksClick:function(){
      this.ranks();
    },


    ranks:function(callback){
      var outThis = this;
      this.setData({
        mode:1
      });
    }
  }
})
