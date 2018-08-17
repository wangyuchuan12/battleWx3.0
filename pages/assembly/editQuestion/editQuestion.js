var request = require("../../../utils/request.js");
var resourceRequest = require("../../../utils/resourceRequest.js");
var questionManagerRequest = require("../../../utils/questionManagerRequest.js");
var util = require("../../../utils/util.js");
var domain = request.getDomain();
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
    subjects:[],
    saveImg:domain+"/imgs/save.png",
    delImg: domain + "/imgs/del2.png",
    addImg: domain + "/imgs/create.png",
    menuImg: domain + "/imgs/menu.png",
    submitImg: domain + "/imgs/submit.png",
    cameraImg: domain + "/imgs/camera.png",
    backImg: domain + "/imgs/back.png",
    rwImg:domain+"/imgs/rw.png"
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

    showToast:function(msg){
      wx.showToast({
        title: msg
      });
    },

    toQuestions:function(){
      var subjectId = this.data.subjectId;
      var myEventDetail =
        { subjectId: subjectId} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toQuestions', myEventDetail, myEventOption);
    },

    subjectClick: function (e) {
      var id = e.currentTarget.id;
      this.selectSubject(id);
    },

    selectSubject: function (subjectId) {
      this.setData({
        subjectId: subjectId
      });
    },

    init: function (battleId,periodId,subjectId,type,questionId) {
      this.setData({
        battleId: battleId,
        periodId: periodId,
        subjectId: subjectId,
        question: null,
        answer: null,
        isImg: 0,
        questionType: 0,
        type:type,
        questionId:questionId,
        selectOptions: [{
          content: "",
          isRight: 1,
          id: "selectOption1"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption2"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption3"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption4"
        }],
        worldChecks: [{
          index: 0,
          id: "worldCheck0",
          status: "2"
        }, {
          index: 1,
          id: "worldCheck1",
          status: "2"
        }, {
          index: 2,
          id: "worldCheck2",
          status: "2"
        }, {
          index: 3,
          id: "worldCheck3",
          status: "2"
        }, {
          index: 4,
          id: "worldCheck4",
          status: "2"
        }, {
          index: 5,
          id: "worldCheck5",
          status: "2"
        }, {
          index: 6,
          id: "worldCheck6",
          status: "2"
        }, {
          index: 7,
          id: "worldCheck7",
          status: "2"
        }, {
          index: 8,
          id: "worldCheck8",
          status: "2"
        }, {
          index: 9,
          id: "worldCheck9",
          status: "2"
        }, {
          index: 10,
          id: "worldCheck10",
          status: "2"
        }, {
          index: 11,
          id: "worldCheck11",
          status: "2"
        }, {
          index: 12,
          id: "worldCheck12",
          status: "2"
        }, {
          index: 13,
          id: "worldCheck13",
          status: "2"
        }, {
          index: 14,
          id: "worldCheck14",
          status: "2"
        }, {
          index: 15,
          id: "worldCheck15",
          status: "2"
        }, {
          index: 16,
          id: "worldCheck16",
          status: "2"
        }, {
          index: 17,
          id: "worldCheck17",
          status: "2"
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
        }]
      });
      this.initSubjects();
      if (type==1){
        this.initQuestionInfo();
      }
    },

    initQuestionInfo:function(){
      var outThis = this;
      var questionId = this.data.questionId;
      questionManagerRequest.questionInfo(questionId,{
        success:function(question){
          

        console.log(".....question:"+JSON.stringify(question));
        var isImg = 0;

        if(question.imgUrl){
          isImg = 1;
        }

        var worldChecks = outThis.data.worldChecks;
        var worlds = outThis.data.worlds;
        if (question.type==2){
          var fillWords = question.fillWords;

          var rightAnswer = question.answer;
          if (rightAnswer){
            worlds = new Array();
            for (var i = 0; i < rightAnswer.length;i++){
              worlds.push({
                index:i
              });
            }
          }

          for (var i = 0; i < rightAnswer.length; i++) {
            if (rightAnswer[i] && worlds[i]) {
              worlds[i].content = rightAnswer[i];
              worlds[i].status = 0;
            }
          }

          for(var i=0;i<fillWords.length;i++){
            var fillWord = fillWords[i];
            if(worldChecks[i]){
              worldChecks[i].content = fillWord,
              
              worldChecks[i].status = 1;

              for(var j=0;j<worlds.length;j++){
                if (worlds[j].content == fillWord && worlds[j].status==0){
                  worlds[j].targetIndex = worldChecks[i].index;
                  worlds[j].status = 1;
                  worldChecks[i].status=0;
                }
              }
            }
          }

        }
        var options = question.options;
        var selectOptions = new Array();
        options = util.getRandomArrayElements(options,options.length);
        if(options){
          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var isRight = 0;
            var rightAnswer = question.answer;
            if (option.content == rightAnswer){
              isRight = 1;
            }else{
              isRight = 0;
            }
            selectOptions.push({
              id: option.id,
              content: option.content,
              isRight: isRight
            });
          }
        }
        outThis.setData({
          model: 1,
          questionType: question.type,
          question: question.question,
          answer: question.answer,
          isImg: isImg,
          imgUrl: question.imgUrl,
          worldChecks: worldChecks,
          worlds: worlds,
          selectOptions: selectOptions,
          saveModel:1,
          questionId: questionId
        });


        }
      })
    },

    initSubjects: function () {
      var outThis = this;
      var battleId = this.data.battleId;
      questionManagerRequest.subjects(battleId, {
        success: function (subjects) {
          console.log("........subjects:"+JSON.stringify(subjects));
          outThis.setData({
            subjects: subjects
          })
        },
        fail: function () {

        }
      });
    },

    saveQuestionClick: function () {
      var outThis = this;
      var selectOptions = this.data.selectOptions;
      var questionType = this.data.questionType;
      var question = this.data.question;
      var imgUrl = this.data.imgUrl;
      var answer = this.data.answer;

      var fillWords = "";


      var isImg = this.data.isImg;

      this.showLoading();

      if (isImg && !imgUrl) {
        this.hideLoading();
        this.showToast("请选择一张图片");
        return;
      }


      if (!imgUrl) {
        imgUrl = "";
      }

      if (!question) {
        this.hideLoading();
        this.showToast("请输入问题");
        return;
      }

      if (util.isEmojiCharacter(question)) {
        this.hideLoading();
        this.showToast("问题不能包含表情字符");
        return;
      }

      if (question.length > 200) {
        this.hideLoading();
        this.showToast("问题输入不能超过200个字符");
        return;
      }

      if (questionType == "0") {
        for (var i = 0; i < selectOptions.length; i++) {
          var selectOption = selectOptions[i];
          if (!selectOption.content) {
            this.hideLoading();
            this.showToast("选项请输入完整");
            return;
          }

          if (selectOption.content.length > 20) {
            this.hideLoading();
            this.showToast("选项不能超过20个字节");
            return;
          }


          if (util.isEmojiCharacter(selectOption.content)) {
            this.hideLoading();
            this.showToast("选项内容不能包含表情字符");
            return;
          }


        }
      }

      if (questionType == "1") {
        if (!answer) {
          this.hideLoading();
          this.showToast("请输入答案");
          return;
        }

        if (answer.length > 5) {
          this.hideLoading();
          this.showToast("输入答案不能超过5个字");
          return;
        }

        if (util.isEmojiCharacter(answer)) {
          this.hideLoading();
          this.showToast("答案内容不能包含表情字符");
          return;
        }
      }

      if (questionType == "2") {
        var worlds = this.data.worlds;
        var worldChecks = this.data.worldChecks;
        for (var i = 0; i < worlds.length; i++) {
          var world = worlds[i];
          if (!world.content) {
            this.hideLoading();
            this.showToast("答案请选择完整");
            return;
          }
        }

        for (var i = 0; i < worldChecks.length; i++) {
          var worldCheck = worldChecks[i];
          if (!worldCheck.content) {
            this.hideLoading();
            this.showToast("内容请输入完整");
            return;
          }

          if (util.isEmojiCharacter(worldCheck.content)) {
            this.hideLoading();
            this.showToast("内容不能包含表情字符");
            return;
          }
        }
      }

      this.showLoading();

      if (questionType == 2) {
        answer = "";
        var worlds = this.data.worlds;
        for (var i = 0; i < worlds.length; i++) {
          answer = answer + worlds[i].content;
        }

        var worldChecks = this.data.worldChecks;
        for (var i = 0; i < worldChecks.length; i++) {
          fillWords = fillWords + worldChecks[i].content;
        }
      }

      var options = "";


      if (questionType == 0 && selectOptions && selectOptions.length > 0) {
        var array = new Array();
        for (var i = 0; i < selectOptions.length; i++) {
          var obj = new Object();
          obj.seq = i;
          obj.content = selectOptions[i].content;
          obj.isRight = selectOptions[i].isRight;;
          obj.id = selectOptions[i].id;;
          array.push(obj);
        }
        array = util.getRandomArrayElements(array, array.length);
        options = JSON.stringify(array);
      }
      
      console.log("........options:" + JSON.stringify(options));
      

      var params = new Object();
      params.question = question;
      params.imgUrl = imgUrl;
      params.answer = answer;
      params.fillWords = fillWords;
      params.battleId = this.data.battleId;
      params.subjectId = this.data.subjectId;
      params.periodId = this.data.periodId;
      params.questionType = questionType;
      params.options = options;
      params.battleQuestionId = this.data.questionId;
      var type = this.data.type;

      if(!type){
        questionManagerRequest.addQuestion(params, {
          success: function () {
            outThis.hideLoading();
            wx.showModal({
              title: '成功',
              content: ''
            });
            outThis.toQuestions();
          },
          fail: function () {
            outThis.hideLoading();
            outThis.showToast("发生错误");
          }
        });
      }else{
        questionManagerRequest.updateQuestion(params, {
          success: function () {
            outThis.hideLoading();
            wx.showModal({
              title: '修改成功',
              content: ''
            });
            outThis.toQuestions();
          },
          fail: function () {
            outThis.hideLoading();
            outThis.showToast("发生错误");
          }
        });
      }
    },


    switchSelect: function () {
      this.setData({
        questionType: 0
      });
      
      this.setData({
        selectOptions: [{
          content: "",
          isRight: 1,
          id: "selectOption1"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption2"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption3"
        }, {
          content: "",
          isRight: 0,
          id: "selectOption4"
        }]
      })
    },

    switchBlank: function () {
      this.setData({
        questionType: 1
      });
      
    },

    switchFillTerms: function () {
      this.setData({
        questionType: 2
      });
      this.setData({
        worldChecks: [{
          index: 0,
          id: "worldCheck0",
          status: "2"
        }, {
          index: 1,
          id: "worldCheck1",
          status: "2"
        }, {
          index: 2,
          id: "worldCheck2",
          status: "2"
        }, {
          index: 3,
          id: "worldCheck3",
          status: "2"
        }, {
          index: 4,
          id: "worldCheck4",
          status: "2"
        }, {
          index: 5,
          id: "worldCheck5",
          status: "2"
        }, {
          index: 6,
          id: "worldCheck6",
          status: "2"
        }, {
          index: 7,
          id: "worldCheck7",
          status: "2"
        }, {
          index: 8,
          id: "worldCheck8",
          status: "2"
        }, {
          index: 9,
          id: "worldCheck9",
          status: "2"
        }, {
          index: 10,
          id: "worldCheck10",
          status: "2"
        }, {
          index: 11,
          id: "worldCheck11",
          status: "2"
        }, {
          index: 12,
          id: "worldCheck12",
          status: "2"
        }, {
          index: 13,
          id: "worldCheck13",
          status: "2"
        }, {
          index: 14,
          id: "worldCheck14",
          status: "2"
        }, {
          index: 15,
          id: "worldCheck15",
          status: "2"
        }, {
          index: 16,
          id: "worldCheck16",
          status: "2"
        }, {
          index: 17,
          id: "worldCheck17",
          status: "2"
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
        }]
      });
    },

    delQuestionClick:function(){
      var outThis = this;
      wx.showModal({
        title: '是否确认删除',
        success:function(data){
          if(data.confirm){
            var questionId = outThis.data.questionId;
            questionManagerRequest.delQuestion(questionId, {
              success: function () {
                wx.showModal({
                  title: '删除成功'
                });
                outThis.toQuestions();
              },
              fail: function () {

              }
            });
          }
        }
      })
      
    },

    questionInputChange: function (e) {
      this.setData({
        "question": e.detail.value
      });
    },

    answerInputChange: function (e) {
      this.setData({
        "answer": e.detail.value
      })
    },

    worldMinusClick: function () {
      var worlds = this.data.worlds;
      if (worlds.length > 1) {
        worlds.splice(worlds.length - 1, 1);
        this.setData({
          worlds: worlds
        });
      }

    },

    worldPlusClick: function () {
      var worlds = this.data.worlds;
      if (worlds.length <= 5) {
        worlds.push({
          id: "world" + worlds.length,
          status: 0,
          index: worlds.length
        });
        this.setData({
          worlds: worlds
        });
      }
    },

    selectRightOptionClick: function (e) {
      /*var id = e.currentTarget.id;
  
      var selectOptions = this.data.selectOptions;
  
      for (var i = 0; i < selectOptions.length; i++) {
        var selectOption = selectOptions[i];
        if (selectOption.id == id) {
          selectOption.isRight = 1
        } else {
          selectOption.isRight = 0
        }
      }
      this.setData({
        "selectOptions": selectOptions
      });*/
    },

    worldCheckInputBlur: function (e) {
      var id = e.currentTarget.id;
      var worldChecks = this.data.worldChecks;
      for (var i = 0; i < worldChecks.length; i++) {
        var worldCheck = worldChecks[i];
        if (worldCheck.id == id && worldCheck.content) {
          worldCheck.status = 1;
          var content = worldCheck.content;
          worldCheck.content = content[0];
        }
      }

      this.setData({
        worldChecks: worldChecks
      });
    },

    worldCheckInputChange: function (e) {
      var id = e.currentTarget.id;
      var worldChecks = this.data.worldChecks;
      for (var i = 0; i < worldChecks.length; i++) {
        var worldCheck = worldChecks[i];
        var value = e.detail.value;
        if (worldCheck.id == id) {
          //   worldCheck.status = 1;
          worldCheck.content = value;
        }
      }

      this.setData({
        worldChecks: worldChecks
      });

      //  this.worldCheckInputBlur(e);
    },

    worldCheckClick2: function (e) {
      var worldChecks = this.data.worldChecks;
      var worlds = this.data.worlds;
      var id = e.currentTarget.id;
      var worldCheck;
      var world;
      for (var i = 0; i < worldChecks.length; i++) {
        var target = worldChecks[i];
        if (target.id == id) {
          worldCheck = target;
          worldCheck.status = 2;
        }
      }

      for (var i = 0; i < worlds.length; i++) {
        if (worlds[i].targetIndex == worldCheck.index) {
          worlds[i].status = 0;
          worlds[i].content = "";
        }
      }

      this.setData({
        worlds: worlds,
        worldChecks: worldChecks
      });
    },

    worldCheckClick: function (e) {
      var worldChecks = this.data.worldChecks;
      var worlds = this.data.worlds;
      var id = e.currentTarget.id;
      var worldCheck;
      var world;
      for (var i = 0; i < worldChecks.length; i++) {
        var target = worldChecks[i];
        if (target.id == id) {
          worldCheck = target;
        }
      }

      if (worldCheck.status == 1) {
        worldCheck.status = 0;
        this.setData({
          worldChecks: worldChecks
        });
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
        //   this.eventListener.fillSubmit(this.data.questionInputData.questionId, worldStr);
      }

    },

    worldClick: function (e) {
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



    worldTypeClick: function () {
      this.setData({
        isImg: 0
      });
    },


    selectOptionInputChange: function (e) {
      var id = e.currentTarget.id;
      var selectOptions = this.data.selectOptions;

      for (var i = 0; i < selectOptions.length; i++) {
        var selectOption = selectOptions[i];
        if (selectOption.id == id) {
          selectOption.content = e.detail.value;
        }

      }
      this.setData({
        "selectOptions": selectOptions
      });
    },

    imgTypeClick: function () {
      this.setData({
        isImg: 1
      });
    },

    imgClick: function () {
      var outThis = this;
      resourceRequest.openLoadFile({
        success: function (path) {
          outThis.setData({
            isImg: 1,
            imgUrl: path
          });
        },
        fail: function () {
          console.log("fail");
        }
      });
    },


    subjectItemClick: function () {
      var battle = this.data.battle;
      if (battle) {
        wx.navigateTo({
          url: '../../subjectList/subjectList?battleId=' + battle.id
        });
      } else {
        this.showConfirm("未选择一级主题", "请选择一级主题", {
          confirm: function () {

          },
          cancel: function () {

          }
        }, "确定", "取消");
      }

    },

    questionItem1Click: function () {
      wx.navigateTo({
        url: '../../battleList/battleList'
      });
    }
  }
})
