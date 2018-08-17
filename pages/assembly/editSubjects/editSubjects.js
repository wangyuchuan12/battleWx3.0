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
    saveImg: domain + "/imgs/save.png",
    delImg: domain + "/imgs/del.png",
    addImg: domain + "/imgs/create.png",
    menuImg: domain + "/imgs/menu.png",
    submitImg: domain + "/imgs/submit.png",
    cameraImg: domain + "/imgs/camera.png",
    backImg: domain + "/imgs/back.png",
    subjects:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    delSubjectClick:function(e){
      var outThis = this;
      var id = e.currentTarget.id;
      wx.showModal({
        title: '是否确定要删除',
        success:function(){
          questionManagerRequest.delSubject(id,{
            success:function(){
              wx.showModal({
                title: '删除成功'
              });
              outThis.initSubjects();
            },
            cascade:function(){
              wx.showModal({
                title: '删除失败',
                content: '该主题下有关联的题目，请先删除题目再删主题'
              });
            },
            fail:function(){
              wx.showModal({
                title: '删除失败',
                content: '',
              });
            }
          });
        }
      });
    },

    init:function(factoryId,battleId){
      this.setData({
        battleId:battleId,
        factoryId:factoryId
      });
      this.initSubjects();
    },
    addSubjectClick:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toEditSubject', myEventDetail, myEventOption);
    },

    initSubjects: function () {
      var outThis = this;
      var battleId = this.data.battleId;
      var factoryId = this.data.factoryId;
      questionManagerRequest.subjects(battleId, {
        success: function (subjects) {
          outThis.setData({
            subjects:subjects
          });
        },
        fail: function () {

        }
      });
    },

    toQuestionsClick: function () {
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toQuestions', myEventDetail, myEventOption);
    },
  }
})
