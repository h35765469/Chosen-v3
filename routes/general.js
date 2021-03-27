var express = require('express');
var router = express.Router();

const GeneralGetController = require('../controllers/general/general_get_controller');

const generalGetController = new GeneralGetController();

//獲得所有商店的商品
router.get('/general', generalGetController.getGeneral)

module.exports = router;