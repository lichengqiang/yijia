
const { lbajax } = require('../../modularityjs/lbajax.js')
const Comm = require('../../modularityjs/comm.js')
const { promptBox, popup, big_img, lookQr, toOtherApp, sendAppNum, wayToOtherApp, showLoading, hideLoading ,compareVersion} = require('../../modularityjs/publicfunction.js')
const { lbuploadimgs } = require('../../modularityjs/lbuploadimg.js')
const getPage = (pageName) => {
    let pages = getCurrentPages()
    return pages.find(function (page) {
        return page.__route__ == pageName
    })
}
const { url } = require('../../config')

Page({
    data: {
        action_id: 0,
        lbtab1: true,
        aitehide: true,
        aitechengyuan: true,
        focuslb: true,
        focuslbss: true,
        tankuanghide: true,
        tab1: true,
        delettankuang: true,
        delettext: '删除记忆',
        delethide: true,
        lbtab11: true,
        caozuorenyuan: true,
        focuslba: true,
        focuslbssa: true,
        finishUp: true,
        toption: 71,
        scales: 1,
        finishUped: true,
        Android: true,
        partlyCompleted: true,
        close_xinjian: 'close_xinjian',
        member: {},
        actionextre_create_content: '',
        actionextre_update_content: '',
        actionextre_create_imgs: [],
        actionextre_update_imgs: [],
        uptab: true,
        initdata: {},
        actionvalue: '',
        userInfo: {},
        checked: false,
        action_update_content: '',
        current_problem: {},
        rollback: true,
        at_name: '',
        at_headimg: [],
        actionextre_create_at_all: false,
        action_update_at_all: false,
        actionextre_update_at_all: false,
        actionextre_create_dele_btn: [],
        actionextre_update_dele_btn: [],
        the_first_landing: false,
        shared: false,
        revivification: false,
        current: -1,
        first_img: false,
        is_to_other_app: false,
        version: 1, //版本号
        mode: 0,
        pic: '',
        uploadTypeBox: false,
        action_update_files: [],
        actionextre_create_files: [],
        actionextre_update_files: [],
        isShowLoading: false,
        isNet: 'init',
        popup_loading: 'init',
        start_record: 'start_record',
        stop_record: 'stop_record',
        play_record: 'play_record',
    },

    onLoad: function (options) {
        this.setData({ shared: getApp().globalData.shared })
        wx.setStorageSync('details_options',options)
        const that = this
        this.formId = []
        const project_page = getPage("pages/project/project")
        const project_id = options.project_id
        const action_id = options.action_id
        this.action_status_id = action_id
        this.setData({ 'userInfo': wx.getStorageSync('userInfo') })
        this.setData({ 'action_id': action_id })
        this.actionextre_create = {
            project_id: project_id,
            action_id: action_id,
            at_all: 0,
            imgs: [],
            at_users: [],
            content: '',
            file_contents: '[]'
        }
        this.actionextre_update = {
            at_all: 0,
            imgs: [],
            at_users: [],
            content: '',
            id: 0,
            file_contents: []
        }
        this.action_update = {
            content: '',
            id: action_id,
            at_users: [],
            at_all: 0,
            file_contents: []
        }
        lbajax('user', 'Atuser', 'POST', { project_id }, (res) => {
            if (res.code == 200) {
                for (let index in res.data) {
                    res.data[index].isaite = false
                }
                this.member_init = res.data
                this.setData({ member: res.data })
            }
        })
        this.initdata()
        this.getone()
        if (project_page) {
            this.comm = new Comm(this, project_page.initdata)
        } else {
            this.comm = new Comm(this, () => { })
        }
        if (getApp().globalData.the_first_landing) {
            this.the_first_landing()
        }
    },
    onShow() {
        let that = this
        sendAppNum(function (res) {
            console.log(res, 9999999)
            that.setData({
                version: res.data.version
            })
            if (res.data.version == 3) {
                wayToOtherApp(function (res) {
                    that.setData({
                        mode: res.data.mode,
                        pic: res.data.pic,
                        is_to_other_app: true
                    })
                })
            }
        })
    },
    setshared(share) {
        console.log('有返回按钮');
        this.setData({ shared: share.share })
    },
    initSendData() {
        this.actionextre_create.at_all = 0,
            this.actionextre_create.imgs = [],
            this.actionextre_create.at_users = [],
            this.actionextre_create.content = ''
        this.actionextre_update = {
            at_all: 0,
            imgs: [],
            at_users: [],
            content: '',
            id: 0,
            file_contents: []
        }
        this.action_update.content = '',
            this.action_update.at_users = [],
            this.action_update.at_all = 0,
            this.action_update.file_contents = []
    },
    initdata() {
        let that = this
        this.actionextre_create.content = ''
        this.actionextre_create.at_users = []
        this.actionextre_create.imgs = []
        this.actionextre_create.at_all = 0
        this.setData({ actionextre_create_imgs: [], action_update_files: [], actionextre_create_files: [], actionextre_update_files: [], })
        const action_id = this.actionextre_create.action_id
            showLoading()
            this.setData({popup_loading: 'begin_loading'})
        lbajax('Actionextre', 'Actionextres', 'POST', { 'action_id': this.actionextre_create.action_id, 'project_id': this.actionextre_create.project_id }, (res) => {
            hideLoading()
            this.setData({popup_loading: 'end_loading'})
            if (res.code == 200) {
                for (let index in res.data.extres) {
                    res.data.extres[index].copey_hidden = true
                }
                let current_problem = { status: res.data.action_status }
                this.setData({ current_problem })
                if (res.data.other_share > 0 || res.data.project_user_id == that.data.userInfo.id) {
                    console.log('显示按钮')
                    wx.showShareMenu({
                        withShareTicket: true
                    })
                    that.setData({ 'checked': true })
                } else {
                    console.log('隐藏按钮')
                    wx.hideShareMenu()
                    that.setData({ 'checked': false })
                }
                that.setData({ initdata: res.data })
                if (res.data.isdel) {
                    this.setData({ revivification: true })
                } else {
                    this.setData({ revivification: false })
                }
            }
        })
    },
    getone() {
        const action_id = this.actionextre_create.action_id
        lbajax('action', 'getone', 'POST', { id: action_id }, (res) => {
            if (res.status == 1) {
                this.current_problem = res.data
                let at_all = false
                let at_name = this.data.at_name
                let at_headimg = []
                if (res.data.atusers.indexOf('0') == -1) {
                    at_all = false
                } else {
                    res.data.atusers = []
                    at_all = true
                }
                this.action_update = {
                    content: res.data.content,
                    id: action_id,
                    at_users: res.data.atusers,
                    at_all: at_all,
                    imgs: res.data.imgs,
                    file_contents: JSON.stringify(res.data.file_contents)
                }
                console.log(this.action_update)
                const member = this.data.member
                for (let index in member) {
                    member[index].isaite = false
                }
                for (let index in member) {
                    res.data.atusers.forEach((item, indexs, arry) => {
                        if (item == member[index].id) {
                            member[index].isaite = true
                        }
                    })
                }
                if (at_all) {
                    at_name += `@所有人`
                } else {

                    res.data.atusers.forEach((item, indexs, arry) => {
                        at_headimg.push(member[item].headimgurl)
                    })
                }
                let dele_btn = []
                res.data.imgs.forEach(item => {
                    dele_btn.push(true)
                });
                res.data.file_contents.forEach(item => {
                    item.show_delete_box = false
                });
                this.setData({ action_update_imgs: res.data.imgs, action_update_files: res.data.file_contents, action_update_dele_btn: dele_btn, action_update_content: res.data.content, member, at_name, action_update_at_all: at_all, at_headimg })
                // this.actionextre_create.imgs = res.data.imgs
                // this.setData({  currentProblem : res.data, action_update_content: res.data.content, member, at_name, action_update_at_all: at_all, at_headimg })
                // console.log(this.data.currentProblem,'currentProblemcurrentProblemcurrentProblemcurrentProblem')
            }
        })
    },
    caozuorenyuan: function () {
        console.log(555556666)
        this.setData({ caozuorenyuan: false })
    },
    close_caozuo: function () {
        this.setData({ caozuorenyuan: true })

    },
    upLoadImg(e) {
        let that = this
        const attr_name = e.currentTarget.dataset.content
        const imgs = attr_name + '_imgs'
        console.log(imgs)
        console.log(that[attr_name], 'mmmmmmm')
        let actionextre_create_imgs = that.data[imgs]
        let dele_btn = that.data[attr_name + '_dele_btn']

        let file_contents = JSON.parse(that[attr_name].file_contents)
        let count = 9 - file_contents.length - that[attr_name].imgs.length
        if (count <= 0) {
            popup('图片和附件最多只能上传9个')
            return
        }
        console.log(count)
        that.setData({isShowLoading: true})
        lbuploadimgs((bimgs, simgs) => {
            console.log(bimgs, 'bimgs, simgs', simgs)
            that[attr_name].imgs = that[attr_name].imgs.concat(simgs)
            actionextre_create_imgs = actionextre_create_imgs.concat(bimgs)
            for (let i = 0; i < bimgs.length; i++) {
                dele_btn.push(true)
            }
            that.setData({ [imgs]: actionextre_create_imgs, [attr_name + '_dele_btn']: dele_btn, uploadTypeBox: false })
        }, count, function () {
            that.setData({ uploadTypeBox: false,isShowLoading: false  })
        })
    },
    onShareAppMessage(re) {
        const that = this
        const random_number = this.random_number()
        return {
            title: '',
            path: 'pages/details/details?project_id=' + this.actionextre_create.project_id + '&action_id=' + this.actionextre_create.action_id + '&type=qun' + '&random_number=' + random_number,
            success: function (r) {
                console.log(r)
                that.shareTicket(r.shareTickets, (encryptedData, iv) => {
                    lbajax('group', 'getshare', 'POST', { project_id: that.action_create.project_id, encryptedData, iv }, (res) => {
                        console.log('存储群成功')
                        console.log(res)
                    })
                })
            },
            fail: function (res) { }
        }
    },
    to_change_the(e) {
        console.log('ddddddddddd555555')
        const user_id = e.currentTarget.dataset.user_id
        console.log(user_id, this.data.userInfo.id)
        if (user_id == this.data.userInfo.id) {
            this.actionextre_id = e.currentTarget.dataset.id
            this.actionextre_update.id = e.currentTarget.dataset.id
            this.setData({ uptab: false })
            const member = this.data.member
            let at_name = this.data.at_name
            let at_headimg = []
            let dele_btn = this.data.actionextre_update_dele_btn
            lbajax('actionextre', 'getone', 'POST', { id: this.actionextre_id }, (res) => {
                if (res.code == 200) {
                    let at_all = false
                    if (res.data.atusers.indexOf('0') == -1) {
                        at_all = false
                    } else {
                        res.data.atusers = []
                        at_all = true
                    }
                    this.actionextre_update = {
                        at_all: at_all,
                        imgs: res.data.imgs,
                        at_users: res.data.atusers,
                        content: res.data.content,
                        id: res.data.id,
                        file_contents: JSON.stringify(res.data.file_contents)
                    }
                    for (let index in member) {
                        member[index].isaite = false
                    }
                    res.data.atusers.forEach((item, indexs, arry) => {
                        for (let index in member) {
                            if (item == member[index].id) {
                                member[index].isaite = true
                            }
                        }
                    })

                    console.log(member)
                    console.log(at_all)
                    if (at_all) {
                        at_name += `@所有人`
                    } else {
                        res.data.atusers.forEach((item, indexs, arry) => {
                            at_name += `@${member[item].nickname}`
                            at_headimg.push(member[item].headimgurl)
                        })
                    }
                    for (let i = 0; i < res.data.imgs.length; i++) {
                        dele_btn.push(true)
                    }
                    res.data.file_contents.forEach(item => {
                        item.show_delete_box = false
                    });
                    this.setData({ actionextre_update_content: res.data.content, actionextre_update_files: res.data.file_contents, actionextre_update_imgs: res.data.imgs, member, at_name, actionextre_update_at_all: at_all, actionextre_update_dele_btn: dele_btn, at_headimg, uploadTypeBox: false })

                }
            })
        } else {
            const attr = e.currentTarget.dataset.attr
            const key = e.currentTarget.dataset.key
            let initdata = this.data.initdata
            for (let index in initdata.extres) {
                initdata.extres[index].copey_hidden = true
            }

            initdata[attr][key].copey_hidden = false
            this.setData({ initdata })
            setTimeout(() => {
                initdata[attr][key].copey_hidden = true
                this.setData({ initdata })
            }, 5000)
        }
    },
    confirm_copy(e) {
        const that = this
        const attr = e.currentTarget.dataset.attr
        const key = e.currentTarget.dataset.key
        const content = e.currentTarget.dataset.content
        let initdata = this.data.initdata
        initdata[attr][key].copey_hidden = true
        wx.setClipboardData({
            data: content,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        that.setData({ initdata })
                    }
                })
            }
        })
    },
    close_uptab() {
        this.setData({ uptab: true, at_name: '', member: this.member_init,isShowLoading: false })
    },
    big_img(e) {
        big_img(e)
    },
    // 删除图片
    dele_img(e) {
        const index = e.currentTarget.dataset.index
        const attr_name = e.currentTarget.dataset.content
        let actionextre_create_imgs = this.data[attr_name + '_imgs']
        let dele_btn = this.data[attr_name + '_dele_btn']
        actionextre_create_imgs.splice(index, 1)
        dele_btn.splice(index, 1)
        this.setData({ [attr_name + '_imgs']: actionextre_create_imgs, [attr_name + '_dele_btn']: dele_btn })
        this[attr_name].imgs.splice(index, 1)
    },
    // 唤醒删除
    wake_up_to_delete(e) {
        console.log(e)
        const index = e.currentTarget.dataset.index
        const attr_name = e.currentTarget.dataset.content
        let dele_btn = this.data[attr_name + '_dele_btn']
        console.log(dele_btn)
        console.log(index)
        dele_btn[index] = false
        console.log(dele_btn)
        this.setData({ [attr_name + '_dele_btn']: dele_btn })
    },
    deleteFiles(e) {
        let rank = e.currentTarget.dataset.index
        let that = this
        that.data.action_update_files.splice(rank, 1)
        that.data.action_update_files.forEach((item, eq) => {
            item.show_delete_box = false
        });
        that.setData({
            action_update_files: that.data.action_update_files
        })
        that.action_update.file_contents = JSON.stringify(that.data.action_update_files)
    },
    showDeleteBox(e) {
        let rank = e.currentTarget.dataset.index
        let that = this
        that.data.action_update_files.forEach((item, eq) => {
            if (rank == eq) {
                item.show_delete_box = true
            } else {
                item.show_delete_box = false
            }
        });
        that.setData({
            action_update_files: that.data.action_update_files
        })

    },
    deleteFiles2(e) {
        let rank = e.currentTarget.dataset.index
        let attr_name = e.currentTarget.dataset.content
        let that = this
        let str = attr_name + '_files'
        that.data[str].splice(rank, 1)
        that.data[str].forEach((item, eq) => {
            item.show_delete_box = false
        });
        that.setData({
            [str]: that.data[str]
        })
        console.log(that.data[str], 'that.data[str]')
        that[attr_name].file_contents = JSON.stringify(that.data[str])
    },
    showDeleteBox2(e) {
        console.log(5555)
        let rank = e.currentTarget.dataset.index
        let attr_name = e.currentTarget.dataset.content
        let that = this
        let str = attr_name + '_files'
        that.data[str].forEach((item, eq) => {
            if (rank == eq) {
                item.show_delete_box = true
            } else {
                item.show_delete_box = false
            }
        });
        that.setData({
            [str]: that.data[str]
        })

    },
    onPullDownRefresh() {
        this.initdata()
        wx.stopPullDownRefresh()
    },
    backtrack() {
        wx.navigateTo({
            url: '/pages/project/project?project_id=' + this.actionextre_create.project_id
        })
        getApp().globalData.shared = false
        this.setData({ shared: false })
    },
    revivification() {
        const project_id = this.actionextre_create.project_id
        lbajax('project', 'redel', 'POST', { project_id }, (res) => {
            if (res.status == 1) {
                promptBox(res.data, this.initdata)
            }
        })
    },
    handelShowUploadBox() {
        let that = this
        that.setData({ uploadTypeBox: true })
    },
    uploadFileAction(e) {
        let version = wx.getSystemInfoSync().SDKVersion
        if (compareVersion(version, '2.6.0') < 0) {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return
        }
        let that = this
        let attr_name = e.currentTarget.dataset.content
        let file_contents = JSON.parse(that[attr_name].file_contents)
        console.log(that[attr_name], 'kkkkkkkkk')
        let count = 9 - file_contents.length - that[attr_name].imgs.length
        if (count <= 0) {
            popup('图片和附件最多只能上传9个')
            return
        }
        console.log(count)
        // showLoading()
        that.setData({isShowLoading: true})
        wx.chooseMessageFile({
            count: count,
            type: 'file',
            success(res1) {
                console.log(res1)
                const tempFilePaths = res1.tempFiles
                let len = tempFilePaths.length
                let eq = 0
                tempFilePaths.forEach((element, index) => {
                    if(element.size > 30*1024*1024) {
                        popup(element.name+'附件太大了，不能超过 30M')
                        that.setData({isShowLoading: false})
                        return
                    }
                    let upload_task = wx.uploadFile({
                        url: url + 'common/uploadfile', // 仅为示例，非真实的接口地址
                        filePath: element.path,
                        name: 'file',
                        formData: {
                            name: element.name
                        },
                        success(res2) {
                            console.log(res2.data)
                            eq = eq + 1
                            let res = JSON.parse(res2.data)
                            if (res.status == 1) {
                                let arr = {}
                                arr.file_name = res.data.file_name
                                arr.url = res.data.url
                                arr.show_delete_box = false
                                that.data[attr_name + '_files'].push(arr)
                                console.log(that.data[attr_name + '_files'], 5555555555555555555, that[attr_name].file_contents, ' that[attr_name].file_contents', that[attr_name])
                                that.setData({ [attr_name + '_files']: that.data[attr_name + '_files'], uploadTypeBox: false })
                                that[attr_name].file_contents = JSON.stringify(that.data[attr_name + '_files'])
                            } else {
                                popup(res.data)
                                return
                            }
                        },
                        complete: function () {
                            if ( len == eq) {
                                that.setData({isShowLoading: false})
    
                            }
                        }
                    })
                    // upload_task.onProgressUpdate((res) => {
                    //     if (len - 1 == index && res.progress == 100) {
                    //         hideLoading()
                    //     }
                    // })
                });

            },
            fail: function (res) {
                // hideLoading()
                that.setData({ isShowLoading: false })

            },
            complete() {
                that.setData({ uploadTypeBox: false})
            }
        })
    },
    lookFile(e) {
        let that = this
        let path
        showLoading()
        wx.downloadFile({
            url: e.currentTarget.dataset.file_path,
            success: function (res) {
                console.log(res, 5555)
                let  path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
                wx.openDocument({
                    filePath: path,
                    success: function (res) {
                        console.log('打开成功',res);
                        hideLoading(1000)
                    }
                })
            },
            fail: function (res) {
                hideLoading()
            }
        })
        // downloadTask.onProgressUpdate((res) => {
        //     console.log(path,'下载进度', res.progress)
        //     // console.log('已经下载的数据长度', res.totalBytesWritten)
        //     // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        //     if (res.progress == 100) {
        //         hideLoading(1000)
        //     }
        // })
    },
    reload() {
        const options = wx.getStorageSync('details_options')
        this.onShow(options)
        this.onLoad(options)
    }
})