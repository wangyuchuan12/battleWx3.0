var goodRequest = require("../../../utils/goodRequest.js");
var accountRequest = require("../../../utils/accountRequest.js");
var request = require("../../../utils/request.js");
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
    //0是道具 1是智慧豆 2砖石 3爱心
    type: 1,
    platform:"",
    goods: [/*
      {
        id:0,
        type:1,
        costType:0,
        num:2,
        cost:1
      },
      {
        id: 1,
        type: 2,
        costType: 2,
        num: 2,
        cost: 2
      }*/
    ]
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

    goodPay: function (good) {
      var outThis = this;
      accountRequest.payGood(good, {
        success: function () {
          if (good.type == 1) {
            //outThis.addBean(good.num);
          } else if (good.type == 2) {
            //outThis.addMasonry(good.num);
          } else if (good.type == 3) {
            //outThis.addLove(good.num);
          }

          if (good.costType == 1) {
            //outThis.subBean(good.cost);
          } else if (good.costType == 2) {
            //outThis.subMasonry(good.cost);
          }
          
          outThis.hideLoading();
          wx.showModal({
            title: '购买成功',
            success:function(){
              var myEventDetail =
                {} // detail对象，提供给事件监听函数
              var myEventOption = {} // 触发事件的选项
              outThis.triggerEvent('paySuccess', myEventDetail, myEventOption);
            }
          })
        },
        fail: function () {
          outThis.showToast("购买失败");
          outThis.hideLoading();
        }
      });
    },

    beanClick: function () {
      this.setData({
        type: 1
      });
      this.initGoodList();
    },

    loveClick: function () {
      this.setData({
        type: 3
      });
      this.initGoodList();
    },

    goodItemClick: function (e) {
      var outThis = this;
      var id = e.currentTarget.id;
      var goods = this.data.goods;
      this.showLoading();
      var outThis = this;
      for (var i = 0; i < goods.length; i++) {
        var good = goods[i];
        if (good.id == id) {
          if (good.costType == 2) {
            var masonry = outThis.getMasonry();
            if (good.cost > masonry) {
              outThis.showToast("砖石不足");

              outThis.hideLoading();
              return;
            }
            outThis.showConfirm("确认支付", "该商品支付" + good.cost + "砖石，是否购买", {
              confirm: function () {
                outThis.goodPay(good);
              },
              cancel: function () {
                outThis.hideLoading();
              }
            }, "确定", "取消");
          } else if (good.costType == 0) {
            outThis.goodPay(good);
          } else if (good.costType == 1) {
            var bean = outThis.getBeanCount();
            if (good.cost > bean) {
              outThis.showToast("智慧豆不足");
              outThis.hideLoading();
              return;
            }
            outThis.showConfirm("确认支付", "该商品支付" + good.cost + "智慧豆，是否购买", {
              confirm: function () {
                outThis.goodPay(good);
              },
              cancel: function () {
                outThis.hideLoading();
              }
            }, "确定", "取消");
          }
          break;
        }
      }

    },

    initGoodList: function () {
      console.log("........initGoodList");
      var outThis = this;
      var outThis = this;
      var type = this.data.type;
      
      wx.getSystemInfo({
        success: function (resp) {
          var platform = resp.platform;
          outThis.setData({
            platform: platform
          });
          outThis.showLoading();
          goodRequest.listRequest(type, {
            success: function (goods) {
              outThis.hideLoading();
              var array = new Array();
              for (var i = 0; i < goods.length; i++) {
                var good = goods[i];
                array.push({
                  id: good.id,
                  type: good.type,
                  num: good.num,
                  cost: good.cost,
                  costType: good.costType
                });
              }
              outThis.setData({
                goods: array
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
