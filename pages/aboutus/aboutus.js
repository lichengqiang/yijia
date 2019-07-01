// pages/aboutus/aboutus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch_tab: 0,
    current:-1
  },
  switch_tab(e) {
    this.setData({ switch_tab: e.detail.current })
  },
  close_handbook() {
    if (getApp().globalData.the_first_landing) {
      console.log('一次')
      getApp().globalData.the_first_landing = false
    }
    this.setData({ the_first_landing: !this.data.the_first_landing })
    if (this.data.the_first_landing) {
      this.setData({ current: 0 })
    } else {
      this.setData({ current: -1 })
    }
  },
  swiperchange(e) {
    this.setData({ current: e.detail.current })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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