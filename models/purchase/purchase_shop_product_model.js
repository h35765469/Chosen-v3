const db = require('../connection_db');

module.exports.purchaseShopProduct = function(data) {
    //購買商店商品
    let result = {};
  
    return new Promise(async (resolve, reject) => {

        //扣除資料庫user money
        db.query('UPDATE user SET money = ? WHERE id = ?', [data.user_remain_money, data.user_id], function (err, rows) {
            if (err) {
                reject(ReturnCodeConfig.response('404', '購買失敗', 'none', err));
                return;
            }

            const userProductData = {
                user_id: data.user_id,
                product_id: data.product_id
            };
    
            db.query('INSERT INTO user_product_list SET ?', userProductData, function(err, rows)
            {
                if(err)
                {
                    reject(ReturnCodeConfig.response('404', '購買失敗', 'none', err));
                    return;
                }
                resolve(ReturnCodeConfig.response('404', '購買失敗', 'none', {}));
            })
        })
    })
  }