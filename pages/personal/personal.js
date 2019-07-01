const { lbajax } = require('../../modularityjs/lbajax.js')
Page({
  data: {
    userInfo: {},
    initdata: {},
    isNet: 'init',
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo,'userInfouserInfouserInfo')
    if (Object.keys(this.data.userInfo).length == 0 && userInfo) {
      this.setData({ userInfo })
    }
    lbajax('user', 'info', 'POST', {}, (res) => {
      if (res.code == 200) {
        this.setData({ initdata: res.data })
      }
    })
  },
  reload() {
    this.onShow()
    this.onLoad()
}

})