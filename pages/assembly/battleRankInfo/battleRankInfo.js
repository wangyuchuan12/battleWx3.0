var imgResource = require("../../../utils/imgResource.js");
var request = require("../../../utils/request.js");
var domain = request.getDomain();
var battleRankRequest = require("../../../utils/battleRankRequest.js");
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
    headImg:"http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg",
    rankImgs:[{
      imgUrl:"http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
    },{
      imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
    }],
    subjectImgs: [{
      imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
    }, {
      imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
      }, {
        imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
      }, {
        imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/modelBackground.jpg"
      }],
    buttomImg: imgResource.button2Img,
    invitationImg: domain + "/imgs/invitation.png",
    createImg: domain + "/imgs/create.png",
    rankImgUrl: domain + "/imgs/rank.png",
    paperImgUrl: domain + "/imgs/paper.png",
    //0表示正常状态 1表示排名 2题库设计
    mode:0
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

    designQuestionClick: function () {

    },

    rankClick: function (e) {
      console.log("ssss");
      this.toRankInfo();
    },

    toRankInfo: function () {
      console.log("ssskks");
      var rankId = this.data.rankId;
      console.log(".......rankId:"+rankId);
      this.setData({
        mode: 1,
        isAd: 0
      });
      var battleRank = this.selectComponent("#battleRank");
      battleRank.init(rankId);
    },

    rankStartClick:function(){
      this.rankStart();
    },

    rankStart: function () {
      var outThis = this;
      var rankId = this.data.rankId;
      this.showLoading();
      battleRankRequest.startRoomRequest(rankId, {
        success: function (data) {
          outThis.hideLoading();
          var myEventDetail =
            { roomId: data.id } // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('rankStart', myEventDetail, myEventOption);

        },
        fail: function () {

        }
      });

    },

    toBack:function(e){
      var mode = this.data.mode;
      if(mode==1){
        this.setData({
          mode:0
        });
      }else{
        var myEventDetail =
          {} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('toBack', myEventDetail, myEventOption);
      }
    },

    init: function (rankId) {
      this.setData({
        rankId: rankId,
        mode: 0
      });
    }
  }
})
