const db = require('../connection_db');

const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

module.exports.getGeneralData = function () {
    let result = {};
    return new Promise((resolve, reject) => {
        result.version = "1.0.0";
        result.maintain = false;
        resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', result));
    })
}