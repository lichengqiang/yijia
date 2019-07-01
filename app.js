//app.js
const { lbajax } = require('/modularityjs/lbajax.js')
const getPage = (pageName) => {
    let pages = getCurrentPages()
    return pages.find(function (page) {
        return page.__route__ == pageName
    })
}
App({
    onLaunch: function (option) {
        console.log("appinit")
        console.log(option,555)
        const that = this
        this.random_number = this.random_numberss()
        this.shareTicket = option.shareTicket
        this.project_id = option.query.project_id
        //调用登录接口
        if (wx.getStorageSync('app_session')) {
            console.log('本地session' + wx.getStorageSync('app_session'));
            wx.checkSession({
                success: function () {
                    //session 未过期，并且在本生命周期一直有效
                    lbajax('login', 'loginsession', 'POST', {}, (res) => {
                        if (res.status) {
                            console.log('session可以');
                            console.log('用户信息');
                            console.log(res.data);
                            wx.setStorageSync('app_session', res.data.app_session)
                            wx.setStorageSync('userInfo', res.data)
                            that.getUserInfo()
                            if (res.data.look == '0') {
                                that.setlook()
                            }
                            // that.skot()
                            if(that.shareTicket && that.project_id) {
                                that.Access_share(that.shareTicket, that.project_id)
                            }
                        } else {
                            console.log('session失效');
                            that.login(option)
                        }
                    })
                },
                fail: function () {
                    //登录态过期
                    that.login(option)
                }
            })
        } else {
            console.log('没有本地session' + wx.getStorageSync('app_session'));
            that.login(option)
        }
    },
    // 设置首次登陆
    setlook() {
        lbajax('user', 'setlook', 'POST', {}, (res) => {
            console.log(res)
        })
        this.globalData.the_first_landing = true
        if (getPage("pages/index/index")) {
            getPage("pages/index/index").the_first_landing()
        }
        if (getPage("pages/project/project")) {
            getPage("pages/project/project").the_first_landing()
        }
        if (getPage("pages/details/details")) {
            getPage("pages/details/details").the_first_landing()
        }
    },
    //随机数
    random_numberss() {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
        let res = ""
        const n = 8
        for (let i = 0; i < n; i++) {
            let id = Math.ceil(Math.random() * 61)
            res += chars[id]
        }
        return res
    },
    update() {
        try {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate, 'tttttttt')
            })

            updateManager.onUpdateReady(function () {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
            })

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
            })
        } catch (e) { }

    },
    login(option) {
        const that = this
        console.log('开始获取微信授权')
        wx.login({
            success: function (code) {
                console.log('成功获取微信授权')
                lbajax('login', 'login', 'POST', {
                    code: code.code
                }, (res) => {
                    if(typeof res.data === 'object') {
                        wx.setStorageSync('app_session', res.data.app_session)
                        wx.setStorageSync('userInfo', res.data)
                        that.getUserInfo()
                        console.log('用户信息');
                        console.log(res.data);
                        if (res.data.look == '0') {
                            that.setlook()
                        }
                        that.Access_share(that.shareTicket, that.project_id)
                        if (getCurrentPages().length != 0) {
                            let page = getCurrentPages()[getCurrentPages().length - 1];
                            console.log('当前页面')
                            console.log(page)
                            console.log(page.__route__)
                            if (page.__route__ == 'pages/project/project') {
                                console.log('传入option.query.project_id')
                                page.initdata()
                            }
                            if (page.__route__ == 'pages/details/details') {
                                console.log('传入details' + option.query.project_id + "和" + option.query.action_id)
                                page.initdata()
                            }
                            if (page.__route__ == 'pages/index/index') {
                                console.log('传入index')
                                page.initdata()
                            }
                        }
                    }
                    // that.skot()
                })
                that.globalData.code = code.code
            },
            fail: function () {
                console.log('失败获取微信授权')
            }
        })
    },
    onShow(option) {
        this.update()
        console.log('showinit')
        console.log(option)
        const app_session = wx.getStorageSync('app_session')
        if (option.query.type) {
            console.log('aaaaaaaaaa')
            this.globalData.shared = true
        }
        const shareTicket = option.shareTicket
        console.log('开始shareTicket')
        console.log(option)
        this.shareTicket = option.shareTicket
        this.project_id = option.query.project_id
        console.log(this.project_id)
        console.log('原来的原来的', this.random_number)
        console.log('xinxinxinxinx', option.query.random_number)
        if (option.query.random_number) {
            console.log('有有有')
            if (this.random_number !== option.query.random_number) {
                console.log('不一样不一样不一样不一样不一样不一样')
                this.random_number = option.query.random_number
                if (app_session) {
                    this.Access_share(this.shareTicket, this.project_id)
                }
            }
        }
    },
    Access_share(shareTicket, project_id) {
        if (shareTicket) {
            console.log('有群组')
            console.log(shareTicket)
            console.log('记录')
            wx.getShareInfo({
                shareTicket: shareTicket,
                success: function (res) {
                    console.log('获取群')
                    console.log(res)
                    lbajax('group', 'getshare', 'POST', { project_id, encryptedData: res.encryptedData, iv: res.iv }, (res) => {
                        console.log('存储群成功')
                        console.log(res)
                    })
                },
                fail: function (res) {
                    console.log('获取组信息失败，是单人分享')
                    lbajax('group', 'shareone', 'POST', { project_id }, (res) => {
                        console.log('存储担任成功')
                        console.log(res)
                    })
                }
            })
        } else {
            console.log('没有群组')
            lbajax('group', 'shareone', 'POST', { project_id }, (res) => {
                console.log('存储担任成功')
                console.log(res)
            })
        }
    },
    getUserInfo: function (cb) {
        if (wx.getStorageSync('userInfo').wechatauth == '0') {
            wx.getUserInfo({
                success: function (res) {
                    if (res.encryptedData) {
                        lbajax('user', 'setuserinfo', 'POST', { encryptedData: res.encryptedData, iv: res.iv }, (res) => {
                            if (res.code == 200) {
                                wx.setStorageSync('userInfo', res.data)
                                if (getCurrentPages().length != 0) {
                                    let page = getCurrentPages()[getCurrentPages().length - 1];
                                    if (page.__route__ == 'pages/index/index') {
                                        page.update_userInfo()
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    },

    onHide() {
        lbajax('common', 'userformid', 'POST', { formId: this.globalData.formId }, (res) => {
            this.globalData.formId = []
        })
    },
    globalData: {
        code: '',
        userInfo: null,
        formId: [],
        the_first_landing: false,
        shared: false,
        ver: 7,
    }
})