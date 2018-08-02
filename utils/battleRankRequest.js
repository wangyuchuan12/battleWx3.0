var request = require("request.js");
var domain = request.getDomain();

var infoUrl = domain + "/api/battle/battleRank/info";


var bInfoUrl = domain + "/api/battle/battleRank/bInfo";

var loveCoolUrl = domain + "/api/battle/battleRank/loveCool";


var startRoomUrl = domain + "/api/battle/battleRank/startRoom";

function startRoomRequest(rankId, callback) {
  request.requestWithLogin(startRoomUrl, { rankId: rankId }, {
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


function loveCoolRequest(id,callback) {
  var params = new Object();
  params.rankId = id;
  request.requestWithLogin(loveCoolUrl, params, {
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

function info(id,callback) {
  var params = new Object();
  params.rankId = id;
  request.requestWithLogin(infoUrl, params, {
    success: function (resp) {
      if(resp.success){
        var data = resp.data;
        callback.success(data);
      }else{
        callback.fail();
      }
    },
    fail: function (resp) {
      console.log("fail");
      callback.fail("网络繁忙");
    }
  });
}

function bInfo(id,callback) {
  var params = new Object();
  params.rankId = id;
  request.requestWithLogin(bInfoUrl, params, {
    success: function (resp) {
      if (resp.success) {
        var data = resp.data;
        callback.success(data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      console.log("fail");
      callback.fail("网络繁忙");
    }
  });
}

module.exports = {
  info: info,
  bInfo: bInfo,
  loveCoolRequest: loveCoolRequest,
  startRoomRequest: startRoomRequest
}