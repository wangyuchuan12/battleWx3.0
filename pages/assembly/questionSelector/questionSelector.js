var request = require("../../../utils/battleSubjectsRequest.js");
var util = require("../../../utils/util.js");
var roomId;
var drawSelectInterval;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  ready:function(){
    this.setData({
      type:0
    });
  },

  /**
   * 组件的初始数据
   */
  data: {
    display: "none",
    questionSelectorHeaderCount: 4,
    questionSelectorHeaderList: [],
    questionSelectorContentList: [],
    type: 0,
    isClose:0,
    isSelect:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setHeaderCount: function (count) {

      var questionSelectorHeaderList = new Array();
      for (var i = 0; i < count; i++) {
        questionSelectorHeaderList.push({
          imgUrl: "http://ovqk5bop3.bkt.clouddn.com/question2.png",
          status: 0,
          index: 0
        });
      }

      this.setData({
        "questionSelectorHeaderCount": count,
        "questionSelectorHeaderList": questionSelectorHeaderList
      });
    },

    isQuestionSelectorHeaderReady: function () {
      var array = this.data.questionSelectorHeaderList;
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.status == 0) {
          return false;
        }
      }
      return true;
    },

    init:function(members){
      this.setData({
        members:members
      });
    },

    setQuestionSelectorHeader: function (index, item, callback) {
      var imgUrl = item.imgUrl;
      var targetId = item.id;
      var count = this.data.questionSelectorHeaderCount;
      var outThis = this;
      var array = this.data.questionSelectorHeaderList;
      var item = array[index];
      if (item == null) {
        return;
      }
      if (item.status == 1 && index < count - 1) {
        index++;
        this.setQuestionSelectorHeader(index, item, callback);
        return;
      }
      array.splice(index, 1, {
        imgUrl: imgUrl,
        status: 1,
        targetId: targetId,
        index: index
      });
      this.setData({
        "questionSelectorHeaderList": array
      });


      if (index < count - 1) {
        index++;
        this.setData({
          "questionSelectorHeaderIndex": index
        });

        if (this.isQuestionSelectorHeaderReady()) {
          if (callback) {
            setTimeout(function () {
              callback.complete();
            }, 100);

          }
        }
      } else {
        var flag = true;
        for (var i = 0; i < array.length; i++) {
          var item = array[i];
          if (item.status == 0) {
            flag = false;
            outThis.setData({
              "questionSelectorHeaderIndex": item.index
            });
            break;
          }

        }
        if (callback && flag) {
          setTimeout(function () {
            callback.complete();
          }, 300);

        }

      }
    },

    selectBattleHeader: function (e) {
      var outThis = this;
      var index = e.currentTarget.id;
      this.setData({
        "questionSelectorHeaderIndex": index
      });
      var list = this.data.questionSelectorHeaderList;
      var questionSelectorContentList = this.data.questionSelectorContentList;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.index == index) {
          if (item.status == 1) {
            for (var i = 0; i < questionSelectorContentList.length; i++) {
              var contentItem = questionSelectorContentList[i];
              if (contentItem.id == item.targetId) {
                var num = contentItem.num;
                num++;
                contentItem.num = num;
                outThis.setData({
                  "questionSelectorContentList": questionSelectorContentList
                });
              }
            }
            list.splice(index, 1, {
              imgUrl: "http://ovqk5bop3.bkt.clouddn.com/question2.png",
              status: 0,
              index: index
            });
            outThis.setData({
              "questionSelectorHeaderList": list
            });
            break;
          }

        }
      }
    },

    selectComplete: function () {
    },

    questinSelectorClose: function () {
      this.setData({
        isClose:1
      });
    },

    getFirstHeaderIndex: function () {
      var list = this.data.questionSelectorHeaderList;
      for (var index = 0; index < list.length; index++) {
        var item = list[index];
        if (item.status == 0) {
          return index;
        }
      }
      return -1;
    },

    stopDrawSelectInterval: function () {
      clearInterval(drawSelectInterval);
      this.setData({
        "display": "none"
      });
    },

    startCountDown:function(timeLong){
      var timeSecond = this.selectComponent("#timeSecond");
      timeSecond.startCoundDown(timeLong,{
        end:function(){
          console.log(".........end");
        }
      });
    },

    drawUpSelect:function(subIds){
      var outThis = this;
      var index = 0;
      var time = 0;
      var subIndex = 0;
      var flag = 0;
      setTimeout(function () {
        flag = 1;
      }, 1500);
      if(!subIds){
        return;
      }
      drawSelectInterval = setInterval(function () {
        var subId;
        if(subIds.length>subIndex){
          subId = subIds[subIndex];
        }else{
         // clearInterval(drawSelectInterval);
          return;
        }
        
        var questionSelectorContentList = outThis.data.questionSelectorContentList;

  
        if (!questionSelectorContentList || questionSelectorContentList.length == 0) {
          return;
        }

        if (questionSelectorContentList.length == 2 && index == 1) {
          index = 0;
        } else if (questionSelectorContentList.length == 2 && index == 0) {
          index = 1;
        } else if (questionSelectorContentList.length == 3 && index == 2) {
          index = 0;
        } else if (index == 2) {
          index = 5;
        } else if (index == 3) {
          index = 0;
        } else if (index == 0 || index == 1) {
          index++;
        } else if (index == 5 || index == 4) {
          index--;
        }else if(index>5){
          index = 0;
        }

        for (var i = 0; i < questionSelectorContentList.length; i++) {
          var item = questionSelectorContentList[i];
          item.background = "none";
        }
        var item = questionSelectorContentList[index];
        if (item) {
          item.background = "red";

        }
        outThis.setData({
          "questionSelectorContentList": questionSelectorContentList
        });

        if (item) {
          var num = Math.ceil(Math.random() * 2);
          if (flag && item.id == subId) {
            time = 0;
            outThis.doSelectBattleSubject(item.id);
            index++;
            subIndex++;
            flag = 0;
            setTimeout(function(){
              flag = 1;
            },1500);
          }
        }
      }, 100);
    },
    
    drawSelect: function () {
      var questionSelectorContentList = this.data.questionSelectorContentList;

      questionSelectorContentList = questionSelectorContentList.slice(0,6);
      var subs = util.getRandomArrayElements(questionSelectorContentList,3);
      var subIds = new Array();

      for(var i=0;i<subs.length;i++){
        subIds.push(subs[i].id);
      }
      this.drawUpSelect(subIds);

    },

    setUnSelect:function(){
      this.setData({
        isSelect: 0
      });
    },

    subjectStatusUpdate(subject){
      var outThis = this;
      var subjects = this.data.questionSelectorContentList;
      for(var i=0;i<subjects.length;i++){
        if(subjects[i].id==subject.id){
          subjects[i].selectUserImg = subject.selectUserImg;
          outThis.setData({
            subjects: subjects
          });
          outThis.doSelectBattleSubject(subject.id);
          if (subject.isSelf){
            outThis.setData({
              isSelect: 1
            });
          }
        }
      }
    },

    doSelectBattleSubject: function (id) {
      var outThis = this;
      var questionSelectorContentList = this.data.questionSelectorContentList;
      if (id != "random") {

        for (var i = 0; i < questionSelectorContentList.length; i++) {
          var item = questionSelectorContentList[i];
          if (item.id == id) {
            var num = item.num;
            if (num > 0) {
              var index = outThis.getFirstHeaderIndex();
              if (index != -1) {
                num--;
                item.num = num;
                outThis.setQuestionSelectorHeader(index, item, {
                  complete: function () {
                    outThis.selectComplete();
                    
                    if (drawSelectInterval) {
                      clearInterval(drawSelectInterval);
                    }
                  }
                });
              }

            }

          }
        }
        outThis.setData({
          "questionSelectorContentList": questionSelectorContentList
        });
      } else {
        var selectItems = new Array();
        for (var i = 1; i < questionSelectorContentList.length; i++) {
          var item = questionSelectorContentList[i];
          var num = item.num;
          if (num > 0) {
            selectItems.push(item);
          }
        }
        selectItems = this.shuffle(selectItems);
        var index = 0;
        var headerCount = this.data.questionSelectorHeaderList.length;
        for (var i = 0; i < headerCount; i++) {
          var item = selectItems[index];
          var headerItem = this.data.questionSelectorHeaderList[i];
          if (item != null && headerItem.status == 0) {
            index++;
            outThis.setQuestionSelectorHeader(i, item, {
              complete: function () {
                outThis.selectComplete();
              }
            });
            var num = item.num;
            num--;
            item.num = num;
          }
        }

        outThis.setData({
          "questionSelectorContentList": questionSelectorContentList
        });

      }
    },

    selectBattleSubjectClick: function (e) {
      var outThis = this;
      var id = e.currentTarget.id;

      var isSelect = this.data.isSelect;
      if(!isSelect){
        var myEventDetail = { subjectId: id } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        outThis.triggerEvent('selectSubject', myEventDetail, myEventOption);
      }else{
        wx.showModal({
          title: '您已经选择了一个主题'
        });
      }
      
      //this.doSelectBattleSubject(id);
    },

    shuffle: function (array) {
      var tmp, current, top = array.length;
      if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
      return array;
    },

    hideSelector: function () {
      this.setData({
        "display": "none"
      });
    },
    showSelector: function () {
      console.log("......showSelector");
      this.setData({
        "display": "block"
      });
    },

    setBattleSubjects:function(subjects,count,type){
      
      var array = new Array();
      this.setHeaderCount(count);
      if (type) {
        this.setData({
          "type": type
        });
      }

      if (type == 0) {
        /*array.push({
          id: "random",
          name: "一键开始",
          imgUrl: "http://ovqk5bop3.bkt.clouddn.com/random.png",
          num: 1
        });*/
      }
      for (var i = 0; i < subjects.length; i++) {
        array.push({
          name: subjects[i].name,
          imgUrl: subjects[i].imgUrl,
          id: subjects[i].id,
          num: 1,
          questions: subjects[i].questions,
          background: "none"
        });
      }

      this.setData({
        "questionSelectorContentList": array
      });

    }
  }
});
