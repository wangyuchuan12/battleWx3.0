// pages/assembly/alertPlug2/alertPlug.js
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
    isShow: 0,
    content: "送您100豆"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    alertPlugConfirmClick: function () {
      this.setData({
        "alertPlugData.isShow": 0
      });
    },
    showAlertPlug: function (content) {
      this.setData({
        "alertPlugData.isShow": 1,
        "alertPlugData.content": content
      });
    }
  }
})
