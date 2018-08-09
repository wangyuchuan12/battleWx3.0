var imgResource = require("../../../utils/imgResource.js");
var util = require("../../../utils/util.js");
var shareUtil = require("../../../utils/shareUtil.js");
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
    buttonImg: imgResource.buttonImg,
    buttons:[],
    holdButton:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(buttons){
      var outThis = this;
      for(var i=0;i<buttons.length;i++){
        var button = buttons[i];
        button.id = util.uuid();
      }
      this.setData({
        buttons:buttons
      });

      for(var i=0;i<buttons.length;i++){
        var button = buttons[i];
        if(button.isShare){
          shareUtil.registerCallback(button.id,{
            call: function (code, shareTickets){
              var holdButton = outThis.data.holdButton;
              for(var j=0;j<buttons.length;j++){
                if(buttons[j].id==code){
                  buttons[j].share(shareTickets);
                }
              }
            }
          })
        }
      }

      shareUtil.registerCallback("1234234234",function(){
        outThis.setData({
          holdButton:""
        });
      });
    },
    buttonClick:function(e){
      console.log("e:"+JSON.stringify(e));
      var id = e.target.id;
      this.setData({
        holdButton:id
      });
      console.log("id:"+id);
      var buttons = this.data.buttons;
      for(var i=0;i<buttons.length;i++){
        var button = buttons[i];
        if(button.id==id){
          button.call();
        }
      }
    }
  }
})
