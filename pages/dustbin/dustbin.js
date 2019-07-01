const { lbajax } = require('../../modularityjs/lbajax.js')
const { promptBox } = require('../../modularityjs/publicfunction.js')

Page({

  data: {
    initdata: {},
    userInfo:{},
    isNet: 'init',
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo})
    this.initdata()
  },
  initdata() {
    lbajax('project', 'trash', 'POST', {}, (res) => {
      if (res.status == 1) {
        this.setData({ initdata: res.data })
      }
    })
  },
  project_redel(e) {
    const project_id = e.currentTarget.dataset.project_id
    lbajax('project', 'redel', 'POST', { project_id }, (res) => {
      if (res.status == 1) {
        promptBox(res.data, this.initdata)
      }
    })
  },
  reload() {
    this.onShow()
    this.onLoad()
}
})