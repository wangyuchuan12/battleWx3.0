var request = require("request.js");
var domain = request.getDomain();
var readyUrl = domain + "/api/waitRoom/ready";
var cancelUrl = domain + "/api/waitRoom/cancel";
var outUrl = domain + "/api/waitRoom/out";
var membersUrl = domain + "/api/waitRoom/members";
var intoUrl = domain + "/api/waitRoom/into";
var infoUrl = domain + "/api/waitRoom/info";
var addUrl = domain + "/api/waitRoom/add";
var optionsUrl = domain + "/api/waitRoom/options";
var editRoomUrl = domain + "/api/waitRoom/setRoomInfo";
var startUrl = domain + "/api/waitRoom/start";

function optionsRequest(callback) {
  var params = new Object();
  request.requestWithLogin(optionsUrl, params, {
    success: function (resp) {
      console.log("resp:"+JSON.stringify(resp));
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

function startRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(startUrl, params, {
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

function editRoomRequest(room,callback) {
  var params = new Object();
  params.id = room.id;
  params.battleId = room.battleId;
  params.name = room.name;
  params.periodId = room.periodId;
  params.processGogal = room.processGogal;
  request.requestWithLogin(editRoomUrl, params, {
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

function readyRequest(id,callback) {
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
    fail: function () {
      callback.fail();
    }
  });
}

function cancelRequest(id, callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(cancelUrl, params, {
    success: function (resp) {
      console.log(JSON.stringify(resp));
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

function outRequest(id,callback) {
  var params = new Object();
  params.id = id;
  request.requestWithLogin(outUrl, params, {
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

function infoRequest(id, callback) {
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
    fail: function () {
      callback.fail();
    }
  });
}

function membersRequest(id,callback){
  var params = new Object();
  params.id = id;
  request.requestWithLogin(membersUrl, params, {
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
    fail: function () {
      callback.fail();
    }
  });
}

function addRequest(callback){
  var params = new Object();
  request.requestWithLogin(addUrl, params, {
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
  readyRequest: readyRequest,
  outRequest: outRequest,
  membersRequest: membersRequest,
  intoRequest: intoRequest,
  addRequest: addRequest,
  cancelRequest: cancelRequest,
  infoRequest: infoRequest,
  optionsRequest: optionsRequest,
  editRoomRequest: editRoomRequest,
  startRequest: startRequest
}