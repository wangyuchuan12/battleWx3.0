var request = require("../../../utils/request.js");
var domain = request.getDomain();
var questionManagerRequest = require("../../../utils/questionManagerRequest.js");
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
    battleId:"",
    saveImg: domain + "/imgs/save.png",
    delImg: domain + "/imgs/del2.png",
    addImg: domain + "/imgs/create.png",
    menuImg: domain + "/imgs/menu.png",
    submitImg: domain + "/imgs/submit.png",
    cameraImg: domain + "/imgs/camera.png",
    backImg: domain + "/imgs/back.png",
    items:[],
    subjects:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    subjectsClick:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toSubjects', myEventDetail, myEventOption);
    },

    publishClick:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('publishRank', myEventDetail, myEventOption);
    },

    addQuestionClick:function(){

      var subjects = this.data.subjects;
      if (!subjects || subjects.length==0){
        wx.showModal({
          title: '还没有题目类型',
          content:"请先添加题目类型才能添加题目"
        });
        return;
      }
      var selectSubjectId = this.data.selectSubjectId;
      if (!selectSubjectId){
        wx.showModal({
          title: '请先选中一个主题'
        });
        return;
      }
      var myEventDetail = {subjectId:selectSubjectId,type:0} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toEditQuestion', myEventDetail, myEventOption);
    },
    initSubjects:function(callback){
      var outThis = this;
      var battleId = this.data.battleId;
      questionManagerRequest.subjects(battleId,{
        success:function(subjects){
          outThis.setData({
            subjects:subjects
          });
          if (callback){
            callback.success();
          }
        },
        fail:function(){

        }
      });
    },

    itemInfoClick:function(e){
      var id = e.currentTarget.id;
      var selectSubjectId = this.data.selectSubjectId;
      var myEventDetail = { subjectId: selectSubjectId, questionId: id ,type:1} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toEditQuestion', myEventDetail, myEventOption);
    },

    selectSubject:function(subjectId){
      this.setData({
        selectSubjectId:subjectId
      });
      var outThis = this;
      var battleId = this.data.battleId;
      questionManagerRequest.questions(battleId,subjectId,{
          success:function(questions){

            for(var i=0;i<questions.length;i++){
              var question = questions[i];
              console.log("......question:"+JSON.stringify(question));
              if(question.type==0){
                var options = question.options.split(",");
                question.options = options;
              }
              
            }
            outThis.setData({
              items: questions
            });
          },
          fail:function(){

          }
      });

    },

    toBackClick:function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    subjectClick:function(e){
      var id = e.currentTarget.id;
      this.selectSubject(id);
    },

    init:function(subjectId){
      var outThis = this;
      questionManagerRequest.battleFactory({
        success:function(data){
          outThis.setData({
            battleId:data.battleId
          });
          outThis.initSubjects({
            success:function(){
              if(subjectId){
                outThis.selectSubject(subjectId);
              }
            }
          });

          var myEventDetail =
            {battleId:data.battleId} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('initFactory', myEventDetail, myEventOption);
        },
        fail:function(){
          console.log("..........fail");
        }
      });
    }
  }
});
