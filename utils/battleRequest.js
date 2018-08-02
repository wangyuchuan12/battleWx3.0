var request = require("request.js");
var domain = request.getDomain();
var subjectSelectUrl = domain + "/api/battle/subjectSelect";
var superLoveUrl = domain + "/api/battle/superLove";
var signOutUrl = domain + "/api/battle/signOut";
var shareUrl = domain + "/api/battle/share";

function signOutRequest(id, callback) {
  var params = new Object();
  params.roomId = id;
  request.requestWithLogin(signOutUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      console.log("...fail");
      callback.fail("网络繁忙");
    }
  });
}

function superLoveRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(superLoveUrl, params, {
    success: function (resp) {
      console.log("....resp:"+JSON.stringify(resp));
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      console.log("...fail");
      callback.fail("网络繁忙");
    }
  });
}

function requestSubjectSelect(roomId,subjectId,callback){
  var params = new Object();
  params.roomId = roomId;
  params.subjectId = subjectId;
  request.requestWithLogin(subjectSelectUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙");
    }
  });
}

function shareRequest(roomId, callback) {
  var params = new Object();
  params.roomId = roomId;
  request.requestWithLogin(shareUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙");
    }
  });
}

module.exports = {
  requestSubjectSelect: requestSubjectSelect,
  superLoveRequest: superLoveRequest,
  signOutRequest: signOutRequest,
  shareRequest: shareRequest
}