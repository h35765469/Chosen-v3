var express = require('express');
var router = express.Router();
const request = require('request-promise');
const db = require('../models/connection_db');

const MemberModifyMethod = require('../controllers/member/modify_controller');

memberModifyMethod = new MemberModifyMethod();

// 註冊新會員
router.post('/member', memberModifyMethod.postRegister);

// 會員登入
router.post('/member/login', memberModifyMethod.postLogin);

// 更新會員資料
router.put('/member', memberModifyMethod.putUpdate);

// 更新會員資料（檔案上傳示範，可直接取代/member的PUT method）
router.put('/updateimage', memberModifyMethod.putUpdateImage);

//fb login
// router.post('/auth/facebook', (req, res) => {
//     var fb_token = req.body.fb_token;
    
//     const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
//     const options = {
//         method: 'GET',
//         uri: `https://graph.facebook.com/v2.11/me`,
//         qs: {
//             access_token: fb_token,
//             fields: userFieldSet
//         },
//         json:true //true 的話會自動將資料做 JSON.parse
//     };
//     request(options)
//         .then(fbRes => {
//             console.log(fbRes);
//             // return done(null,fbRes);

//             let result = {};
//             // 尋找是否有重複的fb token
//             db.query('SELECT token FROM user WHERE token = ?', fb_token, function (err, rows) {
//                 // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
//                 if (err) {
//                     console.log(err);
//                     result.status = "註冊失敗。"
//                     result.err = "伺服器錯誤，請稍後在試！"
//                     //reject(result);
//                     return;
//                 }
//                 // 如果有重複的fb token
//                 if (rows.length >= 1) {
//                     result.status = "登入成功";
//                     result.err = "已有重複的Email。";
//                     //reject(result);
//                 } else {
//                     // 獲取client端資料
//                     const memberData = {
//                         account: fbRes.id,
//                         nickname: fbRes.name,
//                         email: fbRes.email,
//                         login_type:"fb",
//                         token: fb_token,
//                         register_ts: onTime()
//                     }

//                     // 將資料寫入資料庫
//                     db.query('INSERT INTO user SET ?', memberData, function (err, rows) {
//                         // 若資料庫部分出現問題，則回傳給client端「伺服器錯誤，請稍後再試！」的結果。
//                         if (err) {
//                             console.log(err);
//                             result.status = "註冊失敗。";
//                             result.err = "伺服器錯誤，請稍後在試！"
//                             //reject(result);
//                             return;
//                         }
//                         // 若寫入資料庫成功，則回傳給clinet端下：
//                         result.status = "註冊成功。"
//                         result.registerMember = memberData;
//                         //resolve(result);
//                     })
//                 }
//             });
//         });
// });
router.post('/auth/facebook', memberModifyMethod.postLoginOAuth)


//google login
//平
// router.post('/auth/google', (req, res) => 
// {
//     if (!req.body.google_token) {
//         res
//           .status(400)
//           .send({ error: "Request Error: Google access token is required." });
//         return;
//     }

//         // Get profile from google
//     getGoogleProfile(req.body.google_token)
//     .then(function(profile) {
//         if (!profile.name || !profile.email) {
//         res.status(400).send({
//             error: "Permissions Error: name, email are required."
//         });
//         return;
//         }
//         res.send({
//         user: {
//             name: profile.name,
//             email: profile.email,
//             picture: profile.picture
//         }
//         });
//     })
//     .catch(function(error) {
//         res.status(500).send({ error: error });
//     });
// });
router.post('/auth/google', memberModifyMethod.postLoginOAuth)

router.post('/member/input_name', memberModifyMethod.postInputNickname)


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
module.exports = router;