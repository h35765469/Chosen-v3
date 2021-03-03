var express = require('express');
var router = express.Router();

const GetProduct = require('../controllers/product/get_controller');

getProduct = new GetProduct();

router.get('/product', getProduct.getAllProduct);

//獲得所有商店的商品
router.get('/shop_product', getProduct.getShopProduct)

module.exports = router;