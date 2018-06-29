var request = require("request.js");
var domain = request.getDomain();
var membersUrl = domain+"/api/battleStageRest/members";
var currentBattleRestUrl = domain + "/api/battleStageRest/currentBattleRest";
var readyUrl = domain + "/api/battleStageRest/ready";
var memberInfoUrl = domain +"/api/battleStageRest/memberInfo";

function ready(battleId,roomId,callback){
  request.requestWithLogin(readyUrl, {battleId:battleId,roomId:roomId}, {
    success:function(resp){
      console.log("resp:"+JSON.stringify(resp));
      if(resp.success){
        callback.success();
      }else{
        callback.fail();
      }
    },
    fail:function(){
      callback.fail();
    }
  });
}

function members(roomId,callback){
  request.requestWithLogin(membersUrl, {roomId:roomId}, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function () {
      callback.fail();
    }
  });
}

function memberInfo(battleId,roomId, callback) {
  request.requestWithLogin(memberInfoUrl, {battleId:battleId,roomId:roomId}, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function () {
      callback.fail();
    }
  });
}

module.exports = {
  ready: ready,
  members: members,
  memberInfo: memberInfo
}