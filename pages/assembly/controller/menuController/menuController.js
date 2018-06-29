// pages/assembly/controller/menuController/menuController.js
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
    //0主页模式 1pk模式 2danList 3等待模式 4答题模式 5抽奖模式 6商城 7放弃页面
    mode:0,

    //0表示 danList 1表示pk 2主页
    type:2
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initBackground:function(){
      var outThis = this;
      var background = this.selectComponent("#background");
      background.initItems();
    },

    toScene:function(scene){
      var outThis = this;
      var background = this.selectComponent("#background");
      background.toScene(scene, {
        end: function () {
          if (scene =="danList"){
            outThis.setData({
              mode: 2,
              type:0
            });
            var danList = outThis.selectComponent("#danList");

            danList.initAccountResult();
          }else if(scene=="pk"){
            outThis.setData({
              mode: 1
            });
            /*var pk = outThis.selectComponent("#pk");
            pk.homeInto();*/
            var waitRoom = outThis.selectComponent("#waitRoom");
            waitRoom.ownerInto();
          }else if(scene=="home"){
            outThis.setData({
              mode: 0
            });
          }
        }
      });
    },

    toDanList:function(e){

     var outThis = this;
      var background = this.selectComponent("#background");
      background.toScene("danList", {
        end: function () {
          outThis.setData({
            mode: 2,
            type:0
          });
          var danList = outThis.selectComponent("#danList");

          danList.initAccountResult();
        }
      });
    },

    drawStop: function (e) {
      this.setData({
        mode: 3
      });
      var waitId = e.detail.waitId;
      var memberWait = this.selectComponent("#memberWait");
      memberWait.startWait(waitId);
    },

    toMall:function(){
      this.setData({
        mode:6
      });

      var mall = this.selectComponent("#mall");
      mall.initGoodList();
    },

    toHomePk:function(e){
      var outThis = this;
      var background = this.selectComponent("#background");
      background.toScene("pk",{
        end:function(){
          outThis.setData({
            mode: 1
          });

          var waitRoom = outThis.selectComponent("#waitRoom");
          waitRoom.ownerInto();
          /*
          var pk = outThis.selectComponent("#pk");
          pk.homeInto();*/
        }
      });
    },

    toPkInto: function (id) {
      this.toBeatPk(id);
    },

    onUnload: function () {
      //0主页模式 1pk模式 2danList 3等待模式 4答题模式 5抽奖模式 6商城 7放弃页面
      var mode = this.data.mode;
      //0表示 danList 1表示pk 2主页
      var type = this.data.type;
      if(mode==1){
        var pk = this.selectComponent("#pk");
        pk.signoutListener();
      }else if(mode==3){
        var memberWait = this.selectComponent("#memberWait");
        memberWait.onUnload();
      }else if(mode==4||mode==7){
        
      }
    },


    toBeatPk:function(id){
      var outThis = this;
      var background = this.selectComponent("#background");

      
      background.toScene("pk",{
        end: function () {
          outThis.setData({
            mode: 1
          });
          /*var pk = outThis.selectComponent("#pk");
          pk.beatInto(id);*/
          
          var waitRoom = outThis.selectComponent("#waitRoom");

          waitRoom.visitorInto(id,{
            success:function(){

            },
            fail:function(){

            }
          })
        }
      });
    },

    againClick:function(){
      var type = this.data.type;
      if(type==0){
        this.toDanList();
      }else{
        this.toBack();
      }
    },

    pkRoomStart:function(e){
      var battleId = e.detail.battleId;
      var roomId = e.detail.roomId;
      
      this.setData({
        mode: 7,
        type: 1
      });
      var myEventDetail =
        { roomId: roomId, battleId: battleId } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toStart', myEventDetail, myEventOption);
    },

    toPlay:function(e){

      this.setData({
        mode:5
      });

      var luckDraw = this.selectComponent("#luckDraw");
      luckDraw.initDraws();
    },
    toBack:function(){

      //0主页模式 1pk模式 2danList 3等待模式 4答题模式 5抽奖模式 6商城 7放弃页面
      var outThis = this;
      var mode = this.data.mode;
      if(mode==1||mode==3||mode==4||mode==7){
        wx.showModal({
          title: '是否确定退出',
          success:function(resp){
            if(resp.confirm){
              outThis.onUnload();
              var background = outThis.selectComponent("#background");
              outThis.setData({
                mode: 10
              });
              background.toScene("home", {
                end: function () {
                  setTimeout(function () {
                    outThis.setData({
                      mode: 0
                    });
                  }, 1000);
                }
              });
            }
          }
        });
      }else{
        outThis.setData({
          mode: 10
        });
        var background = outThis.selectComponent("#background");
        background.toScene("home", {
          end: function () {
            setTimeout(function () {
              outThis.setData({
                mode: 0
              });
            }, 1000);
          }
        });
      }
      
    },
    initDraws:function(e){
      var luckDraw = this.selectComponent("#luckDraw");
      luckDraw.startDraw();
    },
    danTakepart: function (e) {
      this.setData({
        mode: 3,
        type: 0
      });

      var waitId = e.detail.waitId;
      var danUserId = e.detail.danUserId;

      var memberWait = this.selectComponent("#memberWait");

      memberWait.startWait(waitId, danUserId);

      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('flushAttr', myEventDetail, myEventOption);
    },

    paySuccess:function(){
      var myEventDetail =
        {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('flushAttr', myEventDetail, myEventOption);

      var type = this.data.type;
      if(type==0){
        this.toDanList();
      }
    },

    waitEnd: function (e) {
      var battleRoom = e.detail.battleRoom;
      this.setData({
        mode:7
      });
      var myEventDetail =
        { battleRoom: battleRoom} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toStart', myEventDetail, myEventOption);
    },
    onShareAppMessage: function () {
      var mode = this.data.mode;
      if(mode==1){
        /*
        var pk = this.selectComponent("#pk");
        var returnValue = pk.onShareAppMessage();
        return returnValue;*/

        var waitRoom = this.selectComponent("#waitRoom");
        var returnValue = waitRoom.onShareAppMessage();
        return returnValue;
      }
    }
  }
})
