var request = require("request.js");
var domain = request.getDomain();
var userStatusInfoUrl = domain + "/api/userStatus/info";
function userStatusInfoRequest(callback) {
  var params = new Object();
  request.requestWithLogin(userStatusInfoUrl, params, {
    success:function(resp){
      if(resp.success){
        var data = resp.data;
        if (data.isLine==1){
          callback.isLine();
        }else{
          callback.notLine();
        }
        
      } else if (resp.errorCode==401){
        callback.notLogin();
      }
    },
    fail:function(){
      callback.fail();
    }
  });
}

module.exports = {
  userStatusInfoRequest: userStatusInfoRequest
}