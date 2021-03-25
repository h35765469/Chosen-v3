const db = require('../connection_db');
const request = require('request-promise');
const ReturnCodeConfig = require('../../service/ReturnCodeConfig')
const encryption = require('../member/encryption');

module.exports.memberLogin = function(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        // 找尋
        db.query('SELECT * FROM user WHERE email = ? AND password = ?', [memberData.email, memberData.password], function (err, rows) {
            if (err) {
                result.status = "登入失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            resolve(rows);
        });
    });
}

//第三方登入
module.exports.memberLoginOAuth = function(loginType, loginToken)
{
    let result = {};
    return new Promise((resolve, reject) => {
        if('fb' == loginType)
        {
            goFbLogin(resolve, reject, loginType, loginToken);
            // var fb_token = loginToken;
        
            // const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
            // const options = {
            //     method: 'GET',
            //     uri: `https://graph.facebook.com/v2.11/me`,
            //     qs: {
            //         access_token: fb_token,
            //         fields: userFieldSet
            //     },
            //     json:true //true 的話會自動將資料做 JSON.parse
            // };
            // request(options)
            //     .then(fbRes => {

            //         console.log(fbRes);
            //         // 尋找是否有重複的fb token
            //         db.query('SELECT * FROM user WHERE token = ?', fb_token, function (err, rows) {
            //         // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            //             if (err) {
            //                 console.log(err);
            //                 result.status = "註冊失敗。"
            //                 result.err = "伺服器錯誤，請稍後在試！"
            //                 reject(result);
            //                 return;
            //             }
            //             // 如果有重複的fb token
            //             if (rows.length >= 1) {
            //                 result.status = "登入成功";
            //                 result.err = "已有重複的Email。";
            //                 reject(result);
            //             } else {
            //                 // 獲取client端資料
            //                 const memberData = {
            //                     account: fbRes.id,
            //                     email: fbRes.email,
            //                     password: '',
            //                     nickname: fbRes.name,
            //                     login_type:"fb",
            //                     token: fb_token,
            //                 }
    
            //                 // 將資料寫入資料庫
            //                 db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
            //                     // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            //                     if (err) {
            //                         console.log(err);
            //                         result.status = "註冊失敗。";
            //                         result.err = "伺服器錯誤，請稍後在試！"
            //                         reject(result);
            //                         return;
            //                     }
            //                     // 若寫入資料庫成功，則回傳給clinet端下：
            //                     result.status = "註冊成功。"
            //                     result.registerMember = memberData;
            //                     resolve(result);
            //                 })
            //             }
            //         });
            //     });
        }
        else if('google' == loginType)
        {
            goGoogleLogin(resolve, reject, loginType, loginToken);
            // if (!loginToken) {
            //     // res
            //     //   .status(400)
            //     //   .send({ error: "Request Error: Google access token is required." });
            //     resolve("Request Error: Google access token is required.");
            //     return;
            // }
        
            //     // Get profile from google
            // getGoogleProfile(loginToken)
            // .then(function(profile) {
            //     if (!profile.name || !profile.email) {
            //         // res.status(400).send({
            //         //     error: "Permissions Error: name, email are required."
            //         // });
            //         reject("Permissions Error: name, email are required.");
            //         return;
            //     }
            //     // res.send({
            //     //     user: {
            //     //         name: profile.name,
            //     //         email: profile.email,
            //     //         picture: profile.picture
            //     //     }
            //     // });
            //     resolve({
            //         user: {
            //             name: profile.name,
            //             email: profile.email,
            //             picture: profile.picture
            //         }
            //     });
            // })
            // .catch(function(error) {
            //     // res.status(500).send({ error: error });
            // });
        }
    });
    
}

//輸入玩家暱稱
module.exports.inputUserNickname = function(nickname, loginToken)
{
    let result = {};
    return new Promise((resolve, reject) => {
        // 找尋
        db.query('UPDATE user SET nickname =? WHERE token = ?', [nickname, loginToken], function (err, rows) {
            if (err) {
                resolve(ReturnCodeConfig.response('404', '更新名字', '', err));
                return;
            }
            resolve(ReturnCodeConfig.response('0000', '更新名字', '', rows));
        });
    });
}

let goFbLogin = function(resolve, reject, loginType, loginToken)
{
    var fb_token = loginToken;
        
    const userFieldSet = 'id, name, email, link, picture';
    const options = {
        method: 'GET',
        // uri: `https://graph.facebook.com/v2.11/me`,
        uri: `https://graph.facebook.com/v9.0/me`,
        qs: {
            access_token: fb_token,
            fields: userFieldSet
        },
        json:true //true 的話會自動將資料做 JSON.parse
    };
    request(options)
        .then(fbRes => {

            console.log(fbRes);
            // 尋找是否有重複的fb token
            db.query('SELECT * FROM user WHERE account = ?', fbRes.id, function (err, rows) {
                var result = {};
                // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                if (err) {
                    console.log(err);
                    resolve(ReturnCodeConfig.response('504', '註冊失敗', '', err));
                    return;
                }
                // 如果有重複的fb token
                if (rows.length >= 1) {
                    result = 
                    {
                        nickname: rows[0].nickname,
                        money: rows[0].money,
                        userToken:rows[0].token,
                    };
                    resolve(ReturnCodeConfig.response('0000', '登入成功', '', result));
                } else {
                    generateUser(resolve, fbRes);
                    // let genToken = gen_token();
                    
                    // // 獲取client端資料
                    // const memberData = {
                    //     account: fbRes.id,
                    //     email: fbRes.email,
                    //     password: '',
                    //     nickname: fbRes.name,
                    //     login_type:"fb",
                    //     token: genToken,
                    // }

                    // // 將資料寫入資料庫
                    // db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
                    //     // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                    //     if (err) {
                    //         console.log(err);
                    //         resolve(ReturnCodeConfig.response('400', '註冊失敗', '', rows[0]));
                    //         return;
                    //     }
                    //     // 若寫入資料庫成功，則回傳給clinet端下：
                    //     result.registerMember = memberData;
                    //     resolve(resolve(ReturnCodeConfig.response('0000', '註冊成功', '', result)));
                    // })
                }
            });
        });
}

let goGoogleLogin = function(resolve, reject, loginType, loginToken)
{
    if (!loginToken) {
        // res
        //   .status(400)
        //   .send({ error: "Request Error: Google access token is required." });
        resolve("Request Error: Google access token is required.");
        return;
    }

        // Get profile from google
    getGoogleProfile(loginToken)
    .then(function(profile) {
        if (!profile.name || !profile.email) {
            // res.status(400).send({
            //     error: "Permissions Error: name, email are required."
            // });
            reject("Permissions Error: name, email are required.");
            return;
        }
        // res.send({
        //     user: {
        //         name: profile.name,
        //         email: profile.email,
        //         picture: profile.picture
        //     }
        // });

        // 尋找是否有重複的google token
        db.query('SELECT * FROM user WHERE account = ?', profile.id, function (err, rows) {
            var result = {};
            // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                resolve(ReturnCodeConfig.response('504', '註冊失敗', '', err));
                return;
            }
            // 如果有重複的fb token
            if (rows.length >= 1) {
                result = 
                {
                    nickname: rows[0].nickname,
                    money: rows[0].money,
                    userToken:rows[0].token,
                };
                resolve(ReturnCodeConfig.response('0000', '登入成功', '', result));
            } else {
                generateGoogleUser(resolve, profile);
                // let genToken = gen_token();
                
                // // 獲取client端資料
                // const memberData = {
                //     account: fbRes.id,
                //     email: fbRes.email,
                //     password: '',
                //     nickname: fbRes.name,
                //     login_type:"fb",
                //     token: genToken,
                // }

                // // 將資料寫入資料庫
                // db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
                //     // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
                //     if (err) {
                //         console.log(err);
                //         resolve(ReturnCodeConfig.response('400', '註冊失敗', '', rows[0]));
                //         return;
                //     }
                //     // 若寫入資料庫成功，則回傳給clinet端下：
                //     result.registerMember = memberData;
                //     resolve(resolve(ReturnCodeConfig.response('0000', '註冊成功', '', result)));
                // })
            }
        });
    })
    .catch(function(error) {
        // res.status(500).send({ error: error });
    });
}

let getGoogleProfile = function(accessToken) {
    return new Promise((resolve, reject) => {
        if(!accessToken){
            resolve(null);
            return
        };
        request(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`,
            function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                console.log(body);
                body = JSON.parse(body);
                if(body.error) {
                    reject(body.error);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

let generateUser = function(resolve, fbRes)
{
    result = {};
    const token  = encryption.getReToken(encryption.getReRandomId() + Date.now());

    db.query('SELECT * FROM user WHERE token = ?', token, function (err, rows) {
        
        if(rows.length > 0)
        {
            return generateUser(resolve, fbRes);
        }

         // 獲取client端資料
         const memberData = {
            account: fbRes.id,
            email: fbRes.email,
            password: '',
            nickname: '',
            login_type:"fb",
            token: token,
        }

        // 將資料寫入資料庫
        db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
            // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                resolve(ReturnCodeConfig.response('400', '註冊失敗', '', rows[0]));
                return;
            }
            // 若寫入資料庫成功，則回傳給clinet端下：
            result = 
            {
                nickname: "",
                money: 0,
                userToken: token,
            };
            resolve(resolve(ReturnCodeConfig.response('0000', '註冊成功', '', result)));
        })
        
        return token;
    });
}

let generateGoogleUser = function(resolve, googleRes)
{
    result = {};
    const token  = encryption.getReToken(encryption.getReRandomId() + Date.now());

    db.query('SELECT * FROM user WHERE token = ?', token, function (err, rows) {
        
        if(rows.length > 0)
        {
            return generateGoogleUser(resolve, googleRes);
        }

         // 獲取client端資料
         const memberData = {
            account: googleRes.id,
            email: googleRes.email,
            password: '',
            nickname: '',
            login_type:"google",
            token: token,
        }

        // 將資料寫入資料庫
        db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
            // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                resolve(ReturnCodeConfig.response('400', '註冊失敗', '', rows[0]));
                return;
            }
            // 若寫入資料庫成功，則回傳給clinet端下：
            result = 
            {
                nickname: "",
                money: 0,
                userToken: token,
            };
            resolve(resolve(ReturnCodeConfig.response('0000', '註冊成功', '', result)));
        })
        
        return token;
    });
}