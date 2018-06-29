var request = require("request.js");
var battleMemberInfoRequest = require("battleMemberInfoRequest.js");

var domain = request.getDomain();
var questionAnswerUrl = domain + "/api/battle/answerQuestion";

var createPaperAnswerUrl = domain + "/api/question/createPaperAnswer";

var questionResultsUrl = domain + "/api/question/questionResults";

function requestBattleQuestionAnswer(params,callback){
  request.requestWithLogin(questionAnswerUrl,params,{
    success:function(resp){
      if(resp.success){
        callback.success(resp.data);
      }else{
        callback.fail();
      }
    },
    fail:function(){
      callback.fail();
    }
  })
}


function requestQuestionResults(battleMemberPaperAnswerId,callback){
  var params = new Object();
  params.battleMemberPaperAnswerId = battleMemberPaperAnswerId;
  request.request(questionResultsUrl,params,{
    success:function(resp){
      if(resp.success){
        callback.success(resp.data);
      }else{
        callback.fail();
      }
    },
    fail:function(){
      callback.fail();
    }
  });
}

function requestCreatePaperAnswer(stageIndex,battleId, questions,roomId,callback){

  var params = new Object();
  params.questions = questions;
  params.type = 0;
  params.battleId = battleId;
  params.roomId = roomId;
  params.stageIndex = stageIndex;
  request.requestWithLogin(createPaperAnswerUrl, params, {
    success:function(resp){
      if(resp.success){
        callback.success(resp.data);
    
      }else{
        console.log(resp.errorMsg);
      }
     
    },
    fail:function(){
      console.log("fail paper answer");
    }
  });
}

module.exports = {
  requestBattleQuestionAnswer: requestBattleQuestionAnswer,
  requestCreatePaperAnswer: requestCreatePaperAnswer,
  requestQuestionResults: requestQuestionResults
}