var request = require("request.js");

var domain = request.getDomain();
var createRankUrl = domain + "/api/battle/manager/createRank";
var ranksUrl = domain +"/api/battle/manager/ranks";


function ranksRequest(callback) {
  request.requestWithLogin(ranksUrl,{}, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        if (resp.errorCode == 0) {
          callback.isCreated();
        } else {
          callback.fail();
        }

      }

    },
    fail: function () {
      callback.fail();
    }
  });
}
function createRankRequest(subjectIds,callback) {
  request.requestWithLogin(createRankUrl, { subjectIds: subjectIds}, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        if(resp.errorCode==0){
          callback.isCreated();
        }else{
          callback.fail();
        }
        
      }

    },
    fail: function () {
      callback.fail();
    }
  });
}

module.exports = {
  createRankRequest: createRankRequest,
  ranksRequest: ranksRequest
}