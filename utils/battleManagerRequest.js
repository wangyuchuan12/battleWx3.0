var request = require("request.js");

var domain = request.getDomain();
var createRankUrl = domain + "/api/battle/manager/createRank";

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
  createRankRequest: createRankRequest
}