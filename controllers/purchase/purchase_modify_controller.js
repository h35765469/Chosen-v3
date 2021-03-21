const Check = require('../../service/member_check');

const verify = require('../../models/member/verification_model');
const PurchaseShopProductModel = require('../../models/purchase/purchase_shop_product_model');
const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

check = new Check();

const GetAllProductModel = require('../../models/product/getAllProduct_model');

module.exports = class ModifyPurchase {
    //購買商店商品
    postPurchaseShopProduct(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (check.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else if (check.checkNull(token) === false) {
            verify.verifyTokenInDataBase(token).then(tokenResult => {
                if (tokenResult === false) {
                    res.json(ReturnCodeConfig.response(504, 'token 錯誤', '', {}))
                } else {
                    GetAllProductModel.getShopProductDataById(req.body.productID).then(result => {
                        
                        if(result.price > tokenResult[0].money)
                        {
                            res.json(ReturnCodeConfig.response('404', 'Not Enough Money', 'none', {}))
                        }
                        else
                        {
                            const purchaseShopProductData = {
                                user_id: tokenResult[0].id,
                                product_id: req.body.productID,
                            }
                            PurchaseShopProductModel.purchaseShopProduct(purchaseShopProductData).then(result => {
                                res.json(ReturnCodeConfig.response('0000', '購買成功', '', {}))
                            }, (err) => {
                                res.json({
                                    result: err
                                })
                            })
                        }
                    }, (err) => {
                        res.json({
                            result: err
                        })
                    })
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