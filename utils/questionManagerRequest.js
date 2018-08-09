var request = require("request.js");
var domain = request.getDomain();
var battleFactoryUrl = domain +"/api/battle/manager/question/battleFactory";
var subjectsUrl = domain + "/api/battle/manager/question/subjects";
var addSubjectsUrl = domain + "/api/battle/manager/question/addSubject";
var questionsUrl = domain + "/api/battle/manager/question/questions";
var addQuestionUrl = domain + "/api/battle/manager/question/addQuestion";
var questionInfoUrl = domain + "/api/battle/manager/question/info";
var updateQuestionUrl = domain + "/api/battle/manager/question/updateQuestion";
var delQuestionUrl = domain +"/api/battle/manager/question/delQuestion";

var delSubjectUrl = domain + "/api/battle/manager/question/delSubject";


function delSubject(subjectId, callback) {
  request.requestWithLogin(delSubjectUrl, { subjectId: subjectId }, {
    success: function (resp) {
      if (resp.success) {
        callback.success(resp.data);
      } else {
        if(resp.errorCode==0){
          callback.cascade();
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


function delQuestion(questionId, callback) {
  request.requestWithLogin(delQuestionUrl, { questionId: questionId }, {
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

function questionInfo(id, callback) {
  request.requestWithLogin(questionInfoUrl, {id:id}, {
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

function questions(battleId,subjectId, callback) {
  request.requestWithLogin(questionsUrl, { battleId: battleId, subjectId: subjectId }, {
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

function updateQuestion(params,callback){
  request.requestWithLogin(updateQuestionUrl, params, {
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

function addQuestion(params,callback){
  request.requestWithLogin(addQuestionUrl,params, {
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

function addSubject(imgUrl,name,callback) {
  request.requestWithLogin(addSubjectsUrl, { imgUrl: imgUrl,name:name}, {
    success:function(resp){
      console.log("....resp:"+JSON.stringify(resp));
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail:function(){
      callback.fail();
    }
  });
}
function battleFactory(callback){
  request.requestWithLogin(battleFactoryUrl, {}, {
    success: function (resp) {
      console.log("....resp:"+JSON.stringify(resp));
      if (resp.success) {
        callback.success(resp.data);
      } else {
        callback.fail();
      }
    },
    fail: function () {
      callback.fail();
    }
  })
}

function subjects(battleId,callback) {
  request.requestWithLogin(subjectsUrl, {battleId:battleId}, {
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
  })
}

module.exports = {
  battleFactory: battleFactory,
  subjects: subjects,
  addSubject: addSubject,
  questions: questions,
  addQuestion: addQuestion,
  questionInfo:questionInfo,
  updateQuestion: updateQuestion,
  delSubject: delSubject,
  delQuestion:delQuestion
}