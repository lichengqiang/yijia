const { lbajax } = require('../../modularityjs/lbajax.js')
const { promptBox} = require('../../modularityjs/publicfunction.js')
const app = getApp()
Page({
    data: {
        projects: {},
        searchType: [
            { color: "gray", colorClass: "yj_gray", text: "全部记忆" },
            { color: "violet", colorClass: "yj_violet", text: "紫色记忆" },
            { color: "blue", colorClass: "yj_blue", text: "蓝色记忆" },
            { color: "blueness", colorClass: "yj_blueness", text: "青色记忆" },
            { color: "green", colorClass: "yj_green", text: "绿色记忆" },
            { color: "red", colorClass: "yj_red", text: "红色记忆" },
            { color: "yellow", colorClass: "yj_yellow", text: "黄色记忆" }
        ],
        choseColor: 'gray',
        textColor: '全部记忆',
        isShowColorBox: false,
        projects_index: null,
        keyword: '#'
    },
    onLoad: function () {
       
    },
   
    onShow: function () {
        let that = this
        const app_session = wx.getStorageSync('app_session')
        // if (app_session) {
        //     let data = {
        //         color: that.data.choseColor,
        //         keyword: '#'
        //     }
        //     that.initdata(data)
        // }
    },

   
    changeColor(e) {
        let that = this
        let color= e.currentTarget.dataset.color
        let index= that.data.projects_index
            console.log(that.data.projects.notcomplete,'projects.notcomplete')
        var notcomplete_hide = 'projects.notcomplete['+index+'].hide'
        var notcomplete_group_hide = 'projects.notcomplete['+index+'].group_hide'
        that.setData({
            color: color,
            [notcomplete_hide]: false,
            [notcomplete_group_hide]: true,
        })
        
    },
    hideColorBox() {
        let that = this
        let index= that.data.projects_index
        var notcomplete_hide = 'projects.notcomplete['+index+'].hide'
        var notcomplete_group_hide = 'projects.notcomplete['+index+'].group_hide'
        that.setData({
            [notcomplete_hide]: false,
            [notcomplete_group_hide]: true,
        })
    },
    hideProjectsHandelPopup() {
        let that = this
        let index= that.data.projects_index
        var notcomplete_hide = 'projects.notcomplete['+index+'].hide'
        that.setData({
            [notcomplete_hide]: true,
        })
    },
  
    acquire(e) {
        console.log(888)
        if (e.detail.formId) {
            getApp().globalData.formId.push(e.detail.formId)
        }
    },

    initdata(data) {
        let that =this
        lbajax('project', 'search', 'POST',data, (res) => {
            if (res.code == 200) {
                let projects  = []
                if (res.data.notcomplete.constructor == Array && res.data.complete.constructor == Array) {
                    projects = res.data.notcomplete.concat(res.data.complete)
                    that.setData({ projects })
                }
            }
        })
    },
 
 
  
    touchstart: function (e) { },
    // catchlongtaping: function (e) {
    //     const atrr_name = e.currentTarget.dataset.atrr_name
    //     let index = e.currentTarget.dataset.index
    //     let projects = this.data.projects
    //     projects[atrr_name].forEach((item,eq) => {
    //         if(eq == index) {
    //             item.hide = false
    //         }else {
    //             item.hide = true
    //         }
    //     });
    //     this.setData({ projects, kongview: false ,projects_index: index})
    // },
 
    // 删除项目
    // project_del(e) {
    //     const project_id = e.currentTarget.dataset.project_id
    //     const that = this
    //     wx.showModal({
    //         title: '删除项目',
    //         content: '确认后项目将永远消失',
    //         success: function (res) {
    //             if (res.confirm) {
    //                 lbajax('project', 'del', 'POST', { project_id }, (res) => {
    //                     if (res.code == 200) {
    //                         that.initdata()
    //                     }
    //                 })
    //             } else if (res.cancel) {
    //                 console.log('用户点击取消')
    //             }
    //         }
    //     })
    // },
    // 项目置顶
    // project_top(e) {
    //     const project_id = e.currentTarget.dataset.project_id
    //     lbajax('project', 'top', 'POST', { project_id }, (res) => {
    //         if (res.code == 200) {
    //             this.initdata()
    //         }
    //     })
    // },
    handelInput(e) {
        console.log(e.detail.value)
        let that = this
        let data = {
            color: that.data.choseColor,
        }
        if(e.detail.value.length > 0) {
            data.keyword = e.detail.value
            that.setData({
                keyword: data.keyword
            })
            that.initdata(data)
        }else {
            console.log(5555)
            that.setData({ projects: [],keyword:'#'})
            if(that.data.choseColor != 'gray'){
                console.log(6666)
                data.keyword = '#'
                that.initdata(data)
            } 
        }
       
    },
    // sectionalization(e) {
    //     console.log(e.currentTarget.dataset)
    //     const atrr_name = e.currentTarget.dataset.atrr_name
    //     let projects = this.data.projects
    //     projects[atrr_name][e.currentTarget.dataset.index].hide = true
    //     projects[atrr_name][e.currentTarget.dataset.index].group_hide = false
    //     this.setData({ projects })
    // },
    openColorBox() {
        this.setData({
            isShowColorBox: !this.data.isShowColorBox
        })
    },
    handelChoseColor(e) {
        let choseColor = e.currentTarget.dataset.color
        let textColor = e.currentTarget.dataset.text
        this.setData({
            choseColor,
            textColor,
            isShowColorBox: false
        })
        let len = this.data.keyword.length
        console.log(choseColor , len)
        if(choseColor == 'gray' && (len == 0 ||  this.data.keyword == '#')) {
            return
        }
        let data = {
            color: this.data.choseColor,
            keyword: this.data.keyword,
        }
        this.initdata(data)
    },
    onPullDownRefresh() {
        let data = {
            color: this.data.choseColor,
            keyword: '#'
        }
        this.initdata(data)
        wx.stopPullDownRefresh()
    },
})