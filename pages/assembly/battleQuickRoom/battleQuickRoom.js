var battleQuickRoomRequest = require("../../../utils/battleQuickRoomRequest.js");
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
    rooms:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    takepartClick:function(e){
      var outThis = this;
      var id = e.currentTarget.id;
      var room;
      var rooms = this.data.rooms;
      for(var i=0;i<rooms.length;i++){
        if(rooms[i].id==id){
          room = rooms[i];
        }
      }
      wx.showModal({
        title: '消耗智慧豆×'+room.costBean+"，爱心×"+room.costLove,
        content: '是否确定参加',
        success:function(button){
          if(button.confirm){
            battleQuickRoomRequest.takepartRequest(id, {
              success: function (data) {
                var quickRoom = data;
                var myEventDetail = { quickRoom: quickRoom } // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('toQuickRoom', myEventDetail, myEventOption);


                myEventDetail = {} // detail对象，提供给事件监听函数
                myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('flushAttr', myEventDetail, myEventOption);
              },

              beanNotEnough: function () {
                wx.showModal({
                  title: '智慧豆不够',
                  content: '',
                });
              },

              loveNotEnough: function () {
                wx.showModal({
                  title: '爱心不够',
                  content: '',
                });
              },

              fail: function () {

              }
            });
          }
        }
      });
    },
    list:function(){
      var outThis = this;
      battleQuickRoomRequest.listRequest({
        success:function(rooms){
          console.log("rooms:"+JSON.stringify(rooms));
          outThis.setData({
            rooms:rooms
          });
        },
        fail:function(){

        }
      })
    }
  }
})
