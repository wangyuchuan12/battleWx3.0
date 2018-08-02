
var battleDanRequest = require("../../../utils/battleDanRequest.js");

var accountRequest = require("../../../utils/accountRequest.js");

var takepartRequest = require("../../../utils/takepartRequest.js");

var request = require("../../../utils/request.js");

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
    headimgurl: "",
    nickname: "",
    level: 1,
    exp: 0,
    currentDanId: "",
    scrollTop: 0,
    dans: [{
      id:0,
      status:0,
      danName:"原始人",
      danId:"",
      imgUrl:""
    }],
    thisDan: null,
    alertDan: null,
    isDanAlert: 0,
    questionImgUrl:""
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showLoading: function (title) {
      wx.showLoading({
        mask: true
      });
    },
    hideLoading: function () {
      wx.hideLoading();
    },
    createPaymemberVoucher:function(callback){
      var outThis = this;
      var alertDan = this.data.alertDan;

      if(alertDan){
        wx.showModal({
          title: '需要消耗' + alertDan.costBean + "智慧豆",
          content: '是否确定支付',
          success: function () {
            outThis.showLoading({
            });
            request.createPaymemberVoucher(alertDan.costBean, null, {
              success: function () {
                outThis.hideLoading();
                callback.success();
              },
              fail: function () {
                outThis.hideLoading();
                wx.showModal({
                  title: '购买失败',
                  content: '智慧豆不足',
                  success:function(){
                    wx.showModal({
                      title: '智慧豆不足',
                      content: '是否确定要充值',
                      success: function (res) {
                        if (res.confirm) {
                          var myEventDetail = {} // detail对象，提供给事件监听函数
                          var myEventOption = {} // 触发事件的选项
                          outThis.triggerEvent('toMall', myEventDetail, myEventOption);

                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }else{
        callback.success();
      }
      
    },

    initAccountResult: function () {
      var outThis = this;
      accountRequest.accountResultInfo({
        success: function (accountResult) {
          outThis.setData({
            headimgurl: accountResult.headimgurl,
            nickname: accountResult.nickname,
            level: accountResult.level,
            exp: accountResult.exp,
            danName: accountResult.danName
          });
          outThis.initBattleDans();
        },
        fail: function () {

        }
      });
    },

    initBattleDans: function () {
      var questionImgUrl = domain + "/imgs/question.png";

      var lockImgUrl = domain + "/imgs/lock.png";
      this.setData({
        questionImgUrl: questionImgUrl,
        lockImgUrl: lockImgUrl
      });
      var outThis = this;
      battleDanRequest.listRequest({
        success: function (dans) {

          console.log(".....dans:"+JSON.stringify(dans));
          outThis.setData({
            dans: dans
          });

          var thisDan;
          for (var i = 0; i < dans.length; i++) {
            if (dans[i].status == 1) {
              thisDan = dans[i];
            }
          }

          outThis.setData({
            thisDan: thisDan
          });

          setTimeout(function () {
            outThis.setData({
              currentDanId: "dan_" + thisDan.id
            });
          }, 500);
        },
        fail: function () {
          console.log("......fail");
        }
      });
    },

    danListAlertMaskClick: function () {
      this.setData({
        isDanAlert: 0
      });
    },

    danItemClick: function (e) {
      var outThis = this;
      var id = e.currentTarget.id;
      var dans = this.data.dans;
      for (var i = 0; i < dans.length; i++) {
        var dan = dans[i];
        if (dan.id == id) {
          if (dan.status == 0) {
            wx.showModal({
              title: '该段位未开启',
              content: '请先完成上一个段位',
              confirm: function () {

              },
              cancel: function () {

              }
            });
            return;
          }
          /*
          var isSign = dan.isSign;
          if (isSign == 1) {
            outThis.setData({
              roomId: data.roomId,
              battleId: data.battleId
            });
            outThis.startTo();
          } else {
            this.setData({
              isDanAlert: 1,
              alertDan: dan
            });
          }*/
          outThis.setData({
            isDanAlert: 1,
            alertDan: dan
          });
          return;
        }
      }

    },

    restart: function (danId) {
      var dans = this.data.dans;
      for (var i = 0; i < dans.length; i++) {
        var dan = dans[i];
        if (dan.id = danId) {

          this.setData({
            isDanAlert: 1,
            alertDan: dan
          });
          return;
        }
      }
    },

    startTo: function (waitId,danUserId) {

      /*
        wx.navigateTo({
          url: '../progressScore/progressScore2?roomId=' + roomId + "&battleId=" + battleId + "&againButton=返回"
        });
      */

      var myEventDetail = {waitId:waitId,danUserId:danUserId} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('danTakepart', myEventDetail, myEventOption);
    },

    signClick: function () {
      var outThis = this;
      var alertDan = this.data.alertDan;
      outThis.setData({
        isDanAlert: 0
      });

      outThis.createPaymemberVoucher({
        success:function(){
            outThis.showLoading();
            battleDanRequest.danSign(alertDan.id, {
              success: function (data) {
                outThis.hideLoading();
                var waitId = data.waitId;
                var danUserId = data.danUserId;
                outThis.startTo(waitId, danUserId);

              },
              beanNotEnough: function () {
                console.log("......beanNotEnough");
                outThis.hideLoading();
                wx.showModal({
                  title: '智慧豆不足',
                  content: '是否确定要充值',
                  success: function (res) {
                    if (res.confirm) {
                      /*wx.navigateTo({
                        url: '../mall/mall'
                      });*/

                      var myEventDetail = {} // detail对象，提供给事件监听函数
                      var myEventOption = {} // 触发事件的选项
                      outThis.triggerEvent('toMall', myEventDetail, myEventOption);

                    }
                  }
                });
              },
              fail: function () {
                outThis.hideLoading();
              }
            });
        }
      });
    }
  }
})
