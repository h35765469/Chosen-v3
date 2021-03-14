var express = require('express');
var router = express.Router();

const UserGetController = require('../controllers/user/user_get_controller');

const userGetController = new UserGetController();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user_data', userGetController.getUser)

router.get('/user_buy_product', userGetController.getUserBuyProduct)

module.exports = router;
