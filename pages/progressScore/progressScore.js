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

var shareUtil = require("../../utils/shareUtil.js");

var takepartRequest = require("../../utils/takepartRequest.js");

var frendRequest = require("../../utils/frendRequest.js");

var outThis;

var waitInterval;

var questionSelector;

var receiveMemberNoticeCallback;
var receiveRoomNoticeCallback;

var interval;

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
    loginShow:0,
    isDie:0,
    isLogin:0
  },

  showMemberInfo:function(){
    this.setData({
      isShowMemberInfo:1
    });
  },

  roomSignOut:function(){
    this.setData({
      mode:0
    });
    var progressController = this.selectComponent("#progressController");
    progressController.toScene("home");
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
    var memberInfo = e.detail.memberInfo
    this.setData({
      memberInfo:memberInfo
    });
    this.showMemberInfo();
    var progressMemberInfo = this.selectComponent("#progressMemberInfo");
    progressMemberInfo.setMemberInfo(memberInfo);
  },


  progressStatusChange: function (memberInfo,callbackMembers) {
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
    var callback = new Object();
    callback.call = function(){
      console.log("hshshss");
    }
    shareUtil.registerCallback("haha", callback);

    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  superSuccess:function(){
    var outThis = this;
    setTimeout(function(){
      outThis.setData({
        isDie: 0
      });
    },200);
  },

  showFullAlert2:function(e){
    var rank = e.detail.rank;
    var rewardBean = e.detail.rewardBean;
    var rewardLove = e.detail.rewardLove;
    var isPass = e.detail.isPass;
    if (isPass) {
      this.showFullAlert("通过", "第" + rank + "名", rewardBean, rewardLove, "确定");
    } else {
      this.showFullAlert("失败", "第" + rank + "名", rewardBean, rewardLove, "确定");
    }


    if (rewardBean || rewardLove) {
      outThis.flushAttr();
    }

    this.setData({
      isDie: 0
    });
  },

  loginSuccess:function(e){
    var userId = e.detail.userId;
    this.setData({
      userId: userId
    });
    console.log(".....userId:"+userId);
  },

  registerFrend: function (recommendUserId){
    frendRequest.registerFrend(recommendUserId,{
      success:function(){
        console.log("注册朋友成功")
      },
      fail:function(){
        console.log("注册朋友失败")
      }
    });
  },
  
  onLoad: function (options) {
    var recommendUserId = options.recommendUserId;
    if (recommendUserId){
      this.registerFrend(recommendUserId);
    }
    var preLoadPlug = this.selectComponent("#preLoadPlug");
    preLoadPlug.showPreLoad({
      success: function () {

      }
    });
    var outThis = this;
    var progressController = this.selectComponent("#progressController");
    progressController.init();
    

    var outThis = this;

    var skipType = options.skipType;
    var id = options.id;
    if (skipType == 2) {
      setTimeout(function(){
        progressController.toWaitRoom(id);
        var loginPlug = outThis.selectComponent("#loginPlug");
        loginPlug.startOnCheck(null, {
          success: function (data) {
            preLoadPlug.hidePreLoad();
            progressController.toPkInto(id);
            outThis.flushAttr();
            /*var progressController = outThis.selectComponent("#progressController");
            var mode = progressController.getMode();
            if(mode==8){
              progressController.toScene("home");
            }*/
          }
        },{
          call:function(data){
            console.log("**************22:"+JSON.stringify(data));
            preLoadPlug.hidePreLoad();
            progressController.toPkInto(id);
            outThis.flushAttr();
            /*var progressController = outThis.selectComponent("#progressController");
            var mode = progressController.getMode();
            if (mode == 8) {
              progressController.toScene("home");
            }*/
          }
        },{
          call:function(roomId){
            preLoadPlug.hidePreLoad();
            wx.showModal({
              title: '您还有比赛没有结束',
              content: "点击进入比赛",
              success: function (resp) {
                if (resp.confirm) {
                  progressController.takepartRoom(roomId);
                }
              }
            });
          }
        });
      },2000);
    }else if(!skipType){
      var loginPlug = this.selectComponent("#loginPlug");
      loginPlug.startOnCheck(null, {
        success: function (data) {
          preLoadPlug.hidePreLoad();
          outThis.flushAttr();
          /*var progressController = outThis.selectComponent("#progressController");
          var mode = progressController.getMode();
          if (mode == 8) {
            progressController.toScene("home");
          }*/
        }
      },{
        call:function(data){
          outThis.setData({
            userId:data.userId
          });
          
          preLoadPlug.hidePreLoad();
          outThis.flushAttr();
         /* var progressController = outThis.selectComponent("#progressController");
          var mode = progressController.getMode();
          if (mode == 8) {
            progressController.toScene("home");
          }*/
        }
      },{
        call:function(roomId){
          preLoadPlug.hidePreLoad();
          wx.showModal({
            title: '您还有比赛没有结束',
            content:"点击进入比赛",
            success:function(resp){
              if(resp.confirm){
                progressController.takepartRoom(roomId);
              }
            }
          });
        }
      });
    }else if(skipType==3){
      var loginPlug = outThis.selectComponent("#loginPlug");
      loginPlug.startOnCheck(null, {
        success: function (data) {
          var rankId = options.rankId;
          console.log("rankId:" + rankId);
          preLoadPlug.hidePreLoad();
          outThis.flushAttr();
          progressController.toRank(rankId);
        }
      }, {
          call: function (data) {
            var rankId = options.rankId;
            console.log("rankId:"+rankId);
            preLoadPlug.hidePreLoad();
            outThis.flushAttr();
            progressController.toRank(rankId);
          }
        }, {
          call: function (roomId) {
            preLoadPlug.hidePreLoad();
            wx.showModal({
              title: '您还有比赛没有结束',
              content: "点击进入比赛",
              success: function (resp) {
                if (resp.confirm) {
                  progressController.takepartRoom(roomId);
                }
              }
            });
          }
        });
    }
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

  onShareAppMessage: function (res) {
    var outThis = this;
    var progressController = this.selectComponent("#progressController");
    var onShare = progressController.onShareAppMessage();
    if(!onShare){
      var userId = this.data.userId;
      return {
        path: "pages/progressScore/progressScore?recommendUserId="+userId,
        success: function (data) {
          console.log(JSON.stringify(data));
          if(res.target){
            shareUtil.doShare(res.target.id, data.shareTickets);
          }else{
            shareUtil.doShare(null, data.shareTickets);
          }
        }
      }
    }else{

      var path = onShare.path;
      if(path.indexOf("?")>0){
        var userId = outThis.data.userId;
        path = path +"&recommendUserId="+userId
      }else{
        path = path + "?recommendUserId=" + userId
      }

      onShare.path = path;
      var success = onShare.success;

      onShare.success = function (data) {
        if(success){
          success.call();
        }
        if (res.target) {
          shareUtil.doShare(res.target.id, data.shareTickets);
        } else {
          shareUtil.doShare(null, data.shareTickets);
        }
      }
    }

    console.log("path:"+onShare.path);
    return onShare;
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
          end: member.process,
          isMy: isMy
        });
      }

      setTimeout(function () {

        var isInitPosition = outThis.data.isInitPosition;
        if (isInitPosition){
          for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            var oldPosition = outThis.getPosition(position.id);
            if (oldPosition){
              outThis.toPosition(position.id, position.end, {
                success: function () {

                }
              });
            }else{
              outThis.setPosition(position);
            }
            
          }
        }else{
          outThis.setPositions(positions);
          outThis.setData({
            isInitPosition:1
          });
        }
        
        
        
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