const url = require('../config.js').url
const lbrequest = (l, b, method, data, fun) => {
  let rrsession = '';
  let header = {};
  let pages = getCurrentPages();
  let currPage = pages[pages.length - 1]; // 当前页
  if (rrsession = wx.getStorageSync('app_session')) {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'rrsession': rrsession
    }
  } else {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
    }
  }
  currPage.setData({
    isNet: 'init',
  })
  wx.request({
    url: `${url}${l}/${b}`,
    method: method,
    data: data,
    
    header: header,
    success: function (res) {
      fun(res.data, data)
      currPage.setData({
        isNet: 'in_line',
      })
    },
    fail: function () {
      wx.showToast({
        title: '网络错误',
        mask: true,
        icon: 'loading',
        image: '/images/err.png',
      })
      currPage.setData({
        isNet: 'out_line',
        popup_loading:'end_loading'
      })
    },
    complete: function () { 
    }
  })
}
const lbajax = (r, m, method, data, fun) => {
  lbrequest(r, m, method, data, fun)
}
module.exports = {
  lbajax: lbajax
}


