var request = require("../../../utils/request.js");
var domain = request.getDomain();
var battleManagerRequest = require("../../../utils/battleManagerRequest.js");
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
    radioImg: domain+"/imgs/radio.png",
    radioCImg: domain+"/imgs/radio_c.png",
    ranks:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init:function(){
      this.ranks();
    },

    ranks:function(){
      var outThis = this;
      battleManagerRequest.ranksRequest({
        success:function(list){
          var ranks = new Array();
          for(var i=0;i<list.length;i++){
            var obj = list[i];
            ranks.push({
              id:obj.id,
              name:obj.name,
              detail:obj.detail,
              imgUrl:obj.imgUrl,
              isCheck:0
            });
          }
          outThis.setData({
            ranks:ranks
          });
        },
        fail:function(){
          console.log("....fail");
        }
      });
    },

    itemCheck:function(e){
      var outThis = this;
      var id = e.currentTarget.id;
      var ranks = this.data.ranks;
      for (var i = 0; i<ranks.length;i++){
        var rank = ranks[i];
        if(rank.id==id){
          if(!rank.isCheck){
            rank.isCheck = 1;
            var myEventDetail =
              {rankId:rank.id} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            outThis.triggerEvent('rankCheck', myEventDetail, myEventOption);
          }else{
            rank.isCheck = 0;
          }
        }
      }
      this.setData({
        ranks:ranks
      });
    }
  }
})
