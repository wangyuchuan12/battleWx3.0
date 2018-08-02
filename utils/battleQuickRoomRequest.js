var request = require("request.js");
var domain = request.getDomain();

var listUrl = domain + "/api/battle/battleQuickRoom/list";

var takepartUrl = domain + "/api/battle/battleQuickRoom/takepart";


function takepartRequest(id,callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(takepartUrl, params, {
    success: function (resp) {
      console.log("resp:"+JSON.stringify(resp));
      if (resp.success) {
        callback.success(resp.data);
      } else {
        if(resp.errorCode==0){
          callback.beanNotEnough();
        }else if(resp.errorCode==1){
          callback.loveNotEnough();
        }
      }
    },
    fail: function (resp) {
      console.log("fail");
      callback.fail("网络繁忙");
    }
  });
}

function listRequest(callback) {
  var params = new Object();
  request.requestWithLogin(listUrl, params, {
    success: function (resp) {
      console.log("....resp:"+JSON.stringify(resp));
      if (resp.success) {
        callback.success(resp.data);
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
  listRequest: listRequest,
  takepartRequest: takepartRequest
}