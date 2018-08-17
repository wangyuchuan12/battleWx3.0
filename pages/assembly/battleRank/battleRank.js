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
    rankId:"",
    memberInfo: {
      nickname: "川川",
      rank: 2,
      headImg:"http://ovqk5bop3.bkt.clouddn.com/7541d7fe6aa3a42992c8f018234d86c7.png"
    },
    members: [{
      nickname: "川川",
      rank: 2,
      headImg: "http://ovqk5bop3.bkt.clouddn.com/7541d7fe6aa3a42992c8f018234d86c7.png"
    }],
    firstMemberInfo: {
      nickname: "川川",
      rank: 2,
      headImg: "http://ovqk5bop3.bkt.clouddn.com/7541d7fe6aa3a42992c8f018234d86c7.png",
      coverUrl:"http://ovqk5bop3.bkt.clouddn.com/7541d7fe6aa3a42992c8f018234d86c7.png"
    }
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

    init:function(id){
      var outThis = this;
      this.showLoading();
      this.setData({
        rankId:id
      });
      battleRankRequest.info(id,{
        success:function(data){
          var members = data.members;
          var roomId = data.roomId;
          var memberInfo = data.memberInfo;
          var firstMemberInfo = data.firstMemberInfo;
          outThis.setData({
            members: members,
            roomId: roomId,
            memberInfo: memberInfo,
            firstMemberInfo: firstMemberInfo
          });
          outThis.hideLoading();
        },
        fail:function(){
          console.log("init.fail");
          outThis.hideLoading();
        }
      });
    },
    rankStart:function(){
      var outThis = this;
      var rankId = this.data.rankId;
      battleRankRequest.startRoomRequest(rankId,{
        success:function(data){
          var myEventDetail =
            { roomId:data.id} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('rankStart', myEventDetail, myEventOption);
        },
        fail:function(){

        }
      });
     
    }
  }
})
