const jwt = require('jsonwebtoken');
const config = require('../../config/development_config');
const db = require('../connection_db');


//進行token認證
module.exports = function verifyToken(token) {
    let tokenResult = "";
    const time = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        //判斷token是否正確
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    tokenResult = false;
                    resolve(tokenResult);
                    //token過期判斷
                } else if (decoded.exp <= time) {
                    tokenResult = false;
                    resolve(tokenResult);
                    //若正確
                } else {
                    tokenResult = decoded.data
                    resolve(tokenResult);
                }
            })
        }
    });
}

//在資料庫進行token驗證
module.exports.verifyTokenInDataBase = function(token)
{
    return new Promise((resolve, reject) => {
        //判斷token是否正確
        if (token) {
           //獲取在資料庫的token資料檢驗並回傳user id。
            db.query('SELECT id FROM user WHERE token = ?', token, function (err, rows) {
                
                if (err) {
                    // result.status = "登入失敗。"
                    // result.err = "伺服器錯誤，請稍後在試！"
                    resolve(false);
                    return;
                }
                resolve(rows);
            });
        }
    });
}