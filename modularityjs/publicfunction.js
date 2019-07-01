const { lbajax } = require('./lbajax.js')
module.exports = {
  promptBox: (title, fn, time) => {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: time || 600,
      complete: function () {
        if (typeof fn == 'function') {
          setTimeout(() => {
            fn()
          }, time || 600)
        }
      }
    })
  },
  popup: (title, time) => {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: time || 600,
      complete: function () {
      }
    })
  },
  big_img: (e) => {
    const img = e.currentTarget.dataset.img
    let imgs = e.currentTarget.dataset.imgs
    if (imgs.constructor !== Array) {
      imgs = [].push(imgs)
    }
    wx.previewImage({
      current: img,
      urls: imgs
    })
  },
  lookQr(e) {
    let curimg = e.currentTarget.dataset.qrcode
    let imgs = [];
    imgs.push(curimg);
    console.log(e)
    wx.previewImage({
      current: curimg, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  toOtherApp(e) {
    let appid = e.currentTarget.dataset.appid
    wx.navigateToMiniProgram({
      appId: appid,
      envVersion: 'release',
      success(res) {
        // 打开成功
      },
      fail() {
      },
      complete() {
      }
    })
  },
  sendAppNum(fun) {
    const ver = getApp().globalData.ver
    lbajax('index', 'Version', 'GET', { ver: ver }, (res) => {
      if (res.code == 200) {
        fun(res)
      }
    })
  },
  wayToOtherApp(fun) {
    lbajax('index', 'Transfer', 'GET', null, (res) => {
      if (res.code == 200) {
        fun(res)
      }
    })
  },
  showLoading(e) {
    wx.showLoading({ title: '加载中...', mask: false })
  },
  hideLoading(data) {
    let time = data || 700
    setTimeout(() => {
      wx.hideLoading()
    }, time)
  },
  //v1 v2 版本号
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
  
    return 0
  }
}