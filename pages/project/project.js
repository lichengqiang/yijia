const { lbajax } = require('../../modularityjs/lbajax.js')
const Comm = require('../../modularityjs/comm.js')
const { lbuploadimgs } = require('../../modularityjs/lbuploadimg.js')
const { promptBox, popup, lookQr, toOtherApp, sendAppNum, wayToOtherApp, showLoading, hideLoading, compareVersion } = require('../../modularityjs/publicfunction.js')
const hmacsha1 = require('../../modularityjs/hmac-sha1.js')
const Base64 = require('../../modularityjs/base64.min.js').Base64
const { url } = require('../../config')
Page({
    data: {
        tab1: true,
        lbtab1: true,
        focuslb: true,
        focuslbss: true,
        aitehide: true,
        aitechengyuan: true,
        tankuanghide: true,
        delettankuang: true,
        delettext: '删除记忆',
        delethide: true,
        lbtab11: true,
        focuslba: true,
        focuslbssa: true,
        finishUp: true,
        toption: true,
        scales: 1,
        finishUped: true,
        Android: true,
        partlyCompleted: true,
        jiahao: true,
        close_xinjian: 'close_xinjian',
        member: {},
        action_create_content: '',
        l: 'project',
        b: 'Update',
        createName: 'project_update',
        initdata: {},
        project_id: '',
        textvalue: '',
        userInfo: {},
        del_button_hide: true,
        checked: true,
        explanation: true,
        isshare: true,
        share_text: true,
        new_button: false,
        current_problem: {},
        rollback: true,
        scrolltab1: false,
        scrolltab2: false,
        at_name: '',
        action_create_at_all: false,
        at_headimg: [],
        the_first_landing: false,
        jurisdiction: true,
        backtrack: false,
        revivification: false,
        current: -1,
        first_img: false,
        action_create_imgs: [],
        action_create_files: [],
        action_create_dele_btn: [],
        is_to_other_app: false,
        version: 1, //版本号
        mode: 0,
        pic: '',
        searchType: [
            { color: "gray", colorClass: "yj_gray", text: "全部记忆" },
            { color: "violet", colorClass: "yj_violet", text: "紫色记忆" },
            { color: "blue", colorClass: "yj_blue", text: "蓝色记忆" },
            { color: "blueness", colorClass: "yj_blueness", text: "青色记忆" },
            { color: "green", colorClass: "yj_green", text: "绿色记忆" },
            { color: "red", colorClass: "yj_red", text: "红色记忆" },
            { color: "yellow", colorClass: "yj_yellow", text: "黄色记忆" }
        ],
        isShowColorBox2: false,
        choseColor2: 'gray',
        uploadTypeBox: false,
        isShowLoading: false,
        isNet: 'init',
        popup_loading: 'init',
        // isBeginPlay: false ,//是否开始录音
        start_record: 'start_record',
        stop_record: 'stop_record',
        play_record: 'play_record',

    },

    onLoad: function (options) {
        console.log(options, 'optionsoptionsoptions')
        wx.setStorageSync('project_options', options)
        const app_session = wx.getStorageSync('app_session')
        const that = this
        this.formId = []
        const project_id = options.project_id
        this.setData({ 'userInfo': wx.getStorageSync('userInfo') })
        this.setData({ project_id })
        this.action_create = {
            project_id: project_id,
            at_users: [],
            at_all: false,
            content: '',
            imgs: [],
            file_contents: []
        }
        this.comm = new Comm(this)
        this.action_status_id = ''
        this.project_update = {
            id: project_id,
            content: '',
            other_share: true
        }
        if (getApp().globalData.the_first_landing) {
            this.the_first_landing()
        }

        if (app_session) { this.initdata(project_id) }

    },

    onShow: function (options) {
        let that = this
        // const project_id = this.action_create.project_id
        // const app_session = wx.getStorageSync('app_session')
        // if (app_session){ that.initdata(project_id)}
        that.record()
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
    big_img(e) {
        console.log(e, 5555)
        lookQr(e)
    },
    toOtherApp(e) {
        toOtherApp(e)
    },
    copy(e) {
        const attr = e.currentTarget.dataset.attr
        const key = e.currentTarget.dataset.key
        let initdata = this.data.initdata
        for (let index in initdata.complete) {
            initdata.complete[index].copey_hidden = true
        }
        for (let index in initdata.notcomplete) {
            initdata.notcomplete[index].copey_hidden = true
        }
        initdata[attr][key].copey_hidden = false
        this.setData({ initdata })
        setTimeout(() => {
            initdata[attr][key].copey_hidden = true
            this.setData({ initdata })
        }, 5000)
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
    initSendData() {
        this.action_create.content = ''
        this.action_create.at_all = false
        this.action_create.at_users = []
        this.action_create.imgs = []
        this.action_create.file_contents = []
    },
    initdata(project_id) {
        console.log(555555)
        let that = this
        this.action_create.content = ''
        this.action_create.at_all = false
        this.action_create.at_users = []
        this.action_create.imgs = []
        this.action_create.file_contents = []
        showLoading()
        this.setData({ popup_loading: 'begin_loading' })
        lbajax('user', 'Atuser', 'POST', { project_id }, (res) => {
            if (res.status == 1) {
                if (res.data.length > 0) {
                    for (let index in res.data) {
                        res.data[index].isaite = false
                    }
                }
                this.member_init = res.data
                this.setData({ member: res.data, action_create_imgs: [], action_create_files: [] })
            }
        })
        lbajax('Action', 'Actions', 'POST', { project_id: this.action_create.project_id }, (res) => {
            if (res.code == 200) {
                for (let index in res.data.complete) {
                    res.data.complete[index].copey_hidden = true
                }
                for (let index in res.data.notcomplete) {
                    res.data.notcomplete[index].copey_hidden = true
                }
                this.setData({ 'choseColor2': res.data.color })
                this.project_update = {
                    id: this.action_create.project_id,
                    content: res.data.content,
                    other_share: res.data.other_share,
                    project_user_id: res.data.project_user_id,
                    color: that.data.choseColor2
                }
                if (res.data.other_share > 0 || res.data.project_user_id == that.data.userInfo.id) {
                    console.log('显示按钮')
                    wx.showShareMenu({
                        withShareTicket: true
                    })
                    this.setData({ 'checked': true })
                } else {
                    console.log('隐藏按钮')
                    wx.hideShareMenu()
                    this.setData({ 'checked': false })
                }
                if (res.data.notcomplete.length == 0) {
                    this.new_button = true
                } else {
                    this.new_button = false
                }
                this.clean_buffer = res.data
                this.setData({ initdata: res.data, textvalue: res.data.content, new_button: this.new_button })
                if (res.data.isdel) {
                    this.setData({ revivification: true })
                } else {
                    this.setData({ revivification: false })
                }
                this.setData({ share_text: res.data.other_share })
                if (res.data.project_user_id == this.data.userInfo.id) {
                    this.setData({ jurisdiction: true })
                } else {
                    this.setData({ jurisdiction: false })
                }
            }
            hideLoading()
            this.setData({ popup_loading: 'end_loading' })
        })
    },
    revivification() {
        const project_id = this.action_create.project_id
        lbajax('project', 'redel', 'POST', { project_id }, (res) => {
            if (res.status == 1) {
                promptBox(res.data, this.initdata)
            }
        })
    },
    // 录音
    record() {
        const recorderManager = wx.getRecorderManager()
        this.recorderManager = recorderManager
        // let sd = `POSTaai.qcloud.com / asr / v1 / 1254317300 ?sub_service_type = 1 &engine_model_type=16k_0&callback_url=https://yijia.readw.cn/api/test/testaudio&res_text_format = 0 &res_type=1&source_type=1 &secretid=AKIDRn01pT0FP0ayA9kgJl7HF1f8QWXMQurf &
        //           timestamp=1513158961 &
        //             expired=1513159961 &
        //               nonce=4654654`
        // HmacSha1(sd, SecretKey)
        console.log()
        recorderManager.onStart(() => {
            console.log('recorder start')
        })
        recorderManager.onResume(() => {
            console.log('recorder resume')
        })
        recorderManager.onPause(() => {
            console.log('recorder pause')
        })
        recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            const data = `https://aai.qcloud.com/asr/v1/1252240276?sub_service_type=1&engine_model_type=16k_0&callback_url=https://yijia.readw.cn/api/test/testaudio&res_text_format=0&res_type=1&source_type=1&secretid=AKIDd7PWRDtJdpqhEeMx4za6VjXGnAPSi2d7&timestamp=${Date.parse(new Date()) / 1000}&expired=${Date.parse(new Date()) / 1000 + 24 * 60 * 60}&nonce=465214654`
            let hash = Base64.encode(hmacsha1('RsBJFyVwBHBsVwBE5nvuiKjGeqqdLUXO', data));
            const { tempFilePath } = res
            wx.request({
                url: data,
                method: 'POST',
                data: tempFilePath,
                header: {
                    "Content-Type": "application/octet-stream",
                    "Authorization": hash
                },
                success: function (res) {
                    console.log(res)
                }
            })
            // wx.uploadFile({
            //   url: data,
            //   filePath: tempFilePath,
            //   name: 'Https Body',
            //   header: {
            //     "Content-Type": "application/octet-stream",
            //     "Authorization": hash
            //   },
            //   formData: {
            //   },
            //   success: function (res) {
            //     console.log(res)
            //   }
            // })
        })
        recorderManager.onFrameRecorded((res) => {
            const { frameBuffer } = res
            console.log(frameBuffer)
            console.log('recorder stop', res)
            const appid = '1252240276'
            const req_url = 'aai.qcloud.com/asr/v1/' + appid;
            const timestamp = Date.parse(new Date()) / 1000
            const expired = Date.parse(new Date()) / 1000 + 24 * 60 * 60
            const args = {
                'callback_url': "https://yijia.readw.cn/api/test/testaudio",
                'channel_num': 1,
                'engine_model_type': '16k_0',
                'expired': expired,
                'nonce': 465214654,
                'projectid': 1090302,
                'res_text_format': 0,
                'res_type': 1,
                'secretid': 'AKIDd7PWRDtJdpqhEeMx4za6VjXGnAPSi2d7',
                'source_type': 1,
                'sub_service_type': 0,
                // 'timestamp' : timestamp,
            }
            console.log(args)
            var strTem = "";
            for (var value in args) {
                strTem += value + '=' + args[value] + "&";
            }
            strTem += 'timestamp=' + timestamp
            var sig_str = 'POST' + req_url + '?' + strTem;
            console.log(strTem, 'url')
            console.log(sig_str, 'sig_str')
            console.log(hmacsha1('RsBJFyVwBHBsVwBE5nvuiKjGeqqdLUXO', sig_str));
            let hash = hmacsha1('RsBJFyVwBHBsVwBE5nvuiKjGeqqdLUXO', sig_str);
            wx.request({
                url: 'https://' + req_url + '?' + strTem,
                method: 'POST',
                data: frameBuffer,
                header: {
                    "Content-Type": "application/octet-stream",
                    "Authorization": hash,
                    "Content-Length": frameBuffer.byteLength
                },
                success: function (res) {
                    console.log(res)
                }
            })
        })
    },
    start() {
        console.log('开始')
        const options = {
            duration: 60000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 64000,
            format: 'mp3',
            frameSize: 3
        }
        this.recorderManager.start(options)
    },
    end() {
        console.log('结束')
        this.recorderManager.stop()
    },
    move() {

    },
    // end
    // tab切换
    tabed: function () {
        this.setData({ tab1: false, new_button: false })
    },
    tabing: function () {
        this.setData({ tab1: true, new_button: this.new_button })
    },

    onShareAppMessage(re) {
        const that = this
        const random_number = this.random_number()
        return {
            title: '',
            path: 'pages/project/project?project_id=' + this.action_create.project_id + '&random_number=' + random_number,
            success: function (r) {
                that.shareTicket(r.shareTickets, (encryptedData, iv) => {
                    lbajax('group', 'getshare', 'POST', { project_id: that.action_create.project_id, encryptedData, iv }, (res) => { })
                })
            },
            fail: function (res) { }
        }
    },
    // 解释分享
    question() {
        this.setData({ explanation: false })
    },
    question_close() {
        this.setData({ explanation: true })
    },

    // 滚动
    onPageScroll(e) {
        if (e.scrollTop > this.topheight + 15) {
            this.setData({ scrolltab1: true, scrolltab2: true })
        } else {
            this.setData({ scrolltab1: false, scrolltab2: false })
        }
    },
    onPullDownRefresh() {
        this.initdata()
        wx.stopPullDownRefresh()
    },
    // 新增
    upLoadImg(e) {
        let that = this
        const attr_name = e.currentTarget.dataset.content
        const imgs = attr_name + '_imgs'
        let actionextre_create_imgs = that.data[imgs]
        let dele_btn = that.data[attr_name + '_dele_btn']
        let count = 9 - that.data.action_create_files.length - that[attr_name].imgs.length
        if (count <= 0) {
            popup('图片和附件最多只能上传9个')
            return
        }
        // console.log(count)
        that.setData({ isShowLoading: true })
        lbuploadimgs((bimgs, simgs) => {
            console.log(simgs, 'simgssimgssimgssimgs', bimgs)
            that[attr_name].imgs = that[attr_name].imgs.concat(simgs)
            actionextre_create_imgs = actionextre_create_imgs.concat(bimgs)
            for (let i = 0; i < bimgs.length; i++) {
                dele_btn.push(true)
            }
            that.setData({
                [imgs]: actionextre_create_imgs,
                [attr_name + '_dele_btn']: dele_btn,
                uploadTypeBox: false
            })
        }, count, function () {
            that.setData({ uploadTypeBox: false, isShowLoading: false })
        })
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
        const index = e.currentTarget.dataset.index
        const attr_name = e.currentTarget.dataset.content
        let dele_btn = this.data[attr_name + '_dele_btn']
        dele_btn[index] = false
        this.setData({ [attr_name + '_dele_btn']: dele_btn })
    },

    openColorBox2() {
        this.setData({
            isShowColorBox2: true
        })
    },

    handelChoseColor2(e) {
        let that = this
        let choseColor2 = e.currentTarget.dataset.color
        that.setData({
            choseColor2,
            isShowColorBox2: false
        })
        that.project_update.color = choseColor2
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
        console.log(attr_name, 'sssssss', that[attr_name], 'kkkkkkkkk', that.data.action_create_files)
        let count = 9 - that.data.action_create_files.length - that[attr_name].imgs.length
        if (count <= 0) {
            popup('图片和附件最多只能上传9个')
            return
        }
        console.log(count)
        that.setData({ isShowLoading: true })
        wx.chooseMessageFile({
            count: count,
            type: 'file',
            success(res1) {
                console.log(res1)
                const tempFilePaths = res1.tempFiles
                let len = tempFilePaths.length
                let eq = 0
                var max = tempFilePaths[0].size;
                tempFilePaths.forEach((element, index) => {
                    if (element.size > 30 * 1024 * 1024) {
                        popup(element.name + '附件太大了，不能超过 30M')
                        that.setData({ isShowLoading: false })
                        return
                    }
                    var cur = element.size;
                    cur > max ? max = cur : null

                    let upload_task = wx.uploadFile({
                        url: url + 'common/uploadfile', // 仅为示例，非真实的接口地址
                        filePath: element.path,
                        name: 'file',
                        formData: {
                            name: element.name
                        },
                        success(res2) {
                            eq = eq + 1
                            console.log(res2.data)
                            let res = JSON.parse(res2.data)
                            if (res.status == 1) {
                                let arr = {}
                                arr.file_name = res.data.file_name
                                arr.url = res.data.url
                                that.data.action_create_files.push(arr)
                                console.log(arr, that[attr_name].file_contents, ' that[attr_name].file_contents', that[attr_name])
                                that.setData({ [attr_name + '_files']: that.data.action_create_files, uploadTypeBox: false })
                                that[attr_name].file_contents = JSON.stringify(that.data.action_create_files)
                            } else {
                                popup(res.data)
                                return
                            }
                        },
                        complete: function () {
                            if (len == eq) {
                                that.setData({ isShowLoading: false })

                            }
                        }
                    })
                    upload_task.onProgressUpdate((res) => {
                        // console.log(res,'进度',max)
                        if (res.totalBytesExpectedToSend == max) {
                            console.log(res, res.progress, 'res.progress')
                        }

                    })

                });

            },
            fail: function (res) {
                // hideLoading()
                that.setData({ isShowLoading: false })

            },
            complete() {
                that.setData({ uploadTypeBox: false })

            }
        })
    },
    reload() {
        const options = wx.getStorageSync('project_options')
        this.onShow(options)
        this.onLoad(options)
    },
    // start_record() {
    //     console.log(555)
    //     let that = this
    //     that.recorderManager = wx.getRecorderManager()
    //     const options = {
    //         duration: 600000,
    //         format: 'aac',
    //     }
    //     that.recorderManager.start(options)
    // },
    // stop_record() {
    //     let that = this
    //     that.recorderManager.stop()
    //     that.recorderManager.onStop((res) => {
    //         console.log('recorder stop', res)
    //         that.record_url = res.tempFilePath
    //     })
    // },
    // play_record() {
    //     let that = this
    //     if(that.data.isBeginPlay) {
    //         return
    //     }
    //     const innerAudioContext = wx.createInnerAudioContext()
    //     innerAudioContext.src = that.record_url,
    //     innerAudioContext.play()
    //     that.setData({
    //         isBeginPlay: true
    //     })
    //     console.log('开始播放')
    //     innerAudioContext.onError((res) => {
    //       console.log(res.errMsg)
    //       console.log(res.errCode)
    //     })
    //     innerAudioContext.onEnded((res) => {
    //         console.log('播放结束')
    //         that.setData({
    //             isBeginPlay: false
    //         })
    //     })
    // }
}) 