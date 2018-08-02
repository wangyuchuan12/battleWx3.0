var request = require("../../../utils/request.js");
var battleRequest = require("../../../utils/battleRequest.js");
var domain = request.getDomain();
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
    loveImgUrl: domain + "/imgs/lifeLoveSolid.png",
    beanImgUrl: domain + "/imgs/bean.png",
    isMall:0,
    type:1,
    isAd:1
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLoading: function () {
      wx.showLoading({
        mask: true
      });
    },
    hideLoading: function () {
      wx.hideLoading();
    },

    paySuccess:function(){

      var outThis = this;
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('flushAttr', myEventDetail, myEventOption);
      var type = this.data.type;
      if(type==0){
        this.setData({
          isMall:0
        });
        var myEventDetail =
          {} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('superSuccess', myEventDetail, myEventOption);
      }else if(type==1){
        this.setData({
          isMall:0
        });
        wx.showModal({
          title: '购买成功',
          content: '是否要补充爱心',
          success:function(){
            outThis.showLoading();
            outThis.superloveRequest({
              success:function(){
                outThis.hideLoading();
                var myEventDetail =
                  {} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('superSuccess', myEventDetail, myEventOption);
                outThis.triggerEvent('flushAttr', myEventDetail, myEventOption);
              },
              fail:function(){
                outThis.hideLoading();
                wx.showModal({
                  title: '补充失败',
                  content: ''
                });
              }
            });
          }
        })
      }
    
    },

    superloveRequest:function(callback){
      var roomId = this.data.roomId;
      battleRequest.superLoveRequest(roomId,{
        success:function(){
          callback.success();
        },
        fail:function(){
          callback.fail();
        }
      });
    },
    init:function(roomId,type){
      var outThis = this;
      this.setData({
        type:type,
        roomId:roomId
      });

      var buttonPlug = this.selectComponent("#buttonPlug");

      buttonPlug.init([{
        name:"退出",
        call:function(){
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('signOut', myEventDetail, myEventOption);
        }
      },{
        name:"补充爱心+1",
        isShare:1,
        share: function (shareTicket){
          if(!shareTicket){
            wx.showModal({
              title: '获取失败',
              content: '需要分享到微信群'
            });
            return;
          }
          var roomId = outThis.data.roomId;
          battleRequest.shareRequest(roomId,{
            success:function(data){
              wx.showModal({
                title: '分享成功，爱心+'+data.num
              });
            },
            fail:function(){
              wx.showModal({
                title: '您的次数已经上限'
              })
            }
          });
        },
        call:function(){
          console.log("补充爱心");
        }
      }]);

    },

    loveSuper:function(){
      var outThis = this;
      outThis.showLoading();
      this.superloveRequest({
        success:function(){
          outThis.hideLoading();
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('superSuccess', myEventDetail, myEventOption);

          outThis.triggerEvent('flushAttr', myEventDetail, myEventOption);
        },
        fail:function(){
          outThis.hideLoading();
          wx.showModal({
            title: '爱心不足',
            content: '是否购买',
            success:function(data){
              if(data.confirm){
                outThis.toLoveMall();
              }
            }
          })
        }
      });
    },

    signOut:function(){
      var outThis = this;
      var roomId = this.data.roomId;
      wx.showModal({
        title: '您确定要退出吗',
        success:function(data){
          if(data.confirm){
            battleRequest.signOutRequest(roomId,{
              success:function(){
                var myEventDetail =
                  {} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('roomSignOut', myEventDetail, myEventOption);
              },
              fail:function(){
                  wx.showModal({
                    title: '退出失败'
                  })
              }
            });
          }
        }
      })
      
    },

    beanSuper: function () {
      this.toBeanMall();
    },

    toBeanMall: function () {
      this.setData({
        isMall:1
      });
      var mall = this.selectComponent("#mall");
      mall.beanClick();
    },
    toLoveMall: function () {
      this.setData({
        isMall: 1
      });
      var mall = this.selectComponent("#mall");
      mall.loveClick();
    }
  }
})
