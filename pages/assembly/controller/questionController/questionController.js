var questionRequest = require
  ("../../../../utils/questionRequest.js");
var battleStageTakepartRequest = require("../../../../utils/battleStageTakepartRequest.js");

var battleRequest = require("../../../../utils/battleRequest.js");
var questionAnswerRequest = require("../../../../utils/questionAnswerRequest.js");

var socketUtil = require("../../../../utils/socketUtil.js");
var questionSelector;
var timeSecond;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //0是答题状态 1选择题目状态
    mode:1,
    battleId:"",
    roomId:"",
    isEnd:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectSubmit: function (e) {
      console.log("e:"+JSON.stringify(e));
      var outThis = this;
      var optionId = e.detail.optionId;
      var roomId = this.data.roomId;
      var questionId = this.data.questionId;
      var memberInfo = outThis.data.memberInfo;
      questionAnswerRequest.requestBattleQuestionAnswer({
        id: questionId,
        type: 0,
        optionId: optionId,
        roomId: roomId
      }, {
          success: function (data) {
            outThis.answerResultHandle(data);
          },
          fail: function () {
            outThis.hideLoading();
          }
        });

    },


    inputSubmit: function (e) {
      var outThis = this;
      var questionId = this.data.questionId;
      var answer = e.detail.answer;
      if(!answer){
        answer = "";
      }
      var roomId = this.data.roomId;
      questionAnswerRequest.requestBattleQuestionAnswer({
        id: questionId,
        type: 2,
        answer: answer,
        roomId: roomId
      }, {
          success: function (data) {
            outThis.answerResultHandle(data);
          },
          fail: function () {
            outThis.hideLoading();
          }
        });
    },

    fillSubmit: function (e) {
      var outThis = this;
      var questionId = this.data.questionId;
      var answer = e.detail.answer;
      var roomId = this.data.roomId;
      questionAnswerRequest.requestBattleQuestionAnswer({
        id: questionId,
        type: 2,
        answer: answer,
        roomId: roomId
      }, {
          success: function (data) {
            outThis.answerResultHandle(data);
          },
          fail: function () {
            outThis.hideLoading();
          }
        });
    },


    doAnswer:function(player){
      var questionInput = this.selectComponent("#questionInput");
      questionInput.addPlayer(player);
    },

    answerResultHandle: function (data) {
      console.log(".........answerResultHandle:");
      timeSecond.stopRoundProgress();
    },

    setInputData: function (data) {
      this.setData({
        mode: 0
      });

      timeSecond = this.selectComponent("#timeSecond");
      var questionInput = this.selectComponent("#questionInput");
      timeSecond.startCoundDown(data.timeLong, {
        end: function () {
          //questionInput.doSelectItem();
        }
      });
      questionInput.setDataOfAnim(data);
      questionInput.enable();
    },


    showQuestion:function(data){
      this.setData({
        roomId:data.roomId,
        questionId:data.questionId
      });
      this.setInputData(data);
    },

    showSubjects:function(subjectData,battleRoom,members){
      this.setData({
        mode:1,
        battleRoom: battleRoom,
        members: members
      });
      var subjects = subjectData.subjects;
      var selectCount = subjectData.selectCount;
      var timeLong = subjectData.timeLong;
      var questionSelector = this.selectComponent("#questionSelector");
      questionSelector.setUnSelect();
      questionSelector.setBattleSubjects(subjects, selectCount, 0);
      questionSelector.startCountDown(timeLong);
    },

    updateSubject:function(subject){
      var questionSelector = this.selectComponent("#questionSelector");
      questionSelector.subjectStatusUpdate(subject);
    },

    selectSubject:function(e){
      var subjectId = e.detail.subjectId;
      var roomId = this.data.battleRoom.id;
      battleRequest.requestSubjectSelect(roomId, subjectId, {
        success:function(){
          console.log("selectSubject.success");
        }
      });
    },

    startStage:function(stageIndex,battleId,roomId,memberId){
      this.setData({
        mode:1,
        battleId:battleId,
        roomId:roomId,
        memberId:memberId,
        stageIndex: stageIndex
      });
      var outThis = this;
      var questionSelector = this.selectComponent("#questionSelector");
      questionSelector.initBattleSubjects(stageIndex, battleId, roomId, {
        success: function () {
          outThis.hideLoading();
        }
      }, 0);
    }
  }
})
