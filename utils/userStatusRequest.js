var request = require("request.js");
var domain = request.getDomain();
var userStatusInfoUrl = domain + "/api/userStatus/info";
function userStatusInfoRequest(callback) {
  var params = new Object();
  request.requestWithLogin(userStatusInfoUrl, params, {
    success:function(resp){
      if(resp.success){
        var data = resp.data;
        if (data.isLine){
          callback.isLine(resp.data);
        }else{
          callback.notLine();
        }


        if (data.isProgress){
          callback.isProgress(data.roomId);
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