var imgResource = require("../../../utils/imgResource.js");
var request = require("../../../utils/request.js");
var domain = request.getDomain();
var battleRankRequest = require("../../../utils/battleRankRequest.js");
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
    rankMembers: [],
    subjects:[],
    buttomImg: imgResource.button2Img,
    invitationImg: domain + "/imgs/invitation.png",
    createImg: domain + "/imgs/create.png",
    rankImgUrl: domain + "/imgs/rank.png",
    paperImgUrl: domain + "/imgs/paper.png",
    //0表示正常状态 1表示排名 2题库设计
    mode: 0
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
      var myEventDetail ={} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('designQuestion', myEventDetail, myEventOption);
    },

    rankClick: function (e) {
      console.log("ssss");
      this.toRankInfo();
    },

    toRankInfo: function () {
      console.log("ssskks");
      var rankId = this.data.rankId;
      console.log(".......rankId:" + rankId);
      this.setData({
        mode: 1,
        isAd: 0
      });
      var battleRank = this.selectComponent("#battleRank");
      battleRank.init(rankId);
    },

    rankStartClick: function () {
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

    toBack: function (e) {
      var mode = this.data.mode;
      if (mode == 1) {
        this.setData({
          mode: 0
        });
      } else {
        var myEventDetail =
          {} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('toBack', myEventDetail, myEventOption);
      }
    },

    init: function (id) {
      var outThis = this;
      personalSpaceRequest.info(id,{
        success:function(data){

          console.log(".......subjects:"+JSON.stringify(data));
          outThis.setData({
            id:data.id,
            name:data.name,
            imgNum: data.imgNum,
            img1: data.img1,
            img2: data.img2,
            img3: data.img3,
            img4: data.img4,
            img5: data.img5,
            img6: data.img6,
            img7: data.img7,
            img8: data.img8,
            img9: data.img9,
            detail: data.detail,
            type: data.type,
            rankId: data.rankId,
            subjects: data.subjects,
            rankMembers: data.rankMembers
          });
        },
        fail:function(){

        }
      });
      
    }
  }
})
