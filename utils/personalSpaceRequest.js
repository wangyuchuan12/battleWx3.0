var request = require("request.js");
var domain = request.getDomain();

var listUrl = domain + "/api/battle/personalSpace/list";

var selectSubjectsUrl = domain + "/api/battle/personalSpace/selectSubjects";

var infoUrl = domain + "/api/battle/personalSpace/info";

var infoByRankIdUrl = domain + "/api/battle/personalSpace/infoByRankId";


function infoByRankId(rankId,callback){
  request.requestWithLogin(infoByRankIdUrl, {rankId:rankId}, {
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

function info(id, callback) {
  request.requestWithLogin(infoUrl, {id:id}, {
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

function selectSubjectsRequest(factoryId,page,size,callback){
  request.requestWithLogin(selectSubjectsUrl, { factoryId:factoryId,page:page,size:size}, {
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

function listRequest(callback) {
  request.requestWithLogin(listUrl, {}, {
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
  listRequest: listRequest,
  selectSubjectsRequest: selectSubjectsRequest,
  info: info,
  infoByRankId: infoByRankId
}