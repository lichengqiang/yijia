const {
    lbajax
} = require('../../modularityjs/lbajax.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        let that = this
        if (e && e.scene) {
            var scene = decodeURIComponent(e.scene).split('&');
            //console.log(scene);
            var secneObj = {};
            for (var i = 0; i < scene.length; i++) {
                var arr = scene[i].split('=');
                var key = arr[0];
                secneObj[key] = arr[1];
            }
            e = secneObj;
        }
        if (e && e.device) {
            that.setData({
                device: e.device
            })
        }
        console.log(that.data.device, 'options')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.init()
    },
    init() {
        let that = this
        wx.showLoading({
            title: '加载中...',
            mask: false
        })
        if (wx.getStorageSync('app_session')) {
            let header = {};
            header = {
                'content-type': 'application/x-www-form-urlencoded',
                'rrsession': wx.getStorageSync('app_session')
            }
            that.pclogin(header)
        } else {
            wx.login({
                success: function (code) {
                    console.log(code)
                    lbajax('login', 'login', 'POST', {
                        code: code.code
                    }, (res) => {
                        if(typeof res.data === 'object') {
                            wx.setStorageSync('app_session', res.data.app_session)
                            wx.setStorageSync('userInfo', res.data)
                            let header = {};
                            header = {
                                'content-type': 'application/x-www-form-urlencoded',
                                'rrsession': res.data.app_session
                            }
                            that.pclogin(header)
                        } else {
                            let header = {};
                            header = {
                                'content-type': 'application/x-www-form-urlencoded',
                                'rrsession':wx.getStorageSync('app_session')
                            }
                            that.pclogin(header)
                        }
                    })
                }
            })
        }
    },
    pclogin(header) {
        let that = this
        wx.request({
            url: `https://www.yijiado.cn/api/user/pclogin`,
            method: 'POST',
            data: {
                'device': that.data.device
            },
            header: header,
            success: function (res) {
                if (res.data.code == 200) {
                    setTimeout(function () {
                        wx.hideLoading()
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }, 500)
                    setTimeout(function () {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        })
                    }, 3000)
                }
            },
            fail: function () {

            },
            complete: function () {

            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})