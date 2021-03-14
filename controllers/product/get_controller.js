var ProductData = require('../../models/product/getAllProduct_model');
var ReturnCodeConfig = require('../../service/ReturnCodeConfig')

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
      ProductData.getShopProductData().then(result => {
          res.json(result)
        }, (err) => 
        {
          res.json(result)
        })
    }
}