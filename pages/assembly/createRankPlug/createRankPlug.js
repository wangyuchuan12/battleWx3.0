var request = require("../../../utils/request.js");
var domain = request.getDomain();
var personalSpaceRequest = require("../../../utils/personalSpaceRequest.js");
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
    confirmImg: domain + "/imgs/confirm.png",
    createImg: domain + "/imgs/create.png",
    hookImg: domain +"/imgs/confirm.png",
    subjects:[],
    page:0,
    size:10,
    maxNum:20,
    minNum:5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function () {
      wx.showLoading({
        mask: true,
        title:"加载数据"
      });
    },

    hideLoading: function () {
      wx.hideLoading();
    },

    init:function(factoryId){
      this.setData({
        factoryId:factoryId
      });
    },

    selectSubjects: function (){
      var outThis = this;
      var page = this.data.page;
      var size = this.data.size;
      var factoryId = this.data.factoryId;
      personalSpaceRequest.selectSubjectsRequest(factoryId,page,size,{
        success:function(data){
          outThis.setData({
            subjects:data
          });
        }
      });
    },

    searchScrollLower:function(){
      console.log("...searchScrollLower");
      var outThis = this;
      var page = this.data.page;
      var size = this.data.size;
      page++;
      var subjects = this.data.subjects;
      this.showLoading();
      var factoryId = this.data.factoryId;
      personalSpaceRequest.selectSubjectsRequest(factoryId,page, size, {
        success: function (array) {
          for(var i=0;i<array.length;i++){
            subjects.push(array[i]);
          }
          outThis.hideLoading();

          outThis.setData({
            subjects: subjects,
            page: page
          });
        }
      });
    },

    selectConfirm:function(){
      var minNum = this.data.minNum;
      
      var subjectIds = new Array();
      var subjects = this.data.subjects;
      for(var i=0;i<subjects.length;i++){
        var subject = subjects[i];
        if(subject.isSelect){
          subjectIds.push(subject.id);
        }
      }

      var num = subjectIds.length;
      if (num < minNum) {
        wx.showModal({
          title: '主题数量不够',
          content: '主题数量不能少于' + minNum + "个"
        });
        return;
      }

      var myEventDetail =
        { subjectIds: subjectIds} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('selectConfirm', myEventDetail, myEventOption);
    },

    toBack:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    itemClick:function(e){
      var id = e.currentTarget.id;
      var subjects = this.data.subjects;
      var maxNum = this.data.maxNum;
      var num = 0;
      var flag = 0;
      for (var i = 0; i < subjects.length; i++) {
        var subject = subjects[i];
        if (subject.isSelect) {
          num++;
        } else {
        }

        if (subject.id == id) {
          if (subject.isSelect) {
            flag = 1;
          } else {
            
          }
        }
      }
      if (maxNum <= num&&!flag) {
        wx.showModal({
          title: '数量超过限制',
          content: '最多只能选择' + maxNum + "个主题"
        });
        return;
      }
    
      for(var i=0;i<subjects.length;i++){
        var subject = subjects[i];
        if(subject.id==id){
          if(subject.isSelect){
            subject.isSelect = 0;
          }else{
            subject.isSelect = 1;
          }
        }
      }

      
      this.setData({
        subjects:subjects
      });
    }
  }
})
