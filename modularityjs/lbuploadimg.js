
const { url } = require('../config.js')
const { showLoading,hideLoading } = require('../modularityjs/publicfunction.js')
const lbuploadimgs = function (fn, count,fun) {
    let serverimg = []
    wx.chooseImage({
        count: count || 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            console.log(res)
            const tempFilePaths = res.tempFilePaths
            let lbnum = 0
            // showLoading()
            console.log(tempFilePaths,'tempFilePathstempFilePathstempFilePaths')
            tempFilePaths.forEach((item, index, arry) => {
                wx.uploadFile({
                    url: url + 'common/uploadimg',
                    filePath: tempFilePaths[index],
                    name: 'file',
                    header: {
                        'Content-Type': 'multipart/form-data'
                    },
                    success: function (res) {
                        let data = JSON.parse(res.data)
                        serverimg[index] = data.data
                    },
                    complete: function () {
                        ++lbnum
                        if (tempFilePaths.length == lbnum) {
                            console.log(tempFilePaths, 'tempFilePaths, serverimg',serverimg)
                            fn(tempFilePaths, serverimg)
                        }
                        // hideLoading()
                    }
                })
            })
        },
        complete() {
            fun()
        }
    })
}
module.exports = {
    lbuploadimgs
}