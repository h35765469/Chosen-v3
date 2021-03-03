var express = require('express');
var router = express.Router();

const PurchaseModifyMethod = require('../controllers/purchase/purchase_modify_controller');

purchaseModifyMethod = new PurchaseModifyMethod();

router.post('/purchase_shop_product', purchaseModifyMethod.postPurchaseShopProduct);

module.exports = router;