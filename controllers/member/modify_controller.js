const toRegister = require('../../models/member/register_model');
const Check = require('../../service/member_check');
const encryption = require('../../models/member/encryption');
const loginAction = require('../../models/member/login_model');
const verify = require('../../models/member/verification_model');
const jwt = require("jsonwebtoken");
const config = require("../../config/development_config");
const updateAction = require('../../models/member/update_model');

const LoginModel = require('../../models/member/login_model');
// const loginModel = new LoginModel();
check = new Check();
const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

module.exports = class Member {
    postRegister(req, res, next) {

        // 進行加密
        const password = encryption(req.body.password);

        // 獲取client端資料
        //平
        // const memberData = {
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: password,
        //     create_date: onTime()
        // }

        //加
        const memberData = {
            account: req.body.email,
            email: req.body.email,
            password: password,
            login_type: "normal"
        }
        //===========


        const checkEmail = check.checkEmail(memberData.email);
        // 不符合email格式
        if (checkEmail === false) {
            res.json({
                status: "註冊失敗。",
                err: "請輸入正確的Eamil格式。(如1234@email.com)"
            })
        // 若符合email格式
        } else if (checkEmail === true) {
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.json({
                    result: result
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    err: err
                })
            })
        }
    }
    
    postLogin(req, res, next) {

        // 進行加密
        const password = encryption(req.body.password);

        // 獲取client端資料
        const memberData = {
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        const checkEmail = check.checkEmail(memberData.email);
        // 不符合email格式
        if (checkEmail === false) {
            res.json({
                status: "註冊失敗。",
                err: "請輸入正確的Eamil格式。(如1234@email.com)"
            })
        // 若符合email格式
        } else if (checkEmail === true) {
            LoginModel.memberLogin(memberData).then(rows => {
                if (check.checkNull(rows) === true) {
                    res.json({
                        result: {
                            status: "登入失敗。",
                            err: "請輸入正確的帳號或密碼。"
                        }
                    })
                } else if (check.checkNull(rows) === false) {
                    // 產生token
                    //平
                    // const token = jwt.sign({
                    //     algorithm: 'HS256',
                    //     exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
                    //     data: rows[0].id
                    // }, config.secret);
                    //res.setHeader('token', token);

                    //加
                    res.setHeader('token', rows[0].token);
                    //=======

                    res.json({
                        result: {
                            status: "登入成功。",
                            loginMember: "歡迎 " + rows[0].name + " 的登入！",
                        }
                    })
                }
            })
        }
    }

    //第三方登入
    postLoginOAuth(req, res, next)
    {
        var loginType = req.body.oauthType;
        var loginToken = req.body.oauthToken;
        
        //loginAction.memberLoginOAuth(loginType, loginToken)
        LoginModel.memberLoginOAuth(loginType, loginToken).then(response => {
            if (check.checkNull(response) === true) {
                res.json(ReturnCodeConfig.response('404', '登入失敗。', '', {}));
            } else if (check.checkNull(response) === false) {

                //res.setHeader('token', rows[0].token);
                res.json(
                    response
                )
            }
        });
    }

    putUpdate(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    const id = tokenResult;
                    
                    // 進行加密
                    const password = encryption(req.body.password);
    
                    const memberUpdateData = {
                        name: req.body.name,
                        password: password,
                        update_date: onTime()
                    }
                    updateAction(id, memberUpdateData).then(result => {
                        res.json({
                            result: result
                        })
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }

    putUpdateImage(req, res, next) {
        const form = new formidable.IncomingForm();
    
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false) {
            verify(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    form.parse(req, async function (err, fields, files) {
                        // 確認檔案大小是否小於1MB
                        if (check.checkFileSize(files.file.size) === true) {
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: "請上傳小於1MB的檔案"
                                }
                            })
                            return;
                        }
    
                        // 確認檔案型態是否為png, jpg, jpeg
                        if (check.checkFileType(files.file.type) === true) {
                            // 將圖片轉成base64編碼
                            const image = await fileToBase64(files.file.path);
    
                            const id = tokenResult;
    
                            // 進行加密
                            const password = encryption(fields.password);
                            const memberUpdateData = {
                                img: image,
                                name: fields.name,
                                password: password,
                                update_date: onTime()
                            }
    
                            updateAction(id, memberUpdateData).then(result => {
                                res.json({
                                    result: result
                                })
                            }, (err) => {
                                res.json({
                                    result: err
                                })
                            })
                        } else {
                            res.json({
                                result: {
                                    status: "上傳檔案失敗。",
                                    err: "請選擇正確的檔案格式。如：png, jpg, jpeg等。"
                                }
                            })
                            return;
                        }
                    })
                }
            })
        }
    }

    //輸入暱稱
    postInputNickname(req, res, next) {
        const token = req.headers['token'];
        console.log("fuck " + token);
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json(ReturnCodeConfig.response('504', '請輸入token', '', {}))
        } else if (check.checkNull(token) === false) {
            verify.verifyTokenInDataBase(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json(ReturnCodeConfig.response('400', "token錯誤。", '', {}))
                } else {
                    LoginModel.inputUserNickname(req.body.nickname, token).then(response => {
                        res.json(
                            response
                        )
                    });
                }
            })
        }
    }
}

//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}

const fileToBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', function (err, data) {
            resolve(data);
        })
    })
}