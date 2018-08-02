var waitRoomRequest = null;
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
    process:100,
    processItems:[{
      process:50,
      name:"50米"
    }, {
      process: 100,
      name: "100米"
    }],

    battleId:"",
    period:"",
    battleName:"",
    options: null
  },

  /**
   * 组件的方法列表
   */
  methods: {

    processChange:function(e){
      var outThis = this;
      var process = e.detail.value;
      this.setData({
        process:process
      });
    },

    battleChange: function (e) {
      var outThis = this;
      var id = e.detail.value;
      var options = this.data.options;
      for(var i=0;i<options.length;i++){
        var option = options[i];
        if(option.id==id){
          outThis.setData({
            battleId:option.battleId,
            period:option.periodId,
            name:option.name
          });
          break;
        }
      }

    },

    buttonClick:function(){
      var battleId = this.data.battleId;
      var periodId = this.data.periodId;
      var process = this.data.process;
      var name = this.data.name;
      var myEventDetail =
        {battleId:battleId,periodId:periodId,process:process,name:name} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('optionSelect', myEventDetail, myEventOption);
    },

    options:function(process,battleId){
      var outThis = this;
      this.setData({
        process:process,
        battleId:battleId
      });
      var outThis = this;
      waitRoomRequest.optionsRequest({
        success:function(options){
          outThis.setData({
            options:options
          });

          for(var i=0;i<options.length;i++){
            if(options[i].battleId==battleId){
              outThis.setData({
                periodId:options[i].periodId,
                battleId: options[i].battleId,
                name: options[i].name
              });
            }
          }
        },
        fail:function(){
          console.log("fail");
        }
      })
    }

  }
})
