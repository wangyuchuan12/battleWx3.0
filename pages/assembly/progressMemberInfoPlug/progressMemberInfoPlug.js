var currentLoveCoolingRequest = require("../../../utils/currentLoveCoolingRequest.js");
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
    memberInfo:null,
    loveCooling: {
      schedule: 200,
      upperLimit: 1000,
      coolLoveSeq: 0,
      status: 0,
      hour: 0,
      min: 0,
      second: 0,
      speedCoolBean: 0,
      speedCoolSecond: 0
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setMemberInfo:function(memberInfo){
      this.setData({
        memberInfo:memberInfo
      });
    },

    initLoveCooling: function () {
      var outThis = this;
      var memberInfo = this.data.memberInfo;
      var battleId = memberInfo.battleId;
      var roomId = memberInfo.roomId;
      currentLoveCoolingRequest.currentLoveCooling(battleId, roomId, {
        success: function (data) {
          outThis.showLoveCooling(data);
          memberInfo.loveResidule = data.loveResidule;
          outThis.setData({
            memberInfo:memberInfo
          });
        },
        fail: function () {
          console.log("initLoveCooling fail");
        }
      });
    },

    showLoveCooling: function (loveCooling) {

      if (this.interval) {
        clearInterval(this.interval);
      }
      var outThis = this;
      //每次执行的最小单位
      var unit = loveCooling.unit;

      //上限是多少
      var upperLimit = loveCooling.upperLimit;

      //执行周期 1000表示1秒钟执行一次
      var millisec = loveCooling.millisec;

      //已经积累的数量
      var schedule = loveCooling.schedule;

      var coolLoveSeq = loveCooling.coolLoveSeq;

      var status = loveCooling.status;

      var memberInfo = this.data.memberInfo;

      this.setData({
        "loveCooling.upperLimit": upperLimit,
        "loveCooling.status": status,
        "loveCooling.speedCoolBean": memberInfo.speedCoolBean,
        "loveCooling.speedCoolSecond": memberInfo.speedCoolSecond,
      });
      this.interval = setInterval(function () {
        var loveCount = memberInfo.loveCount;
        var loveResidule = memberInfo.loveResidule;
        if (loveCount > loveResidule) {
          schedule = schedule + unit;
          if (schedule >= upperLimit) {
            schedule = 0;
            loveResidule++;
            memberInfo.loveResidule = loveResidule;
            outThis.setData({
              memberInfo: memberInfo
            });
            coolLoveSeq++;
          }
          var second = (upperLimit - schedule) / millisec * 1000;
          var hour = parseInt(second / 3600);
          var min = parseInt((second - hour * 3600) / 60);
          second = parseInt(second - hour * 3600 - min * 60);
          outThis.setData({
            "loveCooling.schedule": schedule,
            "loveCooling.coolLoveSeq": loveResidule + 1,
            "loveCooling.status": 1,
            "loveCooling.hour": hour,
            "loveCooling.min": min,
            "loveCooling.second": second
          });

        } else {
          outThis.setData({
            "loveCooling.status": 2
          });
        }
      }, millisec);


    }
    
  }
})
