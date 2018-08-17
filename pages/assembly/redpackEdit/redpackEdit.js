var redPackRequest = require("../../../utils/redPackRequest.js");
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
    mode:0,
    amount:null,
    count:null,
    name:"",
    rank:""
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

    toBack:function(){
      var rank = this.data.rank;
      var myEventDetail = {rankId:rank.id} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toBack', myEventDetail, myEventOption);
    },
    init:function(rankId){
      
    },
    amountInput:function(e){
      var amount = e.detail.value;
      this.setData({
        amount:amount
      });
    },
    countInput:function(e){
      var count = e.detail.value;
      this.setData({
        count: count
      });
    },

    nameInput:function(e){
      var name = e.detail.value;
      this.setData({
        name: name
      });
    },

    submitRedpack:function(){
      this.showLoading();
      var outThis = this;
      var params = new Object();
      params.amount = this.data.amount;
      params.count = this.data.count;
      params.name = this.data.name;
      redPackRequest.addRankRedpackRequest(params,{
        success:function(data){
          var id = data.id;
          console.log("..........id:"+id);
          outThis.setData({
            mode: 1
          });
          outThis.hideLoading();

          var redpackTaskManager = outThis.selectComponent("#redpackTaskManager");
          redpackTaskManager.init(id);
        },
        fail:function(){
          console.log("fail");
          outThis.hideLoading();
        }
      });
      
    }
  }
})
