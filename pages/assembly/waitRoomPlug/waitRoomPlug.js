var socketUtil = require("../../../utils/socketUtil.js");

var waitRoomRequest = require("../../../utils/waitRoomRequest.js");
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
    id:"",
    battleId:"",
    periodId:"",
    process:"",
    isSelectShow:0,
    member:null,
    room:null,
    members:[{
      index:0,
      status:0
    },{
      index:1,
      status: 0
    },{
      index: 2,
      status: 0
    },{
      index:3,
      status:0
    },{
      index:4,
      status:0
    },{
      index:5,
      status:0
    },{
      index:6,
      status:0
    },{
      index:7,
      status:0
    },{
      index:8,
      status:0
    },{
      index:9,
      status:0
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
      ownerInto:function(){
        var outThis = this;
        this.registerWaitRoomMemberCallback();
        this.registerWaitRoomInfoCallback();
        this.registerWaitRoomStartStatusCode();
        this.add({
          success:function(){
            outThis.info({
              success:function(){
                var members = outThis.data.members;
                for(var i=0;i<members.length;i++){
                  var member = members[i];
                  if(member.isOwner){
                    outThis.setData({
                      member:member
                    });
                  }
                }
              }
            });
          }
        })
      },

      optionSelect:function(e){
        var battleId = e.detail.battleId;
        var periodId = e.detail.periodId;
        var process = e.detail.process;
        var name = e.detail.name;
        this.setData({
          isSelectShow:0,
          "room.battleId":battleId,
          "room.periodId":periodId,
          "room.processGogal":process,
          "room.name":name
        });

        var room = this.data.room;

        waitRoomRequest.editRoomRequest(room,{
          success:function(){

          },
          fail:function(){

          }
        })
      },

      attrSelectClick:function(){
        this.setData({
          isSelectShow:1
        });
        var room = this.data.room;
        var waitRoomOptionSelect = this.selectComponent("#waitRoomOptionSelect");
        var process = room.processGogal;
        var battleId = room.battleId;
        waitRoomOptionSelect.options(process, battleId);
      },

      readyClick:function(){
        var outThis = this;
        var id = this.data.id;
        waitRoomRequest.readyRequest(id,{
          success:function(member){
            outThis.setMember(member);
            outThis.setData({
              member: member
            });
          },
          fail:function(){

          }
        })
      },

      cancelClick: function () {
        var outThis = this;
        var id = this.data.id;
        waitRoomRequest.cancelRequest(id, {
          success: function (member) {
            outThis.setData({
              member: member
            });
            outThis.setMember(member);
          },
          fail: function () {

          }
        })
      },


      startClick: function () {
        var outThis = this;
        var id = this.data.id;
        waitRoomRequest.startRequest(id, {
          success: function () {
  
          },
          fail: function () {

          }
        })
      },


      registerWaitRoomMemberCallback: function () {
        var outThis = this;
        socketUtil.registerCallback("waitRoomMemberStatusCode", {
          call: function (member) {
            var room = outThis.data.room;
            if (member.waitRoomId=room.id){
              outThis.setMember(member);
            }
          }
        });
      },

      registerWaitRoomInfoCallback:function(){
        var outThis = this;
        socketUtil.registerCallback("waitRoomInfoStatusCode", {
          call: function (room) {
            var oldRoom = outThis.data.room;
            if(oldRoom.id==room.id){
              outThis.setData({
                room: room
              });
            }
            
          }
        });
      },

      registerWaitRoomStartStatusCode: function () {
        var outThis = this;
        socketUtil.registerCallback("waitRoomStartStatusCode", {
          call: function (battleRoom) {
            var myEventDetail =
              { roomId: battleRoom.id, battleId: battleRoom.battleId} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('waitEnd', myEventDetail, myEventOption);
          }
        });
      },

      visitorInto:function(id){
        var outThis = this;
        this.registerWaitRoomMemberCallback();
        this.registerWaitRoomInfoCallback();
        this.registerWaitRoomStartStatusCode();
        this.setData({
          id:id
        });
        this.into(id,{
          success: function () {
            outThis.info({
              success: function () {
                
              }
            });
          }
        });
      },

      setMember:function(member){
        var outThis = this;
        var members = this.data.members;
        var freeMember;

        for (var i = 0; i < members.length; i++) {
          var thisMember = members[i];
          if (thisMember.id == member.id) {
            var key = "members[" + i + "]";
            outThis.setData({
              [key]: member
            });

            members = outThis.data.members;
            return;
          }
        }
        for(var i=0;i<members.length;i++){
          var thisMember = members[i];
          if(thisMember.status==0){
            var key = "members["+i+"]";
            outThis.setData({
              [key]:member
            });

            members = outThis.data.members;
            console.log(".........members222:" + JSON.stringify(members));
            return;
          }
          
        }

        
      },

      add:function(callback){
        var outThis = this;
        waitRoomRequest.addRequest({
          success:function(obj){
            console.log("obj:"+JSON.stringify(obj));
            outThis.setData({
              id:obj.id
            });
            if(callback){
              callback.success();
            }
          },
          fail:function(){
            if(callback){
              callback.fail();
            }
          }
        });
      },

      
      into:function(id,callback){
        var outThis = this;
        waitRoomRequest.intoRequest(id,{
          success: function (member) {
            console.log("member:"+JSON.stringify(member));
            outThis.setData({
              member:member
            });
            if (callback) {
              callback.success();
            }
          },
          fail: function () {
            if (callback) {
              callback.fail();
            }
          }
        });
      },

      info:function(callback){
        var outThis = this;
        var id = this.data.id;
        waitRoomRequest.infoRequest(id, {
          success: function (data) {
            var room = data.room;
            var members = data.members;

            console.log("members:"+JSON.stringify(members));
            outThis.setData({
              room:room
            });
            for (var i = 0; i < members.length; i++) {
              outThis.setMember(members[i]);
            }
            if (callback) {
              callback.success();
            }
          },
          fail: function () {
            if (callback) {
              callback.fail();
            }
          }
        });
      },

      out:function(callback){
        var id = this.data.id;
        waitRoomRequest.outRequest(id, {
          success: function () {
            if (callback) {
              callback.success();
            }
          },
          fail: function () {
            if (callback) {
              callback.fail();
            }
          }
        });
      },
      ready:function(callback){
        var outThis = this;
        var id = this.data.id;
        waitRoomRequest.readyRequest(id, {
          success: function () {
            if (callback) {
              callback.success();
            }
          },
          fail: function () {
            if (callback) {
              callback.fail();
            }
          }
        });
      },
      members:function(callback){
        var outThis = this;
        var id = this.data.id;
        console.log("id:"+id);
        waitRoomRequest.membersRequest(id, {
          success: function (members) {
            console.log("........members:"+JSON.stringify(members));
            for(var i=0;i<members.length;i++){
              outThis.setMember(members[i]);
            }
            if (callback) {
              callback.success(members);
            }
          },
          fail: function () {
            if (callback) {
              callback.fail();
            }
          }
        });
      },
      onShareAppMessage: function () {

        var id = this.data.id;
        var member = this.data.member;
        //0表示主场 1表示客场
        var role = 0;
        if(member.isOwner){
          role = 0;
        }else{
          role = 1;
        }

        var path = 'pages/progressScore/progressScore?role=' + role + "&id=" + id +"&skipType=2";

        console.log("path:"+path);
        //var path = "pages/pkRoom/pkRoom?role=1&id="+this.data.id;
        return {
          path: path,
          success: function () {

          }
        }
      }
  }
})
