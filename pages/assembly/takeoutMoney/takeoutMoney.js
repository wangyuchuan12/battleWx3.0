var amountRequest = require("../../../utils/amountRequest.js");
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.initEnties();
      this.initAccountInfo();
      this.initTakeoutRecords();
    },
    initTakeoutRecords: function () {
      var outThis = this;
      amountRequest.takeoutRecords({
        success: function (records) {
          console.log("records:" + JSON.stringify(records));
          outThis.setData({
            records: records
          })
        },
        fail: function () {

        }
      });
    },

    initAccountInfo: function () {
      var outThis = this;
      var memberInfo = battleMemberInfoRequest.getBattleMemberInfoFromCache();

      this.setData({
        headImg: memberInfo.headImg
      });

      accountRequest.accountInfo({
        success: function (account) {
          outThis.setData({
            account: account
          });
        },
        fail: function () {

        }
      });
    },

    initEnties: function () {
      var outThis = this;
      amountRequest.entiesRequest({
        success: function (entries) {
          outThis.setData({
            entries: entries
          });
        },
        fail: function () {

        }
      });
    },

    entryClick: function (e) {
      var id = e.currentTarget.id;
      this.takeout(id);
    },

    takeout: function (id) {
      var outThis = this;
      var account = this.data.account;
      if (account.canTakeOutCount < 1) {
        this.showToast("本月可提现次数已经用完");
        return;
      }

      var entries = this.data.entries;

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        if (entry.id == id && entry.amount > account.amountBalance) {
          this.showToast("金额不足");
          return;
        }
      }

      outThis.showLoading();
      amountRequest.takeoutRequest(id, {
        success: function () {
          outThis.hideLoading();
          outThis.showConfirm("提现成功", "金额已转到零钱，如未到账，可能有延迟", {
            confirm: function () {

            },
            cancel: function () {

            }
          });
          outThis.initAccountInfo();
          outThis.initTakeoutRecords();
        },
        fail: function (errorMsg) {
          outThis.hideLoading();
          outThis.showToast("提现失败");
        }
      });
    }
  }
})
