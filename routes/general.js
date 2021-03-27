var express = require('express');
var router = express.Router();

const GeneralGetController = require('../controllers/general/general_get_controller');

//獲得所有商店的商品
router.get('/geneal', GeneralGetController.getGeneral)

module.exports = router;