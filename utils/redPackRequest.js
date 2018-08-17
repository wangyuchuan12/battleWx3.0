var request = require("request.js");

var domain = request.getDomain();
var addRequestUrl = domain + "/api/battle/manager/redpack/addRankRedpack";
var publicRanksRequestUrl = domain + "/api/battle/manager/redpack/publicRanks";
var addTaskUrl = domain + "/api/battle/manager/redpack/addTask";

var tasksUrl = domain + "/api/battle/manager/redpack/tasks";

var submitRedpackUrl = domain + "/api/battle/manager/redpack/submitRedpack";

var listUrl = domain + "/api/battle/redpack/list";

var infoUrl = domain + "/api/battle/redpack/info";

var receiveUrl = domain + "/api/battle/redpack/receive";

var randomRedpackUrl = domain + "/api/battle/redpack/randomRedpack";

function randomRedpackRequest(callback) {
  request.requestWithLogin(randomRedpackUrl, {}, {
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

function receiveRequest(id, callback) {
  request.requestWithLogin(receiveUrl, { id: id }, {
      success:function(resp){
        if(resp.success){
          callback.success(resp.data);
        }else{
          callback.fail();
        }
      },
      fail:function(){
        callback.fail();
      }
  });
}

function infoRequest(id,callback) {
  request.requestWithLogin(infoUrl, {id:id}, {
    success: function (resp) {
      console.log("......resp:"+JSON.stringify(resp));
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

function listRequest(callback) {
  request.requestWithLogin(listUrl, {}, {
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

function tasksRequest(redPackId, callback) {
  request.requestWithLogin(tasksUrl, { redPackId: redPackId}, {
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


function addTaskRequest(params,callback){
  request.requestWithLogin(addTaskUrl, params, {
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

function addRankRedpackRequest(params,callback){
  request.requestWithLogin(addRequestUrl, params, {
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

function submitRedpackRequest(redPackId,callback){
  request.requestWithLogin(submitRedpackUrl, { redPackId: redPackId}, {
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

function publicRanksRequest(callback){
  request.requestWithLogin(publicRanksRequestUrl,{}, {
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
  addRankRedpackRequest: addRankRedpackRequest,
  publicRanksRequest: publicRanksRequest,
  addTaskRequest: addTaskRequest,
  tasksRequest: tasksRequest,
  submitRedpackRequest: submitRedpackRequest,
  listRequest: listRequest,
  infoRequest: infoRequest,
  receiveRequest: receiveRequest,
  randomRedpackRequest: randomRedpackRequest
}