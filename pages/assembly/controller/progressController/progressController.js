var socketUtil = require("../../../../utils/socketUtil.js");
var battleMemberInfoRequest = require("../../../../utils/battleMemberInfoRequest.js");

var syncPaperDataRequest = require("../../../../utils/battleSyncDataRequest.js");

var battleMembersRequest = require("../../../../utils/battleMembersRequest.js");
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
    //0表示菜单模式 1答题模式 2运行模式 3等待模式
    mode:0,
    battleId:"",
    roomId:"",
    memberInfo:null,
    isInitPositions: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function () {
      wx.showLoading({
        mask: true
      });
    },
    hideLoading: function () {
      wx.hideLoading();
    },

      /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      var menuController = this.selectComponent("#menuController");
      if (menuController){
        menuController.onUnload();
      }
    },

    flushAttr:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('flushAttr', myEventDetail, myEventOption);
    },
    init:function(){
      
      var menuController = this.selectComponent("#menuController");
      menuController.initBackground();

      setTimeout(function () {
        menuController.toScene("home");
      }, 2000);

      
    },

    stageRestReady:function(e){

      console.log("e:"+JSON.stringify(e));
      var stageIndex = e.detail.stageIndex;
      var memberInfo = this.data.memberInfo;

      this.setData({
        mode: 3
      });
      var stageRest = this.selectComponent("#stageRest");
      stageRest.hideReadyButton();
      this.startStage(stageIndex,
       memberInfo.battleId,
       memberInfo.roomId,
       memberInfo.id);
       
    },

    toStart:function(e){

      this.setData({
        mode:2
      });
      var battleRoom = e.detail.battleRoom;

      var roomId = battleRoom.id;
      var battleId = battleRoom.battleId;

      this.setData({
        roomId:roomId,
        battleId:battleId,
        battleRoom:battleRoom,
        members:battleRoom.members,
        memberInfo:battleRoom.memberInfo
      });

      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toProgress', myEventDetail, myEventOption);

      this.registerPublishShowSubjects();
      this.registerPublishShowSubjectStatus();
      this.registerShowQuestion();
      this.registerShowPlayers();
      this.registerAnswer();
      this.registerRest();
      this.registerReward();
    },

    registerPublishShowSubjectStatus:function(){
      var outThis = this;
      socketUtil.registerCallback("showSubjectStatus", {
        call: function (subject) {
          console.log("........registerPublishShowSubjectStatus");
          var questionController = outThis.selectComponent("#questionController");
          questionController.updateSubject(subject);
        }
      });
    },

    //注册显示问题回调
    registerShowQuestion: function () {
      var outThis = this;
      socketUtil.registerCallback("publishShowQuestion", {
        call: function (question) {
          outThis.setData({
            mode:1
          });
          var questionController = outThis.selectComponent("#questionController");
          questionController.showQuestion(question);
        }
      });
    },

    registerRest: function () {
      var outThis = this;
      socketUtil.registerCallback("publishRest", {
        call: function (data) {
          outThis.setData({
            mode:3
          });
          var stageRest = outThis.selectComponent("#stageRest");
          var memberInfo = data.memberInfo;
          var members = data.members;
          var room = data.room;
          stageRest.setMembers(members);
          stageRest.setMember(memberInfo);
          stageRest.setRoom(room);

          var isInitPositions = outThis.data.isInitPositions;
          if (!isInitPositions){
            var myEventDetail =
              { members: members, memberInfo: memberInfo } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('initMembers', myEventDetail, myEventOption);
            outThis.setData({
              isInitPositions:1
            });
          }else{
    
            var myEventDetail =
              { memberInfo: memberInfo, members: members } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('progressChange', myEventDetail, myEventOption);
          }
          
        }
      });
    },

    registerShowPlayers: function () {
      var outThis = this;
      socketUtil.registerCallback("showAnswerPlayers", {
        call: function (players) {
        }
      });
    },

    registerReward:function(){

      var outThis = this;
      socketUtil.registerCallback("publish_reward", {
        call: function (reward) {
          var rewardToast = outThis.selectComponent("#rewardToast");
          if (reward.status==0) {
            rewardToast.startAnnim(reward.imgUrl, 0, Math.abs(reward.rewardBean));

          } else if (reward.status == 1) {
            rewardToast.startAnnim(reward.imgUrl, 1, Math.abs(reward.subBean));
          }
        }
      });
      
    },

    registerAnswer: function () {
      var outThis = this;
      socketUtil.registerCallback("publishDoAnswer", {
        call: function (answer) {
          console.log(".......answer:"+JSON.stringify(answer));
          var player = {
            imgUrl: answer.userImg,
            optionId:answer.optionId
          }
          var questionController = outThis.selectComponent("#questionController");
          questionController.doAnswer(player);
        }
      });
    },

    //注册显示显示选择卡回调
    registerPublishShowSubjects: function () {
      var outThis = this;
      socketUtil.registerCallback("showSubjects", {
        call: function (subjectData) {
          var battleRoom = outThis.data.battleRoom;
          var members = outThis.data.members;
          outThis.setData({
            mode: 1
          });
          var questionController = outThis.selectComponent("#questionController");
          questionController.showSubjects(subjectData,battleRoom,members);
          
        }
      });
    },

    syncPaperData:function(){
      console.log("...............syncPaperData");
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;
      var outThis = this;
      syncPaperDataRequest.requestSyncPaperData(battleId,roomId,{
        success:function(data){

          outThis.setData({
            mode: 3
          });
          var stageRest = outThis.selectComponent("#stageRest");
          stageRest.initData(battleId, roomId);
          stageRest.showView();

          var stageResult = outThis.selectComponent("#stageResult");
          stageResult.showView(data.stageIndex,data.isPass);
        },
        fail:function(){
          console.log("syncPaperData.fail");
        }
      })
    },

    questionComplete:function(e){
      var outThis = this;
      this.showLoading();
      this.initMemberInfo({
        success: function (memberInfo) {

          outThis.setData({
            battleId:memberInfo.battleId,
            roomId:memberInfo.roomId,
            memberInfo:memberInfo
          });

          outThis.hideLoading();

          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('stageRest', myEventDetail, myEventOption);

          /*
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('hideMemberInfo', myEventDetail, myEventOption);
          */
        },
        fail:function(){
          
        }
      });
    },

    startStage: function (stageIndex, battleId, roomId, memberId){
      this.setData({
        mode:1
      });
      var questionController = this.selectComponent("#questionController");
      questionController.startStage(stageIndex, battleId, roomId, memberId);
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toProgress', myEventDetail, myEventOption);


      /*
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('showMemberInfo', myEventDetail, myEventOption);
      */
    },

    againClick:function(){
      this.setData({
        mode:0
      });
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;
      var menuController = this.selectComponent("#menuController");
      menuController.initBackground()
      menuController.againClick();
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('back', myEventDetail, myEventOption);
    },

    registerBattleEndCallback:function(){
      var outThis = this;
      socketUtil.registerCallback("battleEndCode", {
        call: function (ranks) {
          outThis.setData({
            mode:1
          });
          var questionController = outThis.selectComponent("#questionController");
          questionController.stop();

          var myEventDetail =
            {ranks: ranks} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('battleEnd', myEventDetail, myEventOption);
          outThis.setData({
            mode:3
          });
          var battleId = outThis.data.battleId;
          var roomId = outThis.data.roomId;
          var stageRest = outThis.selectComponent("#stageRest");
          stageRest.initData(battleId, roomId);
          stageRest.showView();
          stageRest.hideReadyButton();
          outThis.hideLoading();
        }
      });
    },


    registerProgressCodeCallback: function () {
      var outThis = this;
      socketUtil.registerCallback("progressCode", {
        call: function (callbackMembers) {
          var memberInfo = outThis.data.memberInfo;
          var myEventDetail =
            {memberInfo:memberInfo,members:callbackMembers} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('progressChange', myEventDetail, myEventOption);
          var stageRest = outThis.selectComponent("#stageRest");
          if(stageRest){
            for (var i = 0; i < callbackMembers.length;i++){
              stageRest.setMember({
                process: callbackMembers[i].process,
                stageIndex: callbackMembers[i].stageIndex,
                thisProcess: callbackMembers[i].thisProcess,
                loveResidule: callbackMembers[i].loveCount,
                memberId: callbackMembers[i].memberId
              });
            }
            
          }
        }
      })
    },


    registerTakepartCodeCallback: function () {
      var outThis = this;
      socketUtil.registerCallback("takepartCode", {
        call: function (memberInfo) {
          console.log("memberInfo:"+JSON.stringify(memberInfo));
        }
      });
    },

    registerRoomStartCodeCallback: function () {
      var outThis = this;
      socketUtil.registerCallback("roomStartCode", {
        call: function (room) {
          console.log("room:"+JSON.stringify(room));
        }
      });
    },

    answerResultHandle:function(e){
      var data = e.detail.data;
      var memberInfo = this.data.memberInfo;
      memberInfo.process = data.memberProcess;
      memberInfo.loveResidule = data.loveResidule;
      this.hideLoading();
      var myEventDetail =
        {memberInfo:memberInfo} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('initMemberInfo', myEventDetail, myEventOption);
      var processGogal = data.processGogal;
      var memberProcess = data.memberProcess;
      var loveResidule = data.loveResidule;
      if (processGogal <= memberProcess) {
        var battleId = this.data.battleId;
        var roomId = this.data.roomId;
        this.syncPaperData();
        this.setData({
          mode: 1
        });
        var questionController = this.selectComponent("#questionController");
        questionController.stop();
      } else if (!loveResidule){
        console.log(".................看看这里有没有进来");
        var battleId = this.data.battleId;
        var roomId = this.data.roomId;
        this.syncPaperData();
        this.setData({
          mode:1
        });
        var questionController = this.selectComponent("#questionController");
        questionController.stop();
 
      }else if(data.isLast){
        this.syncPaperData();
      }else if(!data.right){
        this.syncPaperData();
      }
    },

    initMemberInfo: function (callback) {
      var outThis = this;
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;

      battleMemberInfoRequest.getBattleMemberInfo(battleId, roomId, {
        success: function (memberInfo) {
            if(callback&&callback.success){
              callback.success(memberInfo);
            }

            outThis.setData({
              memberInfo: memberInfo
            });

            var myEventDetail =
              { memberInfo: memberInfo} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('initMemberInfo', myEventDetail, myEventOption);
        },
        fail: function () {
          outThis.hideLoading();
          if (callback && callback.fail){
            wx.showModal({
              title: '加载错误',
              content: '是否重新加载',
              complete:function(){
                outThis.initMemberInfo(callback);
              }
            });
          }
        }
      });
    },

    toPkInto:function(id){
      var menuController = this.selectComponent("#menuController");
      menuController.toPkInto(id);
    },

    onShareAppMessage: function () {
      var menuController = this.selectComponent("#menuController");
      return menuController.onShareAppMessage();
    },
    
    initMembers: function () {
      var outThis = this;
      var battleId = this.data.battleId;
      var roomId = this.data.roomId;
      var groupId = "";
      var memberInfo = this.data.memberInfo;

      console.log("......battleId:"+battleId+",roomId:"+roomId);
      battleMembersRequest.getBattleMembers(battleId, roomId, {
        cache: function (battleMembers) {

        },
        success: function (battleMembers) {
          console.log("initMembers.success");
          var memberInfo = outThis.data.memberInfo;
          var myEventDetail =
            { members: battleMembers, memberInfo: memberInfo} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('initMembers', myEventDetail, myEventOption);
        },
        fail: function () {
          console.log("initMembers.fail");
        }
      }, null, groupId);
    }
  }
})
