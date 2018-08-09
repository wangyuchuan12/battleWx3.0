var request = require("../../../utils/request.js");
var domain = request.getDomain();

var personalSpaceRequest = require("../../../utils/personalSpaceRequest.js");

var battleManagerRequest = require("../../../utils/battleManagerRequest.js");
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
    invitationImg: domain +"/imgs/invitation.png",
    createImg: domain + "/imgs/create.png",
    items:[],
    //0表示主页模式 1表示新增模式
    mode:0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLoading: function () {
      wx.showLoading({
        mask: true,
        title: "正在提交数据"
      });
    },

    hideLoading: function () {
      wx.hideLoading();
    },

    createSpaceClick:function(){
      this.setData({
        mode:1
      });
      
      var questionManagerController = this.selectComponent("#questionManagerController");
      questionManagerController.init();
    },



    selectConfirm:function(e){
      var outThis = this;
      var subjectIds = e.detail.subjectIds;

      if(subjectIds.length<5){
        wx.showModal({
          title: '选取的主题不能少于5个'
        });
      }else{
        wx.showModal({
          title: '选取主题后不能修改',
          content: '是否确定选取这些主题',
          success:function(data){
            if(data.confirm){
              outThis.setData({
                mode:0
              });
              wx.showModal({
                title: '正在生成空间',
                content: '生成空间需要经过较长时间等待，请勿离开本页面，以免生成失败',
                success:function(){
                  outThis.showLoading();
                }
              });
              
              battleManagerRequest.createRankRequest(subjectIds,{
                success:function(){
                  outThis.listRequest();
                  outThis.hideLoading();
                  wx.showModal({
                    title: '创建成功',
                    content: '',
                    success:function(){

                    }
                  });
                },
                isCreated:function(){
                  outThis.hideLoading();
                  wx.showModal({
                    title: '创建失败',
                    content: '对不起，你已经创建了一个空间，只能创建一个'
                  })
                },
                fail:function(){
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

    questionClose:function(){
      this.setData({
        mode:0
      });
      this.listRequest();
    },

    toBack:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },

    itemClick:function(e){
      var outThis = this;
       var id = e.currentTarget.id;
       var items = this.data.items;
       for(var i=0;i<items.length;i++){
         var item = items[i];
         if (item.id==id){
           var myEventDetail =
             {item:item} // detail对象，提供给事件监听函数
           var myEventOption = {} // 触发事件的选项
           outThis.triggerEvent('spaceItemSelect', myEventDetail, myEventOption);
         }
       }
    },

    listRequest:function(){
      var outThis = this;
      personalSpaceRequest.listRequest({
        success:function(data){
          outThis.setData({
            items:data
          });
        }
      });
    }
  }
})
