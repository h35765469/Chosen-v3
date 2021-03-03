const db = require('../connection_db');
const jwt = require("jsonwebtoken");
var crypto = require('crypto');
const config = require("../../config/development_config");

module.exports = function register(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        // 尋找是否有重複的email
        //平
        // db.query('SELECT email FROM member_info WHERE email = ?', memberData.email, function (err, rows) {
        //加
        db.query('SELECT email FROM user WHERE email = ?', memberData.email, function (err, rows) {
            // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.status = "註冊失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            // 如果有重複的email
            if (rows.length >= 1) {
                result.status = "註冊失敗。";
                result.err = "已有重複的Email。";
                reject(result);
            } else {
                const token = generateToken();
                const userData = {
                    account: memberData.email,
                    email: memberData.email,
                    password: memberData.password,
                    token: token,
                    login_type: memberData.login_type
                }
                // 將資料寫入資料庫
                //平
                // db.query('INSERT INTO member_info SET ?', memberData, function (err, rows) {
                //加
                db.query('INSERT INTO user SET ?', userData, function (err, rows) {
                    // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    if (err) {
                        console.log(err);
                        result.status = "註冊失敗。";
                        result.err = "伺服器錯誤，請稍後在試！"
                        reject(result);
                        return;
                    }
                    // 若寫入資料庫成功，則回傳給clinet端下：
                    result.status = "註冊成功。"
                    result.registerMember = userData;
                    resolve(result);
                })
            }
        })
    })
}

function generateToken()
{
    // 產生token
    const token = jwt.sign({
        algorithm: 'HS256',
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
        data: crypto.randomBytes(32).toString('base64').substr(0, 8)
    }, config.secret);
    return token;
}