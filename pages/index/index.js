const { lbajax } = require('../../modularityjs/lbajax.js')
const { promptBox, lookQr, toOtherApp, sendAppNum,  showLoading, hideLoading,wayToOtherApp } = require('../../modularityjs/publicfunction.js')
const app = getApp()
Page({
    data: {
        lbtab11: true,
        lbstyle: [],
        initlbstyle: [], //保存最初的位置
        lbcombine: true,
        lbcombineed: true,
        lbstyleing: [],
        lbstyled: [],
        alllength: 7,
        inglength: 5,
        emptyview: '',
        focuslba: true,
        trtrt: '',
        hides: [],
        kongview: true,
        focuslbssa: true,
        userInfo: {},
        projects: {},
        initprojects: {},
        checked: true,
        explanation: true,
        share_text: true,
        the_first_landing: false,
        jurisdiction: true,
        current: -1,
        first_img: false,
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
        isShowColorBox: false,
        choseColor: 'gray',
        isShowColorBox2: false,
        choseColor2: 'gray',

        projects_index: null,
        notCompleteArr: [],
        hasNotCompleteArr: false,
        teamColor: '',
        teamColorArr: [],
        teamColorArrStr: '',
        ifHasData: 'init',
        isNet: 'init',
        popup_loading: 'init'
    },
    onLoad: function () {
        if (getApp().globalData.the_first_landing) {
            this.the_first_landing()
        }
        this.project = { other_share: true }
        const app_session = wx.getStorageSync('app_session')
        if (app_session) { this.initdata() }
    },

    onShow: function () {
        let that = this
        // const app_session = wx.getStorageSync('app_session')
        // if (app_session) { that.initdata() }
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
        lookQr(e)
    },
    toOtherApp(e) {
        toOtherApp(e)
    },
  
    hideProjectsHandelPopup() {
        let that = this
        let index = that.data.projects_index
        var notcomplete_hide = 'projects.notcomplete[' + index + '].hide'
        that.setData({
            [notcomplete_hide]: true,
        })
    },
    the_first_landing() {
        const first_img = getApp().globalData.the_first_landing
        this.setData({ first_img })
    },
    first_close(e) {
        this.acquire(e)
        getApp().globalData.the_first_landing = false
        this.setData({ first_img: false })
    },
    close_handbook(e) {
        this.acquire(e)
        this.setData({ the_first_landing: !this.data.the_first_landing })
        if (this.data.the_first_landing) {
            this.setData({ current: 0 })
        } else {
            this.setData({ current: -1 })
        }
    },
    acquire(e) {
        if (e.detail.formId) {
            getApp().globalData.formId.push(e.detail.formId)
        }
    },

    calculate: function (lengths, fn) {
        let lbarry = []
        let lboudhu = []
        let lbqishu = []
        for (let i = 0; i < lengths; i++) {
            if (i % 2 == 0) {
                lboudhu.push(i)
            } else {
                lbqishu.push(i)
            }
        }
        lboudhu.forEach((vaule, index, arry) => {
            //基数的方块的位置
            lbarry[vaule] = 'top:' + index * 430 + 'rpx;left:0;'
        })
        lbqishu.forEach((vaule, index, arry) => {
            //偶数的方块的位置
            lbarry[vaule] = 'top:' + index * 430 + 'rpx;left:calc(50% + 8rpx);'
        })
        fn(lbarry)
    },
    update_userInfo() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({ userInfo })
        }
    },
    initdata() {
        this.update_userInfo()
        this.setData({ kongview: true ,popup_loading: 'begin_loading'})
        console.log(this,'thisthisthisthisthis')
        showLoading()
        lbajax('project', 'projects', 'POST', {}, (res) => {
            if (res.code == 200) {
                if (res.data.notcomplete.constructor == Array) {
                    res.data.notcomplete.map((item, index, arr) => {
                        res.data.notcomplete[index].hide = true
                        res.data.notcomplete[index].group_hide = true
                        if(!res.data.notcomplete[index].color) {
                            res.data.notcomplete[index].color="gray"
                        }
                    })
                }
                if (res.data.complete.constructor == Array) {
                    res.data.complete.map((item, index, arr) => {
                        res.data.complete[index].hide = true
                        if(!res.data.complete[index].color) {
                            res.data.complete[index].color="gray"
                        }
                    })
                }
                let alllength = res.data.notcomplete.length + res.data.complete.length
                let inglength = res.data.notcomplete.length
                this.lbshuju = []
                for (let i = 0; i < inglength; i++) {
                    this.lbshuju.push('top:0;left:0;')
                }
                this.complete_length = res.data.complete.length
                this.setData({ projects: res.data, initprojects: res.data, alllength: alllength, inglength })
                this.calculate(this.data.alllength, (arry) => {
                    this.setData({ lbstyle: arry, initlbstyle: arry })
                    this.setData({
                        lbstyleing: this.data.lbstyle.slice(0, this.data.inglength), //未完成的那些
                        lbstyled: this.data.lbstyle.slice(this.data.inglength), //已经完成的那些
                    })
                    this.emptyview(alllength)
                })
                console.log(alllength,'alllength')
                if(alllength > 0) {
                    this.setData({
                        ifHasData: 'hasData'
                    })
                } else {
                    this.setData({
                        ifHasData: 'hasNoData'
                    })
                }
                // if (!this.data.lbcombine) this.combine()
                // if (!this.data.lbcombineed) this.combineed()
                this.setData({popup_loading:'end_loading'})
                hideLoading()
            }
        },this)
    },
    authorization(res) {
        console.log('66')
        console.log(res)
        let that = this
        const userInfo = wx.getStorageSync('userInfo')
        if (res.detail.encryptedData) {
            lbajax('user', 'setuserinfo', 'POST', { encryptedData: res.detail.encryptedData, iv: res.detail.iv }, (res) => {
                if (res.code == 200) {
                    wx.setStorageSync('userInfo', res.data)
                    that.setData({ userInfo: res.data })
                }
            },that)
        }
    },
    emptyview: function (alllength) {
        let index = Math.ceil(alllength / 2.0)
        this.setData({ emptyview: 'top:' + (index * 430) + 'rpx;' })
    },
    // 打开新建
    floating_new: function (e) {
        this.acquire(e)
        this.setData({ lbtab11: false })
    },
    // 关闭新建
    close_xinjian1: function (e) {
        if (e) {
            this.acquire(e)
        }
        this.setData({ lbtab11: true })
    },
    // 未完成合并
    combine: function () {
        return;
        // this.setData({ lbcombine: false, lbstyleing: this.lbshuju })
        // if (this.data.lbcombineed) {
        //     this.setData({ lbstyled: this.data.lbstyle.slice(1) })
        // } else {
        //     let nr = this.data.lbstyle[1]
        //     this.meili(nr)
        // }
        // this.emptyview(!this.data.lbcombineed ? 2 : (this.data.alllength - this.data.inglength + 1))
        let that = this
        let color = e.currentTarget.dataset.color
        console.log(e.currentTarget.dataset.color, 1111111, that.data.projects, that.data.initlbstyle)
        if (color == "gray") {
            let arr = []
            let colorArr = [].push(color)
            that.data.projects.notcompletesum.hide = true
            that.data.projects.notcompletesum.group_hide = true
            that.data.projects.notcompletesum.color = color
            arr.push(that.data.projects.notcompletesum)
            that.data.projects.notcomplete = arr.concat(that.data.projects.notcomplete)
            console.log(that.lbshuju)
            that.setData({
                projects: that.data.projects,
                lbcombine: false,
                lbstyleing: that.lbshuju,
                notCompleteArr: arr,
                hasNotCompleteArr: true,
                teamColor: color,
                teamColorArrStr: color,
                teamColorArr: colorArr
            })
            if (that.data.lbcombineed) {
                that.setData({ lbstyled: that.data.lbstyle.slice(1) })
            } else {
                let nr = that.data.lbstyle[1]
                that.meili(nr)
            }
            // that.emptyview(!that.data.lbcombineed ? 2 : (that.data.alllength - that.data.inglength + 1))
        } else {
            that.data.teamColorArr.push(color)
            that.data.teamColorArrStr = that.data.teamColorArr.join(',')
            that.data.projects[color].hide = true
            that.data.projects[color].group_hide = true
            that.data.projects[color].color = color
            that.data.notCompleteArr.push(that.data.projects[color])
            let notCompleteArrLen = that.data.notCompleteArr.length
            console.log(that.data.initlbstyle)

            let notcomplete = []
            that.data.projects.notcomplete.forEach((item, index) => {
                if (item.color == color) {
                    that.data.lbstyleing[index] = that.data.initlbstyle[notCompleteArrLen - 1]
                } else {
                    notcomplete.push(item)
                }
            });
            console.log(that.data.lbstyleing)

            that.data.projects.notcomplete = that.data.notCompleteArr.concat(notcomplete)
            let all_length = that.data.projects.notcomplete.length + that.data.projects.complete.length
            that.calculate(all_length, (arry) => {
                console.log(arry, 'arryarryarryarryarry')
                that.setData({ lbstyle: arry })
                that.setData({
                    lbstyleing: that.data.lbstyle.slice(0, that.data.inglength), //未完成的那些
                    lbstyled: that.data.lbstyle.slice(that.data.inglength), //已经完成的那些
                })
            })
            console.log(that.data.projects.notcomplete, 55555, that.data.notCompleteArr)
            that.setData({
                projects: that.data.projects,
                lbcombine: false,
                notCompleteArr: that.data.notCompleteArr,
                hasNotCompleteArr: true,
                lbstyleing: that.data.lbstyleing,
                teamColor: color,
                teamColorArrStr: that.data.teamColorArrStr,
                teamColorArr: that.data.teamColorArr
            })

        }

        that.emptyview(!that.data.lbcombineed ? 2 : (that.data.alllength - that.data.inglength + 1))
    },

    // 未完成散开
    disperse: function (e) {
        this.setData({
            lbcombine: true,
            lbstyleing: this.data.lbstyle.slice(0, this.data.inglength),
        })
        let color = e.currentTarget.dataset.color
        if (this.data.lbcombineed) {
            this.setData({ lbstyled: this.data.lbstyle.slice(this.data.inglength) })
        } else {
            let nr = this.data.lbstyle[this.data.inglength]
            this.meili(nr)
        }
        if (color == 'gray') {
            this.setData({
                notCompleteArr: [],
                projects: this.data.initprojects,
                lbstyleing: this.data.initlbstyle,
                teamColor: '',
                teamColorArrStr: '',
                teamColorArr: []

            })
        } else {
            let str = this.data.teamColor + ','
            let arrStr = this.data.teamColorArrStr.split(str).join('')
            let arr = arrStr.split(',')
            this.setData({
                // notCompleteArr:  [],
                // projects: this.data.initprojects,
                // lbstyleing: this.data.initlbstyle,
                teamColor: '',
                teamColorArrStr: arrStr,
                teamColorArr: arr
            })

        }
        this.emptyview(!this.data.lbcombineed ? (this.data.inglength + 1) : (this.data.alllength))
    },
    //已完成的位置修改
    meili: function (nr) {
        let lbstyled = this.data.lbstyled
        console.log(669999, nr, lbstyled)
        lbstyled.forEach((value, index, arry) => {
            lbstyled[index] = nr
        })
        console.log(lbstyled)
        this.setData({ lbcombineed: false, lbstyled: lbstyled })
    },
    // 已完成合并
    combineed: function () {
        return;
        let nr = this.data.lbstyled[0]
        this.meili(nr)
        if (this.data.lbcombine) {
        } else {
        }
        this.emptyview(!this.data.lbcombine ? 2 : (this.data.inglength + 1))
    },
    // 已完成散开
    dispersed: function () {
        this.setData({ lbcombineed: true })
        if (this.data.lbcombine) {
            this.setData({ lbstyled: this.data.lbstyle.slice(this.data.inglength) })
        } else {
            this.setData({ lbstyled: this.data.lbstyle.slice(1, this.complete_length + 1) })
        }
        this.emptyview(!this.data.lbcombine ? (this.data.alllength - this.data.inglength + 1) : (this.data.alllength))
    },
    smalla: function () {
        this.setData({ focuslba: false, focuslbssa: false })
    },
    selecta: function () {
        this.setData({ focuslba: true })
        setTimeout(() => {
            this.setData({ focuslbssa: true })
        }, 250)
    },
    touchstart: function (e) { },
    catchlongtaping: function (e) {
        const atrr_name = e.currentTarget.dataset.atrr_name
        let index = e.currentTarget.dataset.index
        let projects = this.data.projects
        projects[atrr_name].forEach((item, eq) => {
            if (eq == index) {
                item.hide = false
            } else {
                item.hide = true
            }
        });
        this.setData({ projects, kongview: false, projects_index: index })
    },
    xiaoshi: function () {
        let projects = this.data.projects
        projects.complete.forEach((value, index, arry) => {
            projects.complete[index].hide = true
        })
        projects.notcomplete.forEach((value, index, arry) => {
            projects.notcomplete[index].hide = true
            projects.notcomplete[index].group_hide = true
        })
        this.setData({ projects, kongview: true ,})
    },
    enterContent(e) {
        this.project.content = e.detail.value
    },
    // 分享
    switch1Change(e) {
        this.project.other_share = e.detail.value
        this.setData({ share_text: e.detail.value })
    },
    // 提交
    publish(e) {
        this.acquire(e)
        const that = this
        that.project.formId = [e.detail.formId]
        that.project.color = that.data.choseColor2
        showLoading()
        if (that.project.content) {
            lbajax('project', 'create', 'POST', { ...that.project, }, (res) => {
                if (res.code == 200) {
                    that.initdata()
                    promptBox(res.data, that.close_xinjian1)
                }
                hideLoading()
            },this)
        } else {
            promptBox('内容不能为空')
        }
    },
    // 删除项目
    project_del(e) {
        const project_id = e.currentTarget.dataset.project_id
        const that = this
        wx.showModal({
            title: '删除项目',
            content: '项目将进入个人中心记忆遗失处',
            success: function (res) {
                if (res.confirm) {
                    lbajax('project', 'del', 'POST', { project_id }, (res) => {
                        if (res.code == 200) {
                            that.initdata()
                        }
                    },this)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 项目置顶
    project_top(e) {
        const project_id = e.currentTarget.dataset.project_id
        lbajax('project', 'top', 'POST', { project_id }, (res) => {
            if (res.code == 200) {
                this.initdata()
            }
        })
    },
    // 解释分享
    question() {
        this.setData({ explanation: false })
    },
    question_close() {
        this.setData({ explanation: true })
    },
    onPullDownRefresh() {
        this.initdata()
        wx.stopPullDownRefresh()
    },
    swiperchange(e) {
        this.setData({ current: e.detail.current })
    },
    // 唤醒分组
    sectionalization(e) {
        console.log(e.currentTarget.dataset)
        let that = this
        const atrr_name = e.currentTarget.dataset.atrr_name
        const project_id = e.currentTarget.dataset.project_id
        let projects = that.data.projects
        that.getDetaile(project_id, function() {
            projects[atrr_name][e.currentTarget.dataset.index].hide = true
            projects[atrr_name][e.currentTarget.dataset.index].group_hide = false
            that.setData({ projects })
            console.log(that.project_update)
        })
      
    },
    getDetaile(project_id,fun) {
        lbajax('Action', 'Actions', 'POST', { project_id }, (res) => {
            if (res.code == 200) {
                this.project_update = {
                    id: project_id,
                    content: res.data.content,
                    other_share: res.data.other_share,
                    project_user_id: res.data.project_user_id,
                    color:  res.data.color,
                }
                fun()
            }
        })
    },
    changeColor(e) {
        let that = this
        let color = e.currentTarget.dataset.color
        let index = that.data.projects_index
        that.project_update.color = color
        lbajax('project', 'Update', 'POST', that.project_update, (res) => {
            if(res.code == 200) {
                var notcomplete_hide = 'projects.notcomplete[' + index + '].hide'
                var notcomplete_group_hide = 'projects.notcomplete[' + index + '].group_hide'
                var notcomplete_color = 'projects.notcomplete[' + index + '].color'
                that.setData({
                    [notcomplete_color]: color,
                    [notcomplete_hide]: false,
                    [notcomplete_group_hide]: true,
                })
            }
        })
    },
    hideColorBox() {
        let that = this
        let index = that.data.projects_index
        var notcomplete_hide = 'projects.notcomplete[' + index + '].hide'
        var notcomplete_group_hide = 'projects.notcomplete[' + index + '].group_hide'
        that.setData({
            [notcomplete_hide]: false,
            [notcomplete_group_hide]: true,
        })
    },
    openColorBox() {
        this.setData({
            isShowColorBox: !this.data.isShowColorBox
        })
    },
    openColorBox2() {
        this.setData({
            isShowColorBox2: true
        })
    },
    handelChoseColor(e) {
        let that = this
        let choseColor = e.currentTarget.dataset.color
        that.setData({
            choseColor,
            isShowColorBox: false
        })

        if (choseColor == 'gray') {
            that.initdata()
        } else {
            let data = {
                color: choseColor,
                keyword: '#'
            }
            that.searchData(data)
        }

    },
    handelChoseColor2(e) {
        let that = this
        let choseColor2 = e.currentTarget.dataset.color
        that.setData({
            choseColor2,
            isShowColorBox2: false
        })

    },
    searchData(data) {
        this.update_userInfo()
        this.setData({ kongview: true })
        lbajax('project', 'search', 'POST', data, (res) => {
            if (res.code == 200) {
                if (res.data.notcomplete.constructor == Array) {
                    res.data.notcomplete.map((item, index, arr) => {
                        res.data.notcomplete[index].hide = true
                        res.data.notcomplete[index].group_hide = true
                    })
                }
                if (res.data.complete.constructor == Array) {
                    res.data.complete.map((item, index, arr) => {
                        res.data.complete[index].hide = true
                    })
                }
                let alllength = res.data.notcomplete.length + res.data.complete.length
                let inglength = res.data.notcomplete.length
                this.lbshuju = []
                for (let i = 0; i < inglength; i++) {
                    this.lbshuju.push('top:0;left:0;')
                }
                this.complete_length = res.data.complete.length
                this.setData({ projects: res.data, initprojects: res.data, alllength: alllength, inglength })
                this.calculate(this.data.alllength, (arry) => {
                    this.setData({ lbstyle: arry, initlbstyle: arry })
                    this.setData({
                        lbstyleing: this.data.lbstyle.slice(0, this.data.inglength), //未完成的那些
                        lbstyled: this.data.lbstyle.slice(this.data.inglength), //已经完成的那些
                    })
                    this.emptyview(alllength)
                })

            }
        })
    },
    i_know() {
        lbajax('user', 'userpc', 'POST', null, (res) => {
            if(res.code == 200) {
                this.data.userInfo.is_pc = 1
                this.setData({ userInfo:  this.data.userInfo })
                wx.setStorageSync('userInfo', this.data.userInfo)
            }

        })
    },
    reload() {
        let that = this
        that.onShow()
        that.onLoad()
       
    }

})