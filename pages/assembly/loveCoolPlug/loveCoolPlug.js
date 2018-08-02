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
    loveSize:50,
    loveCooling:{
      loveCount: 0,
      loveLimit: 0,
      coolLoveSeq:0,
      hour:0,
      min:0,
      second:0,
      unit:0,
      upperLimit:0,
      millisec:0,
      schedule:0,
      //1正在冷却中 2冷却成功
      status:1
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init: function (loveCooling,loveSize){
      this.setData({
        "loveCooling.loveCount": loveCooling.loveCount,
        "loveCooling.loveLimit": loveCooling.loveLimit,
        "loveCooling.coolLoveSeq": loveCooling.coolLoveSeq,
        "loveCooling.hour":0,
        "loveCooling.min":0,
        "loveCooling.second":0,
        "loveCooling.unit": loveCooling.unit,
        "loveCooling.upperLimit": loveCooling.upperLimit,
        "loveCooling.millisec": loveCooling.millisec,
        "loveCooling.schedule": loveCooling.schedule,
        "loveCooling.status": loveCooling.status
      });

      if (loveSize){
        this.setData({
          loveSize:loveSize
        });
      }

      this.showLoveCooling();
    },

    showLoveCooling: function () {

      if (interval) {
        clearInterval(interval);
      }
      var loveCooling = this.data.loveCooling;
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
    
      this.setData({
        "loveCooling.upperLimit": upperLimit,
        "loveCooling.status": status
      });

      interval = setInterval(function () {
        loveCooling = outThis.data.loveCooling;
        
        var loveCount = loveCooling.loveCount;

        if (loveCount) {
          var myEventDetail =
            {} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          outThis.triggerEvent('resurrection', myEventDetail, myEventOption);
        }
        var loveLimit = loveCooling.loveLimit;
        if (loveLimit > loveCount) {
          schedule = schedule + unit;
          if (schedule >= upperLimit) {
            schedule = 0;
            loveCount++;
            outThis.setData({
              "loveCooling.loveCount": loveCount
            });
            coolLoveSeq++;
          }
          
          var second = (upperLimit - schedule) / millisec * 1000;
          var hour = parseInt(second / 3600);
          var min = parseInt((second - hour * 3600) / 60);
          second = parseInt(second - hour * 3600 - min * 60);
          outThis.setData({
            "loveCooling.schedule": schedule,
            "loveCooling.coolLoveSeq": loveCount + 1,
            "loveCooling.status": 1,
            "loveCooling.hour": hour,
            "loveCooling.min": min,
            "loveCooling.second": second
          });

        } else {
          outThis.setData({
            "loveCooling.status": 2
          });
          //clearInterval(interval);
        }
      }, millisec);
    }
  }
})
