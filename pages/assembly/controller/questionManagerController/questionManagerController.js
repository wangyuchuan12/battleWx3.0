var battleManagerRequest = require("../../../../utils/battleManagerRequest.js");
var questionManagerRequest = require("../../../../utils/questionManagerRequest.js");
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
    //0表示问题列表 1问题详情 2主题列表 3主题详情 4发布 5红包 6工厂列表
    mode:0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLoading: function (title) {
      if (!title) {
        title = "";
      }
      wx.showLoading({
        mask: true,
        title: title
      });
    },

    hideLoading: function () {
      wx.hideLoading();
    },

    init:function(factoryId){
      var outThis = this;
      this.toFactorys(factoryId);
      
    },

    toFactorys: function (factoryId){
      this.setData({
        mode:6
      });
      var editFactorys = this.selectComponent("#editFactorys");
      editFactorys.init(factoryId);
    },

    toBack:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    selectFactory:function(e){
      var outThis = this;
      var id = e.detail.id;
      this.doSelectFactory(id);
    },

    doSelectFactory:function(factoryId){
      var outThis = this;
      this.initFacoty(factoryId, {
        success: function () {
          outThis.setData({
            mode: 0
          });
          var battleId = outThis.data.battleId;
          var editQuestions = outThis.selectComponent("#editQuestions");
          editQuestions.init(battleId);
        }
      });
    },

    initFacoty:function(id,callback){
      var outThis = this;
      questionManagerRequest.battleFactory(id,{
        success: function (data) {
          outThis.setData({
            battleId:data.battleId,
            periodId:data.periodId,
            factoryId:data.id
          });
          if(callback){
            callback.success();
          }
        },
        fail: function () {
          console.log("..........fail");
        }
      });
    },

    toSubjects:function(){
      this.setData({
        mode:2
      });

      var editSubjects = this.selectComponent("#editSubjects");
      var battleId = this.data.battleId;
      var factoryId = this.data.factoryId;
      editSubjects.init(factoryId,battleId);

    },

    publishRank:function(){
      this.setData({
        mode:4
      });
      var createRankPlug = this.selectComponent("#createRankPlug");
      var factoryId = this.data.factoryId;
      createRankPlug.init(factoryId);
      createRankPlug.selectSubjects();
    },

    selectConfirm: function (e) {
      var outThis = this;
      var subjectIds = e.detail.subjectIds;

      if (subjectIds.length < 5) {
        wx.showModal({
          title: '选取的主题不能少于5个'
        });
      } else {
        wx.showModal({
          title: '选取主题后不能修改',
          content: '是否确定选取这些主题',
          success: function (data) {
            if (data.confirm) {
              outThis.setData({
                mode: 0
              });
              
              wx.showModal({
                title: '正在生成空间',
                content: '生成空间需要经过较长时间等待，请勿离开本页面，以免生成失败',
                success: function () {
                  outThis.showLoading();
                }
              });

              var factoryId = outThis.data.factoryId;
              battleManagerRequest.createRankRequest(factoryId,subjectIds, {
                success: function () {

                  outThis.hideLoading();
                  wx.showModal({
                    title: '创建成功',
                    content: '',
                    success: function () {
                      outThis.editQuestionClose();
                    }
                  });
                },
                isCreated: function () {
                  outThis.hideLoading();
                  wx.showModal({
                    title: '创建失败',
                    content: '对不起，你已经创建了一个空间，只能创建一个'
                  })
                },
                fail: function () {
                  outThis.hideLoading();
                  wx.showModal({
                    title: '创建失败'
                  })
                }
              });
            }
          }
        })
      }
    },

    toEditSubject:function(){
      this.setData({
        mode:3
      });

      var battleId = this.data.battleId;
      var factoryId = this.data.factoryId;

      var editSubject = this.selectComponent("#editSubject");
      editSubject.init(factoryId,battleId);
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
      console.log(".....editPeriod:"+periodId);
      editQuestion.init(battleId, periodId, subjectId,type,questionId);
    },


    redPackEdit:function(){
      this.setData({
        mode:5
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
      var battleId = this.data.battleId;
      editQuestions.init(battleId,subjectId);
    }
  }
})
