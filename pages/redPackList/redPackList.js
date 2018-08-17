// pages/redPackList/redPackList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var outThis = this;
    var loginPlug = outThis.selectComponent("#loginPlug");
    loginPlug.startOnCheck(null, {
      success: function (data) {
        outThis.toRedPackList();
      }
    }, {
        call: function (data) {
          outThis.toRedPackList();
        }
      }, {
        call: function (roomId) {
        }
      });
  },

  toRedPackList:function(){
    this.setData({
      mode:0
    });
    var redPackListPlug = this.selectComponent("#redPackListPlug");
    redPackListPlug.init();
  },

  editRedpack:function(e){
    var rankId = e.detail.rankId;
    this.setData({
      mode: 1
    });
    var redpackEdit = this.selectComponent("#redpackEdit");
    redpackEdit.init(rankId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})