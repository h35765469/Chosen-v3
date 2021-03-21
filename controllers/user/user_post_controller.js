const Check = require('../../service/member_check');

const verify = require('../../models/member/verification_model');
const UserModel = require('../../models/member/user_model');
const ReturnCodeConfig = require('../../service/ReturnCodeConfig');
const VerificationModel = require('../../models/member/verification_model');

var check = new Check();

module.exports = class PostUser 
{
    //用真錢購買虛擬貨幣
    postBuyVirtualMoney(req, res, next)
    {
        const token = req.headers['token'];
        //確定token是否有輸入
        if(check.checkNull(token) === true)
        {
            res.json(ReturnCodeConfig.response(400, "請輸入token！", "", {}))
        }
        else 
        {
            VerificationModel.verifyTokenInDataBase(token).then(tokenResult => {
                if(tokenResult === false)
                {
                    res.json(ReturnCodeConfig.response(400, "token失誤", "", {}))
                }
                else
                {
                    UserModel.getUserBuyProductData(tokenResult[0].id).then(result =>
                        {
                            res.json(ReturnCodeConfig.response('0000', 'success', '', result))
                        }, (err) =>
                        {
                            res.json({
                                result: err
                            })
                        })
                }
            });
        }
    }

    //更換角色造型
    postSelectedLockerProduct(req, res, next)
    {
        const token = req.headers['token'];
        //確定token是否有輸入
        if(check.checkNull(token) === true)
        {
            res.json(ReturnCodeConfig.response(400, "請輸入token！", "", {}))
        }
        else 
        {
            VerificationModel.verifyTokenInDataBase(token).then(tokenResult => {
                if(tokenResult === false)
                {
                    res.json(ReturnCodeConfig.response(400, "token失誤", "", {}))
                }
                else
                {
                    var selectedLockerProductData = 
                    {
                        user_id: tokenResult[0].id,
                        product_id: req.body.productId,
                        product_category_id: req.body.product_category_id
                    }
                    UserModel.postSelectedLockerProductData(selectedLockerProductData).then(result =>
                        {
                            res.json(ReturnCodeConfig.response('0000', 'success', '', result))
                        }, (err) =>
                        {
                            res.json({
                                result: err
                            })
                        })
                }
            });
        }
    }
}