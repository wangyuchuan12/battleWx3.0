/*
 * Author: simsir-lin
 * Github: https://github.com/simsir-lin
 * Email: 15986907592@163.com
 */
 
Component({
  behaviors: [],
  properties: {
    rate: {
      type: String,
      value: '0',
      observer: function (newData, oldData) {
        this.getStarArr();
      }
    },
    icon: {
      type: String,
      value: 'star'
    },
    disabled: {
      type: String,
      value: false
    },
    count:{
      type:String,
      value:'5'
    }
  },
  data: {
    starArr: []
  },

  attached: function () {
    this.getStarArr()
  },
  moved: function () {
  },
  detached: function () {
  },

  methods: {
    getStarArr: function () {
      let starArr = [];
      for (var i = 0; i < this.data.rate; i++) {
        starArr.push(this.data.icon);
      }
      for (let j = 0; j < this.data.count - this.data.rate; j++) {
        starArr.push(this.data.icon + '-o');
      }
      this.setData({
        starArr: starArr
      })
    },
    handleTap: function (e) {
      if (this.data.disabled) {
        return;
      }
      this.setData({
        rate: Number(e.currentTarget.dataset.index) + 1
      })
      this.triggerEvent('change', { value: Number(e.currentTarget.dataset.index) + 1 });
      this.getStarArr()
    }
  }
})
