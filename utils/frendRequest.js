var request = require("request.js");

var domain = request.getDomain();
var registerFrendUrl = domain + "/api/battle/frend/registerFrend";

function registerFrend(recommendUserId, callback) {
  var params = new Object();
  params.recommendUserId = recommendUserId;
  request.requestWithLogin(registerFrendUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail(resp.errorMsg);
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙");
    }
  });
}

module.exports = {
  registerFrend: registerFrend
}