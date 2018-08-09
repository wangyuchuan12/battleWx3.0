// pages/assembly/controller/questionManagerController/questionManagerController.js
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
    //0表示问题列表 1问题详情 2主题列表 3主题详情 4发布
    mode:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.toQuestions();
    },
    toSubjects:function(){
      this.setData({
        mode:2
      });

      var editSubjects = this.selectComponent("#editSubjects");
      var battleId = this.data.battleId;
      editSubjects.init(battleId);

    },

    publishRank:function(){
      this.setData({
        mode:4
      });
      var createRankPlug = this.selectComponent("#createRankPlug");
      createRankPlug.selectSubjects();
    },

    toEditSubject:function(){
      this.setData({
        mode:3
      });
    },

    editQuestionClose:function(){
      var myEventDetail ={} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('questionClose', myEventDetail, myEventOption);
    },

    toEditQuestion:function(e){
      this.setData({
        mode:1
      });
      var subjectId = e.detail.subjectId;
      var questionId = e.detail.questionId;
      var type = e.detail.type;
      var battleId = this.data.battleId;
      var periodId = this.data.periodId;
      var editQuestion = this.selectComponent("#editQuestion");
      editQuestion.init(battleId, periodId, subjectId,type,questionId);
    },

    initFactory:function(e){
      var battleId = e.detail.battleId;
      var periodId = e.detail.periodId;
      this.setData({
        battleId:battleId,
        periodId: periodId
      });
    },

    toQuestions:function(e){
      var subjectId = null;
      if(e){
        subjectId = e.detail.subjectId;
      }
     
      this.setData({
        mode:0
      });
      var editQuestions = this.selectComponent("#editQuestions");
      editQuestions.init(subjectId);
    }
  }
})
