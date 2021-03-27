const db = require('../connection_db');

const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

module.exports.getGeneralData = function () {
    return new Promise((resolve, reject) => {
        resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', {'version': "1.0.0", 'maintain': false}));
    })
}