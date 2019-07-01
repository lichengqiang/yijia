const Lock = require('../modularityjs/gesture_lock.js');
const { lbajax } = require('./lbajax.js')
const {  showLoading, hideLoading,promptBox } = require('./publicfunction.js')
const getPage = (pageName) => {
    let pages = getCurrentPages()
    return pages.find(function (page) {
        return page.__route__ == pageName
    })
}

module.exports = class {
    constructor(that, initfn) {
        that.formId = []
        let windowWidth = 0
        let hieght = 0
        const s = that;
        wx.getSystemInfo({
            success: function (res) {
                windowWidth = res.windowWidth
                hieght = 400 * windowWidth / 750
                if (res.system.indexOf('Android') == -1) {
                    s.setData({ Android: false })
                } else {
                    s.setData({ Android: true })
                }
            }
        })

        that.lock = new Lock("id-gesture-lock", wx.createCanvasContext("id-gesture-lock"), function (checkPoints, isCancel) {
            if (checkPoints.length == 3) {
                if (checkPoints[0].index == 0 && checkPoints[1].index == 1 && checkPoints[2].index == 2) {
                    s.finishUp()
                } else {
                    wx.showToast({
                        title: '手势错误',
                        icon: 'success',
                        duration: 1000
                    })
                }
            } else {
                wx.showToast({
                    title: '手势错误',
                    icon: 'success',
                    duration: 1000
                })
            }
            s.lock.gestureError();
        }, { width: windowWidth, height: hieght })
        wx.createSelectorQuery().select('#top_title').boundingClientRect(function (rect) {
            s.topheight = rect.height  // 节点的高度
        }).exec()
        // 打开新建
        that.floating_new = function () {

            that.setData({ lbtab1: false, at_headimg: [], member: that.member_init, uploadTypeBox: false, action_update_files:[],action_create_imgs:[],action_create_files:[] })
        }
        // 关闭新建
        that.close_xinjian = function () {
            that.setData({ lbtab1: true, at_name: '', member: that.member_init,action_update_files:[],action_create_imgs:[],action_create_files:[],isShowLoading: false })
            if(that.initSendData) {
                that.initSendData()
            }

        }

        that.close_xinjian1 = function () {
            that.setData({ lbtab11: true, at_name: '', member: that.member_init, isShowLoading: false})
            if(that.getone) {
                that.getone()
            }

        }
        that.small = function () {
            that.setData({ focuslb: false, focuslbss: false })
        }
        that.smalla = function () {
            that.setData({ focuslba: false, focuslbssa: false })
        }
        that.select = function () {
            that.setData({ focuslb: true })
            setTimeout(() => {
                that.setData({ focuslbss: true })
            }, 100)
        }
        that.selecta = function () {
            that.setData({ focuslba: true })
            setTimeout(() => {
                that.setData({ focuslbssa: true })
            }, 100)
        }
        that.aite = function (e) {
            const content = e.target.dataset.content
            const content_value = e.detail.value
            if (content_value.charAt(content_value.length - 1) == '@') {
                that.setData({ aitehide: false })
            } else {
                that.setData({ aitehide: true })
            }
            that[content].content = content_value
        }
        // 唤醒@
        that.rouse_at = function (e) {
            that.setData({ aitehide: false })
        }
        // @成员收起
        that.hideaite = function () {
            that.setData({ aitehide: true })
        }
        // 点击@所有人
        that.aiteall = function (e) {
            const attr_name = e.currentTarget.dataset.attr_name
            const textname = `${attr_name}_content`
            // let content = that[attr_name].content
            let at_name = that.data.at_name
            let at_all = that.data[attr_name + '_at_all']
            if (that[attr_name].at_all) {
                at_name = at_name.replace('@所有人', '')
            } else {
                at_name += '@所有人'
                // that.setData({ aitehide: true })
            }
            console.log(attr_name)
            that.setData({ at_name, [attr_name + '_at_all']: !that[attr_name].at_all })
            // that[attr_name].content = content
            that[attr_name].at_all = !that[attr_name].at_all
        }
        // @效果
        that.aiteta = function (e) {
            that.formId.push(e.detail.formId)
            that.acquire(e)
            let at_name = that.data.at_name
            let member = that.data.member
            const id = e.currentTarget.dataset.id
            const attrNmae = e.currentTarget.dataset.content
            const textname = `${attrNmae}_content`
            let action_create = that[attrNmae].at_users
            let content = that[attrNmae].content
            let at_headimg = that.data.at_headimg
            if (member[id].isaite) {
                member[id].isaite = false
                const index = action_create.findIndex(function (value, index, arr) {
                    return value == id;
                })
                action_create.splice(index, 1)
                at_name = at_name.replace(`@${member[id].nickname}`, '')
                const headimg = member[id].headimgurl
                const indexs = at_headimg.findIndex(function (value, index, arr) {
                    return value == headimg;
                })
                at_headimg.splice(indexs, 1)
            } else {
                member[id].isaite = true
                action_create.push(id)
                at_name += `@${member[id].nickname}`
                at_headimg.push(member[id].headimgurl)
            }
            that.setData({ member, [textname]: content, at_name, at_headimg })
            that[attrNmae].content = content
        }
        // 弹框出现
        that.tankuanghide = function (e) {
            const current_problem = e.currentTarget.dataset.current_problem
            that.current_problem = current_problem
            if (e.currentTarget.dataset.action_id) {
                that.action_status_id = e.currentTarget.dataset.action_id
            }
            if (e.currentTarget.dataset.user_id == that.data.userInfo.id) {
                that.setData({ del_button_hide: true })
            } else {
                that.setData({ del_button_hide: false })
            }
            if (current_problem) {
                that.setData({ current_problem })
            }
            that.setData({ tankuanghide: false })
        }
        // 弹框消失
        that.closebtn = function () {
            that.setData({ tankuanghide: true, delethide: true })
            setTimeout(() => {
                that.setData({ delettankuang: true })
            }, 200)
        }
        that.delettankuang = function () {
            that.setData({ delettankuang: false, delethide: false })
        }
        // 回退
        that.rollback = function () {
            that.setData({ rollback: false })
        }
        that.deletfou = function () {
            that.setData({ delettankuang: true, delethide: true })
        }
        // 回退no
        that.rollback_no = function () {
            that.setData({ delettankuang: true, rollback: true })
        }
        that.logtitle = function (e) {
            if (that.getone) {
                that.getone()
            }
            const useid = e.currentTarget.dataset.useid
            that.setData({ lbtab11: false , uploadTypeBox: false})
            // if (useid == that.data.userInfo.id) {
            //   that.setData({ lbtab11: false })
            // }
        }
        // 画布
        that.onTouchStart = function (e) {
            that.lock.onTouchStart(e);
        }

        that.onTouchMove = function (e) {
            that.lock.onTouchMove(e);
        }
        that.onTouchEnd = function (e) {
            that.lock.onTouchEnd(e);
        }
        // 刷新
        that.refresh = function () {
            if (getPage("pages/index/index")) {
                getPage("pages/index/index").initdata()
            }
        }
        // 彻底完成
        that.finishUp = function (e) {
            lbajax('action', 'status', 'POST', { id: that.action_status_id, status: 2 }, (res) => {
                if (res.code == 200) {
                    this.refresh()
                    that.setData({ finishUp: false })
                    if (typeof initfn == 'function') {
                        initfn()
                    }
                    setTimeout(() => {
                        that.initdata()
                        that.setData({ finishUped: false, tankuanghide: true, finishUp: true })
                    }, 200)
                }
            })
        }
        // 部分完成
        that.partlyCompleted = function () {
            lbajax('action', 'status', 'POST', { id: that.action_status_id, status: 1 }, (res) => {
                if (res.code == 200) {
                    this.refresh()
                    that.setData({ partlyCompleted: false })
                    if (typeof initfn == 'function') {
                        initfn()
                    }
                    setTimeout(() => {
                        that.initdata()
                        that.closebtn()
                        that.setData({ partlyCompleted: true })
                    }, 200)
                }
            })
        }
        // 删除记忆
        that.deletshi = function () {
            lbajax('action', 'del', 'POST', { action_id: that.action_status_id }, (res) => {
                if (res.code == 200) {
                    this.refresh()
                    that.setData({ delethide: true, delettext: '已删除' })
                    if (typeof initfn == 'function') {
                        initfn()
                    }
                    setTimeout(() => {
                        that.initdata()
                        that.closebtn()
                    }, 200)
                }
            })
        }
        // 回退 is
        that.rollback_is = function () {
            console.log(that.current_problem)
            // const status = that.current_problem.status - 1
            const status = 0
            lbajax('action', 'status', 'POST', { id: that.action_status_id, status }, (res) => {
                if (res.code == 200) {
                    this.refresh()
                    that.setData({ partlyCompleted: false })
                    if (typeof initfn == 'function') {
                        initfn()
                    }
                    setTimeout(() => {
                        that.initdata()
                        that.closebtn()
                        that.setData({ partlyCompleted: true, rollback: true })
                    }, 200)
                }
            })
        }
        that.scrolling = function (e) {
            if (e.detail.scrollTop > 0) {
                that.setData({ toption: false })
            } else {
                that.setData({ toption: true })
            }
        }

        // 新建问题描述
        that.publish = function (e) {
            console.log(e, 'dddddddddddd')
            that.acquire(e)
            const l = e.currentTarget.dataset.l
            const b = e.currentTarget.dataset.b
            const createName = e.currentTarget.dataset.createname
            const close = e.currentTarget.dataset.close_xinjian
            const update_index = e.currentTarget.dataset.update_index
            const project_id = that[createName].project_id
            showLoading()
            if (that[createName].content) {
                lbajax(l, b, 'POST', that[createName], (res) => {
                    if (res.code == 200) {
                        that.hideaite()
                        that.initdata(project_id)
                        if(that.getone) {
                            that.getone()
                        }
                        promptBox(res.data, that[close])
                        that.setData({ member: that.member_init ,isShowLoading: false})
                    }
                    hideLoading()
                })
            } else {
                promptBox('内容不能为空')
            }
        }
        // 获取输入内容
        that.enterContent = function (e) {
            const attrname = e.currentTarget.dataset.attrname
            that[attrname].content = e.detail.value
        }
        // 开启分享
        that.switch1Change = function (e) {
            const attrname = e.currentTarget.dataset.attrname
            that[attrname].other_share = e.detail.value
            that.setData({ share_text: e.detail.value })
        }
        const userInfo = wx.getStorageSync('userInfo')
        if (Object.keys(that.data.userInfo).length == 0 && userInfo) {
            that.setData({ userInfo })
        }
        that.close_handbook = function (e) {
            that.acquire(e)
            const current = e.currentTarget.dataset.index
            that.setData({ the_first_landing: !that.data.the_first_landing })
            if (that.data.the_first_landing) {
                that.setData({ current: current })
            } else {
                that.setData({ current: -1 })
            }
        }
        // 分享
        that.shareTicket = function (arry, fn) {
            let encryptedData = []
            let iv = []
            arry.forEach((value, index, arrays) => {
                wx.getShareInfo({
                    shareTicket: value,
                    success: function (res) {
                        encryptedData.push(res.encryptedData)
                        iv.push(res.iv)
                        if (iv.length == arry.length) {
                            fn(encryptedData, iv)
                        }
                    },
                    fail: function (res) {

                    }
                })
            })
        }
        that.swiperchange = function (e) {
            that.setData({ current: e.detail.current })
        }
        that.first_close = function (e) {
            that.acquire(e)
            getApp().globalData.the_first_landing = false
            that.setData({ first_img: false })
        }
        that.the_first_landing = function () {
            const first_img = getApp().globalData.the_first_landing
            that.setData({ first_img })
        }
        that.acquire = function (e) {
            if (e.detail.formId) {
                getApp().globalData.formId.push(e.detail.formId)
                console.log(getApp().globalData.formId)
            }
        }
        //随机数
        that.random_number = function () {
            const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
            let res = ""
            const n = 8
            for (let i = 0; i < n; i++) {
                let id = Math.ceil(Math.random() * 61)
                res += chars[id]
            }
            return res
        },
        that.hideUploadTypeBox = function() {
            that.setData({ uploadTypeBox: false })
        },
        that.start_record = function() {
            console.log(555)
            that.recorderManager = wx.getRecorderManager()
            const options = {
                duration: 600000,
                format: 'aac',
            }
            that.recorderManager.start(options)
        },
        that.stop_record = function() {
            that.recorderManager.stop()
            that.recorderManager.onStop((res) => {
                console.log('recorder stop', res)
                that.record_url = res.tempFilePath
            })
        },
        that.play_record = function() {
            if(that.data.isBeginPlay) {
                return
            }
            const innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.src = that.record_url,
            innerAudioContext.play()
            that.setData({
                isBeginPlay: true
            })
            console.log('开始播放')
            innerAudioContext.onError((res) => {
              console.log(res.errMsg)
              console.log(res.errCode)
            })
            innerAudioContext.onEnded((res) => {
                console.log('播放结束')
                that.setData({
                    isBeginPlay: false
                })
            })
        }
    }
}
