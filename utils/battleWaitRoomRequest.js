var request = require("request.js");

var domain = request.getDomain();

var createUrl = domain +"/api/battle/battleWaitRoom/create";
var intoUrl = domain + "/api/battle/battleWaitRoom/into";
var infoUrl = domain + "/api/battle/battleWaitRoom/info";
var readyUrl = domain + "/api/battle/battleWaitRoom/ready";
var cancelUrl = domain + "/api/battle/battleWaitRoom/cancel";
var startUrl = domain + "/api/battle/battleWaitRoom/start";
var kickOutUrl = domain + "/api/battle/battleWaitRoom/kickOut";
var outUrl = domain + "/api/battle/battleWaitRoom/out";
var searchRoomUrl = domain + "/api/battle/battleWaitRoom/searchRoom"
var toPublicUrl = domain +"/api/battle/battleWaitRoom/toPublic";
var toPriviteUrl = domain + "/api/battle/battleWaitRoom/toPrivite";
var ownerChangeUrl = domain + "/api/battle/battleWaitRoom/ownerChange";

function ownerChangeRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(ownerChangeUrl, params, {
    success: function (resp) {
      if (resp.success) {
        if (callback && callback.success) {
          callback.success(resp.data);
        }
      } else {
        if (callback && callback.fail) {
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:toPublicUrl");
    }
  });
}

function toPrivateRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(toPriviteUrl, params, {
    success: function (resp) {
      if (resp.success) {
        if (callback && callback.success) {
          callback.success(resp.data);
        }
      } else {
        if (callback && callback.fail) {
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:toPublicUrl");
    }
  });
}

function toPublicRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(toPublicUrl, params, {
    success: function (resp) {
      if (resp.success) {
        if (callback && callback.success) {
          callback.success(resp.data);
        }
      } else {
        if (callback && callback.fail) {
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:toPublicUrl");
    }
  });
}

function searchRoomRequest(searchKey,callback){
  var params = new Object();
  params.searchKey = searchKey;
  request.requestWithLogin(searchRoomUrl, params, {
    success: function (resp) {
      if (resp.success) {
        if (callback && callback.success) {
          callback.success(resp.data);
        }
      } else {
        if (callback && callback.fail) {
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:searchRoomRequest");
    }
  });
}

function outRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(outUrl, params, {
    success: function (resp) {
      if (resp.success) {
        if(callback&&callback.success){
          callback.success(resp.data);
        }
      } else {
        if(callback&&callback.fail){
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:kickOut");
    }
  });
}

function kickOut(roomId,memberId,callback){
  var params = new Object();
  params.roomId = roomId;
  params.memberId = memberId;
  request.requestWithLogin(kickOutUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:kickOut");
    }
  });
}

function startRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(startUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        if(resp.errorCode==0){
          callback.enReady();
        }else if(resp.errorCode==2){
          callback.toLittle();
        } else if (resp.errorCode == 1) {
          callback.roomOverdue();
        }
        else{
          callback.fail();
        }
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:startRequest");
    }
  });
}

function readyRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(readyUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:readyRequest");
    }
  });
}

function cancelRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(cancelUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:cancelRequest");
    }
  });
}

function infoRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(infoUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:infoRequest");
    }
  });
}

function intoRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(intoUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:intoRequest");
    }
  });
}

function createRequest(searchKey,callback) {
  var params = new Object();
  if (searchKey){
    params.searchKey = searchKey;
  }
  request.requestWithLogin(createUrl, params, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function (resp) {
      callback.fail("网络繁忙:createRequest");
    }
  });
}
module.exports = {
  createRequest: createRequest,
  intoRequest: intoRequest,
  infoRequest: infoRequest,
  readyRequest: readyRequest,
  cancelRequest: cancelRequest,
  startRequest: startRequest,
  kickOut: kickOut,
  outRequest: outRequest,
  toPrivateRequest: toPrivateRequest,
  toPublicRequest: toPublicRequest,
  searchRoomRequest: searchRoomRequest,
  ownerChangeRequest: ownerChangeRequest
}