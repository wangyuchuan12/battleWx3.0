var request = require("../../../utils/request.js");
var domain = request.getDomain();
var resourceRequest = require("../../../utils/resourceRequest.js");
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
    delImg: domain + "/imgs/del2.png",
    addImg: domain + "/imgs/create.png",
    menuImg: domain + "/imgs/menu.png",
    submitImg: domain + "/imgs/submit.png",
    cameraImg: domain + "/imgs/camera.png",
    backImg:domain+"/imgs/back.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSubjectsClick:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toSubjects', myEventDetail, myEventOption);
    },
    subjectSaveClick:function(){
      var outThis = this;
      var name = this.data.name;
      var imgUrl = this.data.imgUrl;
      if(!name){
        wx.showModal({
          title: '请输入名称'
        });
        return;
      }
      if(!imgUrl){
        wx.showModal({
          title: '请选择一张图片'
        });
        return;
      }
      questionManagerRequest.addSubject(imgUrl,name,{
        success:function(){
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('toSubjects', myEventDetail, myEventOption);
        },
        fail:function(){
          wx.showModal({
            title: '网络繁忙，保存失败，请稍后再试'
          })
        }
      });
    },

    nameInput:function(e){
      this.setData({
        name:e.detail.value
      });
    },

    imgClick: function () {
      var outThis = this;
      resourceRequest.openLoadFile({
        success: function (path) {
          outThis.setData({
            isImg: 1,
            imgUrl: path
          });
        },
        fail: function () {
          wx.showModal({
            title: '上传失败',
            content:"文件太大或者网络繁忙，请稍后重试"
          })
        }
      });
    },
  }
})
