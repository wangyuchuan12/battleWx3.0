
var callbacks = new Array();
function registerCallback(code, callback) {
  removeCallback(code);
  var obj = new Object();
  obj.code = code;
  obj.callback = callback;
  callbacks.push(obj);
}

function removeCallback(code) {
  if (!callbacks || !callbacks.length) {
    return;
  }

  for (var i = 0; i < callbacks.length; i++) {
    var callback = callbacks[i];
    if (callback.code == code) {
      callbacks.splice(i, 1);
    }
  }
}

function doShare(target, shareTickets){
  for(var i=0;i<callbacks.length;i++){
    var callback = callbacks[i].callback;
    callback.call(target, shareTickets);
  }
}

module.exports = {
  registerCallback: registerCallback,
  removeCallback: removeCallback,
  doShare: doShare
}