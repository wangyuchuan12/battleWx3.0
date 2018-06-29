var baseLayerout = require("../assembly/baseLayerout/baseLayerout.js");

var battleMemberInfoRequest = require("../../utils/battleMemberInfoRequest.js");
var battleMembersRequest = require("../../utils/battleMembersRequest.js");

var battleStageTakepartRequest = require("../../utils/battleStageTakepartRequest.js");
var questionRequest = require
  ("../../utils/questionRequest.js");
var membersRankUtil = require("../../utils/membersRankUtil.js");

var questionAnswerRequest = require("../../utils/questionAnswerRequest.js");

var battleSyncDataRequest = require("../../utils/battleSyncDataRequest.js");

var battleNoticeRequest = require("../../utils/battleNoticeRequest.js");

var battleGiftRequest = require("../../utils/battleGiftRequest.js");

var socketUtil = require("../../utils/socketUtil.js");

var takepartRequest = require("../../utils/takepartRequest.js");

var outThis;

var waitInterval;

var questionSelector;

var receiveMemberNoticeCallback;
var receiveRoomNoticeCallback;

//自定义组件
var timeSecond;
var luckDraw;
var danList;
var pk;
var memberWait;
var questionSelector;
var questionInput;
var layerout = new baseLayerout.BaseLayerout({

  /**
   * 页面的初始数据
   */
  data: {
    //0表示菜单模式，1表示地图模式
    mode:0,
    memberInfo:null,
    members:null,
    isShowMemberInfo:0,
    loginShow:0
  },

  showMemberInfo:function(){
    this.setData({
      isShowMemberInfo:1
    });
  },

  back:function(e){
    this.setData({
      mode:0
    });
  },

  hideMemberInfo: function () {
    this.setData({
      isShowMemberInfo: 0
    });
  },

  initMembers:function(e){
    var members = e.detail.members;
    var memberInfo = e.detail.memberInfo;
    this.initPositions(members, memberInfo);
    this.setData({
      memberInfo:memberInfo,
      members:members
    });
  },

  againClick:function(){
    var progressController = this.selectComponent("#progressController");
    progressController.againClick();
  },

  battleEnd:function(e){

    this.hideMemberInfo();
    var memberInfo = this.data.memberInfo;

    var ranks = e.detail.ranks;
    var rank;

    for(var i=0;i<ranks.length;i++){
      if (ranks[i].memberId == memberInfo.id){
        rank = ranks[i];
      }
    }
    if (rank.places >= rank.rank) {
      this.showFullAlert("通过", "获得第" + rank.rank + "名", rank.rewardBean, rank.rewardLove, "确定");
    } else {
      this.showFullAlert("失败", "获得第" + rank.rank + "名", rank.rewardBean, rank.rewardLove, "确定")
    }
  },

  initMemberInfo:function(e){
    var memberInfo = e.detail.memberInfo;
    this.setData({
      memberInfo:memberInfo
    });
    this.showMemberInfo();
    var progressMemberInfo = this.selectComponent("#progressMemberInfo");
    progressMemberInfo.setMemberInfo(memberInfo);
  },


  progressStatusChange: function (memberInfo,callbackMembers) {
    console.log("callbackmembers:"+JSON.stringify(callbackMembers));
    var outThis = this;
    var memberInfo = this.data.memberInfo;
    var members = this.data.members;
    if(!members||members.length==0){
      members = new Array();
      for(var i=0;i<callbackMembers.length;i++){
        members.push({
          id:callbackMembers[i].id,
          imgUrl:callbackMembers[i].imgUrl,
          process:callbackMembers[i].process
        });
      }
      this.initPositions(members, memberInfo);
    }
    for (var i = 0; i < callbackMembers.length; i++) {
      var callbackMember = callbackMembers[i];
      
      var member = null;
      for (var j = 0; j < members.length; j++) {
        if (members[j].id == callbackMember.id) {
          member = members[j];
        }
      }

      var isScroll = 0;

      if (member.id == memberInfo.id){
        isScroll = 1;
      }

      outThis.startProcessTo(callbackMember.id, callbackMember.process, {
        success: function () {
          member.score = callbackMember.score;
          member.loveResidule = callbackMember.loveCount;
          if (callbackMember.roomStatus == 3) {
            memberInfo.roomStatus = callbackMember.roomStatus;
            outThis.setData({
              memberInfo: memberInfo
            });
            //outThis.showEnd();
          }
          outThis.setMembers(members);

        }
      }, isScroll);
    }
    
  },

  flushAttr:function(){
    this.initAccountInfo();
  },

  onShow:function(){
    var loginPlug = this.selectComponent("#loginPlug");
    var loginShow = this.data.loginShow;
    if(loginShow){
      loginPlug.showOpenSocketType(null, {
        success: function () {

        }
      });
    }
  },

  registerRoomEnd:function(){
    var outThis = this;
    socketUtil.registerCallback("publishRoomEnd", {
      call: function (room) {
        outThis.showFullAlert("通过", "33", 1, 2, "确定");
      }
    });
  },
  
  onLoad: function (options) {
    var outThis = this;
    var progressController = this.selectComponent("#progressController");
    progressController.init();
    this.registerRoomEnd();

    var preLoadPlug = this.selectComponent("#preLoadPlug");
    preLoadPlug.showPreLoad({
      success:function(){
        try{
          outThis.initAccountInfo();
          var skipType = options.skipType;
          var id = options.id;
          if (skipType == 2) {
            progressController.toPkInto(id);
          }
          outThis.setData({
            loginShow:0
          });
          setTimeout(function(){
            outThis.setData({
              loginShow:1
            });
          },10000);
        }catch(e){
          console.error(e);
        }
        
      },
      fail:function(){
        console.log("openSocket fail");
      }
    });
  },

  toProgress:function(e){
    this.setData({
      mode:1
    });
  },

  stageRest:function(e){
  },

  startProcessTo: function (memberId, toProcess, callback,isScroll) {
    var outThis = this;
    var positions = this.getPostions();
    var members = this.data.members;
    var begin = 0;
    var thisMember;
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      if (member.id == memberId) {
        begin = member.process;
        thisMember = member;
      }
    }

    var end = toProcess;

    console.log("........end:" + end + ",begin:" + begin);
    if (end > begin) {
      thisMember.process = end;
      this.setData({
        members: members
      });
      this.showMembers();

      console.log("...........thisMember:" + JSON.stringify(thisMember));
      outThis.trendBetween(memberId, begin, end, {
        success: function () {
          if (isScroll){
            outThis.containerScrollToDom(end);
          }
          if (callback && callback.success) {
            callback.success(end);
          }
        },
        step: function (index) {
          console.log("index:" + index)
        }
      });
    }
  },

  progressChange:function(e){
    var memberInfo = e.detail.memberInfo;
    var members = e.detail.members;
    this.progressStatusChange(memberInfo,members);
  },


  //关闭爱心不足，请求分享窗口
  closeShareAlertPlug: function () {
    this.setData({
      shareAlert: 0
    });
  },

  receiveGift: function () {
    var outThis = this;
    battleGiftRequest.receiveGift({
      success: function (data) {
        var bean = data.bean;
        var love = data.love;
        var count = data.count;
        outThis.showAlertPlug("今天第" + count + "次送您" + bean + "豆");
        outThis.initAccountInfo();
      },
      isReceive: function () {
        console.log("今天礼物已经领取完了");
      },
      unCondition: function () {
        console.log("领取不和条件");
      },
      fail: function () {

      }
    });
  },

  showMembers: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var progressController = this.selectComponent("#progressController");
    progressController.onUnload();
  },

  onShareAppMessage: function () {
    var outThis = this;
    var progressController = this.selectComponent("#progressController");
    /*this.setData({
      loginShow:0
    });
    setTimeout(function(){
      outThis.setData({
        loginShow:1
      });
    },20000);
    */
    return progressController.onShareAppMessage();
  },

  initPositions: function (members,memberInfo) {
    var outThis = this;

    try {

      var process = memberInfo.process;
      if (!process) {
        process = 0;
      }

      var positions = new Array();
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        var isMy = 0;
        if (member.id == memberInfo.id) {
          isMy = 1;
        }
        positions.push({
          id: member.id,
          imgUrl: member.imgUrl,
          animationData: {},
          begin: member.process,
          end: 0,
          isMy: isMy
        });
      }

      setTimeout(function () {
        outThis.setPositions(positions);
      }, 2000);
      outThis.containerScrollToDom(process);
    } catch (e) {
      setTimeout(function () {
        outThis.initPositions();
      }, 1000);
    }
  }
});

layerout.addAttrPlug();
layerout.addProgressScorePlug();
layerout.addProgressScoreMember();
layerout.addQuestionResult();
layerout.addBeanNotEnoughAlertPlug();
layerout.addAlertPlug();
layerout.addAircraftPlug();
layerout.addToastOutPlug();
layerout.begin();