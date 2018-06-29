var baseLayerout = require("../assembly/baseLayerout/baseLayerout.js");
var socketUtil = require("../../utils/socketUtil.js");
var layerout = new baseLayerout.BaseLayerout({

  /**
   * 页面的初始数据
   */
  data: {
    animation:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var outThis = this;
    /*var background = this.selectComponent("#background");
    background.initItems();
    background.toScene("home");
    setTimeout(function () {
      background.toScene("danList");
    }, 10000);*/

  /*
    var stageRest = this.selectComponent("#stageRest");

    stageRest.initData("9","c15963fd-9eb0-4fef-8705-1b3009f8ae29",{
      success:function(members){
        console.log("members:"+JSON.stringify(members));
      },
      fail:function(){

      }
    });*/


    /*
    socketUtil.openSocket();
    var memberWait = this.selectComponent("#memberWait");
    memberWait.startWait("338a5ecb-0c0e-43c8-a83c-30df9c444990");*/


    /*var progressController = this.selectComponent("#progressController");
    progressController.init();*/
    //socketUtil.openSocket();
    
    /*
    var loginPlug = this.selectComponent("#loginPlug");

    loginPlug.showOpenSocketType();*/

    /*var loginPlug = this.selectComponent("#loginPlug");
    loginPlug.showOpenSocketType();*/

    //var progressMemberInfo = this.selectComponent("#progressMemberInfo");


    /*
    var titleToast = this.selectComponent("#titleToast");

    setTimeout(function(){
      titleToast.showTitle("火影忍者", "第3关");
    },5000);
    */

    /*var questionSelector = this.selectComponent("#questionSelector");
    questionSelector.setBattleSubjects([{
      name: "哈哈",
      imgUrl: "",
      id: "1",
      num: 1
    }], 10, 0);*/

    /*this.setSelectData({
      name:"",
      imgUrl:"",
      //0选择题 1填空题 2填词题
      type:0,
      question:"这是什么问题问题",
      //答案（把可见部分的答案提取出来放进去）
      answer:"答案",
      rightAnswer:"答案",
      fillWords:"我爱你的哈哈哈烦死了地方水电费水电费是水电费水电费是的",
	    options:[{
        id:1,
        content:"答案1",
        isRight:0,
        players:[{
          imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
        }, {
          imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
          }, {
            imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
        }, {
          imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
          }, {
            imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
        }, {
          imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
          }, {
            imgUrl: "http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
        }]
      }, {
        id: 2,
        content: "答案2",
        isRight: 0
        }, {
          id: 3,
          content: "答案3",
          isRight: 1
      }, {
        id: 4,
        content: "答案4",
        isRight: 0
      }]
    });*/

    setTimeout(function(){
      var animation = wx.createAnimation({
        timingFunction: "ease",
        duration: 5000,
        delay: 1000
      });

      animation.width(500).step();
      outThis.setData({
        animation: animation.export()
      });
    },5000);
   
    
  },


  setSelectData: function (data) {
    var questionInput = this.selectComponent("#questionInput");
    questionInput.setSelectData(data);
    setTimeout(function(){
      data.type = 0;
      questionInput.setDataOfAnim(data);
    },4000)
  },

  loginSuccess:function(){
    
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

  bindGetUserInfo:function(e){
    console.log("e:"+JSON.stringify(e));
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
});

layerout.addProgressScorePlug();
layerout.begin();