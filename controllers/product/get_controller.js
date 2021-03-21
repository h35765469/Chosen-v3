var ProductData = require('../../models/product/getAllProduct_model');
var ReturnCodeConfig = require('../../service/ReturnCodeConfig')
const verify = require('../../models/member/verification_model');

module.exports = class GetProduct {
    // 取得全部產品資料
    getAllProduct(req, res, next) {
      ProductData().then(result => {
        res.json({
            result: result
        })
      }, (err) => {
        res.json({
            result: err
        })
      })
    }
    
    //獲得所有商店販售商品
    getShopProduct(req, res, next)
    {
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
                  ProductData.getShopProductData().then(result => {
                    res.json(result)
                  }, (err) => 
                  {
                    res.json(err)
                  })
                }
            })
        }
    }
}