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
    members:[],
    isShow:0,
    restId:"",
    isReadyButtonShow: 1,
    isBackButtonShow: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showView:function(){
      this.setData({
        isShow:1
      });
    },

    setMember:function(member){
      console.log("member:"+JSON.stringify(member))
      var members = this.data.members;
      for(var i=0;i<members.length;i++){
        if(members[i].memberId==member.memberId){
          console.log("memberId:" + member.memberId);
          if(member.process){
            members[i].process = member.process;
          }

          if (member.thisProcess){
            members[i].thisProcess = member.thisProcess;
          }

          if (member.loveResidule || member.loveResidule==0){
            console.log("..........setMemberLoveResidule:" + member.loveResidule);
            members[i].loveResidule = member.loveResidule;
          }

          if(member.stageIndex){
            members[i].stageIndex = member.stageIndex;
          }

          if(members.status==0||!member.status){
            members[i].status = member.status;
          }
        }
      }
      this.sortMembers(members);
      this.setData({
        members:members
      });
    },

    hideView:function(){
      this.setData({
        isShow: 0
      });
    },

    showReadyButton:function(){
      this.setData({
        isReadyButtonShow: 1
      });
    },

    hideReadyButton:function(){

      console.log(".........hideReadyButton");
      this.setData({
        isReadyButtonShow: 0
      });
    },

    showBackButton: function () {

      console.log("..........showBackButton");
      this.setData({
        isBackButtonShow: 1
      });
    },
    
    stageRestReady:function(){
      this.setData({
        isReadyButtonShow: 0
      });
      var outThis = this;
      var restId = this.data.restId;
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;
      battleRestRequest.ready(battleId,roomId,{
        success:function(){
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('stageRestReady', myEventDetail, myEventOption);
        }
      })
    },

    sortMembers:function(members){
      members.sort(function(member1,member2){
        if(member1.process>=member2.process){
          return -1;
        }else{
          return 1;
        }
      })
    },

    initData:function(battleId,roomId,callback){
      var outThis = this;
      this.setData({
        roomId:roomId,
        battleId:battleId
      });
      battleRestRequest.members(roomId, {
        success: function (members) {

          console.log("members:"+JSON.stringify(members));
          outThis.sortMembers(members);
          outThis.setData({
            members: members
          });

          if (callback){
            callback.success();
          }
        },

        fail: function () {
          console.log(".......initData.members.fail");
          console.log("fail");
        }
      });
    }
  }
})
