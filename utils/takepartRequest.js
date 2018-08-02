var request = require("request.js");

var domain = request.getDomain();
var takepartUrl = domain + "/api/battle/takepart";


function battleTakepart(id,callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(takepartUrl, params, {
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
  battleTakepart: battleTakepart
}