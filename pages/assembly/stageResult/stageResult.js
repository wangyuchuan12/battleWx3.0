// pages/assembly/stageResult/stageResult.js
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
    isShow:0,
    stageIndex:0,
    isPass:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showView:function(stageIndex,isPass){
      this.setData({
        isShow: 1,
        stageIndex: stageIndex,
        isPass: isPass
      });
    },
    confirmClick:function(e){
      this.setData({
        isShow:0
      });
    }
  }
})
