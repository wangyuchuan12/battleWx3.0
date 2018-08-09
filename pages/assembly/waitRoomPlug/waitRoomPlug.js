var socketUtil = require("../../../utils/socketUtil.js");

var util = require("../../../utils/util.js");

var battleWaitRoomRequest = require("../../../utils/battleWaitRoomRequest.js");

var request = require("../../../utils/request.js");
var domain = request.getDomain();
var interval;
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
    brokenNetImg: domain +"/imgs/broken_net.png",
    delImg:domain+"/imgs/del.png",
    id:"",
    battleId:"",
    periodId:"",
    process:"",
    isSelectShow:0,
    member:null,
    room:null,
    members:[]
  },

  ready: function () {
    
  },

  
  /**
   * 组件的方法列表
   */
  methods: {

      signout:function(){
        var id = this.data.room.id;
        battleWaitRoomRequest.outRequest(id);
      },

      ownerInto:function(){
        var outThis = this;
        this.initRegister();
        this.create();
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
        var id = this.data.room.id;
        battleWaitRoomRequest.readyRequest(id,{
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
        var id = this.data.room.id;
        battleWaitRoomRequest.cancelRequest(id, {
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

      delClick:function(e){
        var memberId = e.target.id;
        var roomId = this.data.room.id;
        wx.showModal({
          title: '是否踢出该用户',
          success:function(content){
           if(content.confirm){
             battleWaitRoomRequest.kickOut(roomId, memberId,{
                success:function(){
                  console.log(".....delSuccess");
                },
                fail:function(){

                }
             });
           } 
          }
        })
      },


      startClick: function () {
        var outThis = this;
        var id = this.data.room.id;
        var members = this.data.members;
        var num = 0;
        var minNum = this.data.room.minNum;
        for(var i=0;i<members.length;i++){
          var member = members[i];
          if(member.status&&member.status!=5){
            num++;
          }
        }
        if(num<this.data.room){
          wx.showModal({
            title: "开始至少需要"+this.data.room.minNum+"个人",
            content: ''
          });
          return;
        }
        this.setData({
          isStart:1
        });
        battleWaitRoomRequest.startRequest(id, {
          success: function () {
  
          },
          fail:function(){
            wx.showModal({
              title: '开始失败',
              content: ''
            });
            outThis.setData({
              isStart: 0
            });
          },
          roomOverdue:function(){
            wx.showModal({
              title: '该房间已经过期',
              content: '',
              success:function(){
                var myEventDetail =
                  {} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('toBack', myEventDetail, myEventOption);
              }
            });
          },
          enReady: function () {
            wx.showModal({
              title: '请确认是否所有人都已准备',
              content: ''
            });
            outThis.setData({
              isStart: 0
            });
          },
          toLittle:function(){
            wx.showModal({
              title: '参与人数不能低于' + minNum+"人",
              content: ''
            });
            outThis.setData({
              isStart: 0
            });
          }
        });
      },


      registerWaitRoomMemberCallback: function () {
        var outThis = this;
        socketUtil.registerCallback("waitRoomMemberStatusCode", {
          call: function (member) {
           var myMember = outThis.data.member;
           if(member.id==myMember.id){
             outThis.setData({
               member:member
             });
             
           }
            var room = outThis.data.room;
            if (member.roomId=room.id){
              outThis.setMember(member);
            }
            outThis.initMembers();
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

      registerChangeOwnerCallback: function () {
        var outThis = this;
        socketUtil.registerCallback("changeOwner", {
          call: function () {
            wx.showModal({
              title: '房主已经退出，您成为房主'
            });


            setTimeout(function(){
              battleWaitRoomRequest.ownerChangeRequest(outThis.data.room.id, {
                success: function (member) {
                  console.log("...hahahahmember:" + JSON.stringify(member));
                  outThis.setData({
                    member: member
                  });
                },
                fail: function () {

                }
              });
            },2000);
          }
        });
      },

      registerWaitRoomStartStatusCode: function () {
        var outThis = this;
        socketUtil.registerCallback("publishRoomStart", {
          call: function (battleRoom) {
            var myEventDetail =
              { battleRoom: battleRoom} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('waitEnd', myEventDetail, myEventOption);
          }
        });
      },

      registerForceKickOut:function(){
        var outThis = this;
        socketUtil.registerCallback("forceKickOut", {
          call: function (data) {
            console.log("ficedout");
            wx.showModal({
              title: data.content,
              success:function(){
                var myEventDetail =
                  {isPrompt:1} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                outThis.triggerEvent('toBack', myEventDetail, myEventOption);
              }
            });
          }
        });
      },

      initRegister:function(){
        this.registerWaitRoomMemberCallback();
        this.registerWaitRoomInfoCallback();
        this.registerWaitRoomStartStatusCode();
        this.registerForceKickOut();
        this.registerChangeOwnerCallback();
      },

      visitorInto:function(id){
        var outThis = this;
        this.initRegister();
        this.setData({
          id:id
        });
        this.into(id,{
          success: function () {
          },
          fail:function(){
            
          }
        });
      },

      initMembers:function(){
        var room = this.data.room;
        var maxNum = room.maxNum;
        var members = this.data.members;
        var valMembers = new Array();

        for(var i=0;i<members.length;i++){
          var member = members[i];
          if(member.status!=0&&member.status!=5){
            valMembers.push(member);
          }
        }
        if (maxNum > valMembers.length){
          var diffNum = maxNum - valMembers.length;
          for(var i=0;i<diffNum;i++){
            valMembers.push({
              index: 0,
              status: 0
            });
          }
        }

        this.setData({
          members: valMembers
        });
      },

      setMember:function(member){
        var lock = this.data.lock;
        if(lock){
          setTimeout(function(){
            setMember(member);
          },500);
          return;
        }


        this.setData({
          lock:1
        });
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

            outThis.initMembers();
            this.setData({
              lock: 0
            });
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

            outThis.initMembers();
            this.setData({
              lock: 0
            });
            return;
          }
          
        }
      },

      searchRoom:function(searchKey){
        var outThis = this;
        battleWaitRoomRequest.searchRoomRequest(searchKey,{
          success:function(data){
              var id = data.room.id;
              outThis.info(id,{
                success:function(){
                  outThis.visitorInto(id);
                },
                fail:function(){

                }
              });
          },
          fail:function(){
            battleWaitRoomRequest.createRequest(searchKey,{
              success:function(data){
                var room = data.room;
                outThis.setData({
                  room: room
                });

                outThis.initMembers();

                var members = data.members;
                var member = data.member;
                for (var i = 0; i < members.length; i++) {
                  outThis.setMember(members[i]);
                }
                outThis.setData({

                  member: member
                });
              },
              fail:function(){

              }
            });
          }
        });
      },

      toPrivate: function () {
        var room = this.data.room;
        var id = room.id;
        battleWaitRoomRequest.toPrivateRequest(id,{
          success: function () {

          },
          fail: function () {

          }
        });
      },


      toPublic: function () {
        var room = this.data.room;
        var id = room.id;
        battleWaitRoomRequest.toPublicRequest(id, {
          success: function () {

          },
          fail: function () {

          }
        });
      },

      create:function(searchKey,callback){
        var outThis = this;
        battleWaitRoomRequest.createRequest(searchKey,{
          success:function(data){
            var room = data.room;
            outThis.setData({
              room:room
            });
           
            outThis.initMembers();
            
            var members = data.members;
            var member = data.member;
            for(var i=0;i<members.length;i++){
              outThis.setMember(members[i]);
            }
            outThis.setData({
              
              member: member
            });

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
        battleWaitRoomRequest.intoRequest(id,{
          success: function (data) {
            if(data.room.status==2){
              wx.showModal({
                title: '比赛已经结束',
                content: '返回到主页',
                success:function(){
                  var myEventDetail =
                    {} // detail对象，提供给事件监听函数
                  var myEventOption = {} // 触发事件的选项
                  outThis.triggerEvent('toBack', myEventDetail, myEventOption);
                  
                }
              });
              return;
            }
            var member = data.member;
            var members = data.members;
            outThis.setData({
              member:member
            });
            for(var i=0;i<members.length;i++){
              var member = members[i];
              outThis.setMember(member);
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
      
      info:function(id,callback){
        var outThis = this;
        battleWaitRoomRequest.infoRequest(id, {
          success: function (data) {
           
            var members = data.members;
            var room = data.room;
            
            outThis.setData({
              room:room
            });

            outThis.initMembers();
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

        var id = this.data.room.id;
        var member = this.data.member;
        //0表示主场 1表示客场
        var role = 0;
        if(member.isOwner){
          role = 0;
        }else{
          role = 1;
        }

        var path = 'pages/progressScore/progressScore?role=' + role + "&id=" + id +"&skipType=2";
        
        //var path = "pages/pkRoom/pkRoom?role=1&id="+this.data.id;
        return {
          path: path,
          success: function () {

          }
        }
      }
  }
})
