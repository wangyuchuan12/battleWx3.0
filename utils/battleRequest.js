var request = require("request.js");
var domain = request.getDomain();
var subjectSelectUrl = domain + "/api/battle/subjectSelect";
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

module.exports = {
  requestSubjectSelect: requestSubjectSelect
}