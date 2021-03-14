const Check = require('../../service/member_check');

const verify = require('../../models/member/verification_model');
const UserModel = require('../../models/member/user_model');
const ReturnCodeConfig = require('../../service/ReturnCodeConfig');
const VerificationModel = require('../../models/member/verification_model');

var check = new Check();

module.exports = class GetUser 
{
    //獲得玩家買得所有商品
    getUserBuyProduct(req, res, next)
    {
        const token = req.headers['token'];
        //確定token是否有輸入
        if(check.checkNull(token) === true)
        {
            res.json(ReturnCodeConfig.response(400, "請輸入token！", "", {}))
        }
        else 
        {
            // verify(token).then(tokenResult => {
            //     if(tokenResult === false)
            //     {
            //         res.json(ReturnCodeConfig.response(400, "token失誤", "", {}))
            //     }
            //     else
            //     {
            //         UserModel.getUserBuyProductData().then(result =>
            //             {
            //                 res.json({
            //                     result: result
            //                 })
            //             }, (err) =>
            //             {
            //                 res.json({
            //                     result: err
            //                 })
            //             })
            //     }
            // })

            VerificationModel.verifyTokenInDataBase(token).then(tokenResult => {
                if(tokenResult === false)
                {
                    res.json(ReturnCodeConfig.response(400, "token失誤", "", {}))
                }
                else
                {
                    UserModel.getUserBuyProductData(tokenResult[0].id).then(result =>
                        {
                            res.json(result)
                        }, (err) =>
                        {
                            res.json(result)
                        })
                }
            });
        }
    }
}