// pages/assembly/questionInputPlug2/questionInputPlug.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  ready:function(){
    console.log(".......questionInputPlug.ready");
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: "",
    content: "答题开始",
    //0表示选择题 1表示填空题 2表示填词题
    type: 3,
    rightAnswer: "",
    answer: "",
    rightOption: 1,
    questionId: 0,
    optionAnimation:null,
    fillAnimation:null,
    isAble:1,
    worldChecks: [{
      index: 0,
      id: "worldCheck0",
      content: "",
      status: "1"
    }, {
      index: 1,
      id: "worldCheck1",
      content: "",
      status: "1"
    }, {
      index: 2,
      id: "worldCheck2",
      content: "",
      status: "1"
    }, {
      index: 3,
      id: "worldCheck3",
      content: "",
      status: "1"
    }, {
      index: 4,
      id: "worldCheck4"
    }, {
      index: 5,
      id: "worldCheck5"
    }, {
      index: 6,
      id: "worldCheck6"
    }, {
      index: 7,
      id: "worldCheck7"
    }, {
      index: 8,
      id: "worldCheck8"
    }, {
      index: 9,
      id: "worldCheck9"
    }, {
      index: 10,
      id: "worldCheck10"
    }, {
      index: 11,
      id: "worldCheck11"
    }, {
      index: 12,
      id: "worldCheck12"
    }, {
      index: 13,
      id: "worldCheck13"
    }, {
      index: 14,
      id: "worldCheck14"
    }, {
      index: 15,
      id: "worldCheck15"
    }, {
      index: 16,
      id: "worldCheck16"
    }, {
      index: 17,
      id: "worldCheck17"
    }],


    worlds: [{
      id: "world0",
      status: 0,
      index: "0"
    }, {
      id: "world1",
      index: 1,
      status: 0
    }, {
      id: "world2",
      index: 2,
      status: 0
    }, {
      id: "world3",
      index: 3,
      status: 0
    }],
    options: [{
      content: "我是你",
      id: "1",
      index: 0,
      players:[{
        imgUrl:"http://7xugu1.com1.z0.glb.clouddn.com/500522868.jpg"
      }]
    }, {
      content: "你是我",
      id: "2",
      index: 1
    }, {
      content: "你是我",
      id: "3",
      index: 1
    }, {
      content: "你是我",
      id: "4",
      index: 1
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setImgUrl:function(imgUrl){
      this.setData({
        imgUrl:imgUrl
      });
    },

    setContent:function(content){
      this.setData({
        content: content
      });
    },

    setQuestionId: function (questionId) {
      this.setData({
        "questionId": questionId
      });
    },
    getQuestionId: function () {
      return this.data.questionId;
    },
    empty: function () {
      this.setData({
        type: 0,
        rightAnswer: "",
        answer: "",
        rightOption: 1,
        questionId: 0
      });
    },

    addPlayer:function(player){

      var options = this.data.options;
      var option;
      for(var i =0;i<options.length;i++){
        if(player.optionId==options[i].id){
          option = options[i];
        }
      }
      var players;
      if(option){
        players = option.players;
        if (!players) {
          players = new Array();
        }

        players.push({
          imgUrl: player.imgUrl
        });
        option.players = players;
        this.setData({
          options: options
        });
      }
    },

    setOptions: function (options) {
      var optionArray = new Array();
      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        optionArray.push({
          content: option.content,
          index: i,
          id: option.id,
          isRight: option.isRight,
          players: option.players
        });
      }

      this.setData({
        "options": optionArray
      });
    },


    setSelectData: function (data) {
      this.setImgUrl(data.imgUrl);
      this.setContent(data.question);
      this.setQuestionId(data.id);
      this.setInputType(0);
      var array = new Array();
      var options = data.options;
      if (options) {
        for (var i = 0; i < options.length; i++) {
          var option = options[i];
          array.push({
            id: option.id,
            content: option.content,
            isRight: option.isRight,
            players:option.players
          });
        }
        this.setOptions(array);
      }

      var animation = wx.createAnimation({
        duration: 2000
      });
      animation.width(300).step();
      this.setData({
        optionAnimation: animation.export()
      });
    },

    setFillData: function (data) {
      var outThis = this;
      var answer = data.answer;
      this.setImgUrl(data.imgUrl);
      this.setContent(data.question);
      this.setQuestionId(data.id);
      this.fillWorld(null, answer.length);
      this.fillWorldCheck(data.fillWords);
      this.setInputType(2);
    },

    setDataOfAnim:function(data){
      this.setData({
        isAble:0
      });
      var type = this.data.type;
      if(type==0&&data.type==2){
        this.switchSelectToFillAnim(data);
      } else if (type == 2 && data.type == 2){
        this.switchFillToFillAnim(data);
      }else if(type==0&&data.type==0){
        this.switchSelectToSelectAnim(data);
      } else if (type == 2 && data.type == 0) {
        this.switchFillToSelectAnim(data);
      }else if(data.type==0){
        this.setSelectData(data);
      }else if(data.type==2){
        this.setFillData(data);
      }
    },

    switchSelectToFillAnim: function (data) {
      var outThis = this;
      var animation = wx.createAnimation({
        duration: 2000
      });
      setTimeout(function () {
        outThis.setFillData(data);
        var fillAnimation = wx.createAnimation({
          duration: 100
        });
        fillAnimation.opacity(0).step();
        outThis.setData({
          fillAnimation: fillAnimation.export()
        });
        setTimeout(function () {
          var fillAnimation = wx.createAnimation({
            duration: 1000
          });
          fillAnimation.opacity(1).step();
          outThis.setData({
            fillAnimation: fillAnimation.export()
          });
          outThis.setData({
            isAble:1
          });
        }, 100);
      }, 2000);
      animation.opacity(0).step();
      this.setData({
        selectAnimation: animation.export()
      });

    },

    switchFillToSelectAnim: function (data) {
      var outThis = this;
      var animation = wx.createAnimation({
        duration: 2000
      });
      setTimeout(function () {
         outThis.setSelectData(data);
         var selectAnimation = wx.createAnimation({
           duration: 100
         });
         selectAnimation.opacity(0).step();
        outThis.setData({
          optionAnimation: selectAnimation.export()
        });
        setTimeout(function(){
          var selectAnimation = wx.createAnimation({
            duration: 1000
          });
          selectAnimation.opacity(1).step();
          outThis.setData({
            optionAnimation: selectAnimation.export()
          });
          outThis.setData({
            isAble: 1
          });
        },100);
      }, 2000);
      animation.opacity(0).step();

      this.setData({
        fillAnimation: animation.export()
      });

    },

    switchSelectToSelectAnim:function(data){
      var outThis = this;
      var animation = wx.createAnimation({
        duration:1000
      });
      setTimeout(function(){
        var options = outThis.data.options;
        for(var i=0;i<options.length;i++){
          var optionContentKey = "options["+i+"].content";
          outThis.setData({
            [optionContentKey]:""
          });
          outThis.setSelectData(data);
        }
        outThis.setData({
          isAble: 1
        });
      },500);
      animation.width(0).step();

      this.setData({
        optionAnimation:animation.export()
      });

    },

    switchFillToFillAnim: function (data) {
      var outThis = this;
      var animation = wx.createAnimation({
        duration: 1000
      });
      setTimeout(function () {
        var fillAnimation = wx.createAnimation({
          duration: 1000
        });
        fillAnimation.opacity(1).step();
        outThis.setData({
          fillAnimation: fillAnimation.export()
        });
        outThis.setFillData(data);
        outThis.setData({
          isAble: 1
        });
      }, 1000);
      animation.opacity(0).step();

      this.setData({
        fillAnimation: animation.export()
      });

    },

    worldClick: function (e) {
      var isAble = this.data.isAble;
      if (!isAble) {
        return;
      }

      
      var id = e.currentTarget.id;
      var world;
      var worlds = this.data.worlds;
      var worldChecks = this.data.worldChecks;
      for (var i = 0; i < worlds.length; i++) {
        var target = worlds[i];
        if (target.id == id) {
          world = target;
          break;
        }
      }

      var worldCheck;
      for (var i = 0; i < worldChecks.length; i++) {
        var target = worldChecks[i];
        if (target.index == world.targetIndex) {
          worldCheck = target;
          break;
        }
      }

      if (world.status == 1) {
        var worldKey = "worlds[" + world.index + "]";

        var worldCheckKey = "worldChecks[" + worldCheck.index + "]";

        this.setData({
          [worldKey]: {
            id: world.id,
            index: world.index,
            status: 0,
            content: ""
          }
        });

        this.setData({
          [worldCheckKey]: {
            id: worldCheck.id,
            index: worldCheck.index,
            status: 1,
            content: world.content
          }
        });
      }


    },

    fillWorldCheck: function (worlds) {
      var worldChecks = this.data.worldChecks;

      for (var i = 0; i < worldChecks.length; i++) {
        worldChecks[i].content = "";
      }

      var outThis = this;
      for (var i = 0; i < worlds.length; i++) {
        var worldCheck = worldChecks[i];
        if (worldCheck) {
          worldCheck.content = worlds[i];
          worldCheck.status = 1;
        }
      }

      this.setData({
        "worldChecks": worldChecks
      });
    },

    fillWorld: function (worldContents, length) {

      var worlds = this.data.worlds;

      if (length) {
        worlds = new Array();
        for (var i = 0; i < length; i++) {
          worlds.push({
            content: "",
            status: 0,
            id: "world" + i,
            index: i
          });
        }
      }

      for (var i = 0; i < worlds.length; i++) {
        var worldContent;

        if (worldContents && worldContents.length > 0) {
          var worldContent = worldContents[i];
        }


        var world = worlds[i];

        if (worldContent) {
          world.content = worldContent;
          world.status = 1;
        } else {
          world.content = "";
          world.status = 0;
        }
      }

      this.setData({
        "worlds": worlds
      });

    },

    setRightAnswer: function (rightAnswer) {
      this.setData({
        "rightAnswer": rightAnswer
      });
    },

    doWorldCheck: function (id) {
      var outThis = this;
      var worldChecks = this.data.worldChecks;
      var worlds = this.data.worlds;
      var worldCheck;
      var world;
      for (var i = 0; i < worldChecks.length; i++) {
        var target = worldChecks[i];
        if (target.id == id) {
          worldCheck = target;
        }
      }

      if (worldCheck.status == 1) {
        for (var i = 0; i < worlds.length; i++) {
          var target = worlds[i];
          if (target.status == 0) {
            world = target;
            break;
          }
        }

        if (!world) {
          world = worlds[worlds.length - 1];
        }

        var worldKey = "worlds[" + world.index + "]";
        this.setData({
          [worldKey]: {
            id: world.id,
            index: world.index,
            status: 1,
            content: worldCheck.content,
            targetIndex: worldCheck.index
          }
        });

        var worldCheckKey = "worldChecks[" + worldCheck.index + "]";

        this.setData({
          [worldCheckKey]: {
            id: worldCheck.id,
            index: worldCheck.index,
            status: 0,
            content: ""
          }
        });
      }
      var worlds = this.data.worlds;
      var flag = true;
      var worldStr = "";
      for (var i = 0; i < worlds.length; i++) {
        var world = worlds[i];
        if (world.status == 0) {
          flag = false;
        } else {
          worldStr = worldStr + world.content;
        }
      }

      if (flag) {
        var myEventDetail =
          { questionId: outThis.data.questionId, worldStr: worldStr, answer: worldStr} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        outThis.triggerEvent('fillSubmit', myEventDetail, myEventOption);
        this.setData({
          isAble: 0
        });
      }
    },

    worldCheckClick: function (e) {
      var isAble = this.data.isAble;
      if (!isAble) {
        return;
      }

      var id = e.currentTarget.id;

      this.doWorldCheck(id);
    },

    inputChange: function (e) {
      this.setData({
        "answer": e.detail.value
      })
    },

    disable:function(){

      this.setData({
        isAble:0
      });

    },

    enable:function(){
      this.setData({
        isAble: 1
      });
    },

    inputItemClick: function () {
      var isAble = this.data.isAble;
      if (!isAble) {
        return;
      }

      this.setData({
        isAble: 0
      });
      if (this.data.answer.length != this.data.rightAnswer.length) {
        wx.showToast({
          title: "字数必须是" + this.data.rightAnswer.length,
          icon: "success",
          duration: 2000
        });
      } else {
        var myEventDetail =
          { questionId: outThis.data.questionId,answer:""} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        outThis.triggerEvent('inputSubmit', myEventDetail, myEventOption);
      }
    },

    doSelectItem: function (id) {
      console.log("...........doSelectItem:"+id);
      this.setData({
        isAble: 0
      });
      var outThis = this;
      var options = this.data.options;
      var rightOption = this.data.rightOption;
      var option;
      for (var i = 0; i < options.length; i++) {
        var target = options[i];
        if (target.isRight == 1) {
          target.status = 1;
        } else {
          //target.background = "red";
        }
        if (target.id == id) {
          option = target;
        }
      }

      this.setData({
        "options": options
      });

      if (!option) {
        setTimeout(function () {
          var myEventDetail =
            { questionId: outThis.data.questionId,answer:""} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('inputSubmit', myEventDetail, myEventOption);
        }, 1000);
        return;
      }
      var optionKey = "options[" + option.index + "].status";

      if (option.isRight == 1) {
        this.setData({
          [optionKey]: 1
        });
      } else {
        this.setData({
          [optionKey]: 2
        });
      }

      var outThis = this;
      setTimeout(function () {
        var myEventDetail = 
        {questionId: outThis.data.questionId,optionId:id} // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        outThis.triggerEvent('selectSubmit', myEventDetail, myEventOption);
      }, 1000);
    },

    selectItemClick: function (e) {
      var isAble = this.data.isAble;
      if (!isAble) {
        return;
      }

      this.setData({
        isAble:0
      });
      var id = e.currentTarget.id;
      this.doSelectItem(id);
    },

    setInputType: function (type) {
      this.setData({
        "type": type
      });
    }
  }
})
