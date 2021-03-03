const db = require('../connection_db');

module.exports.purchaseShopProduct = function(data) {
    //購買商店商品
    let result = {};
  
    return new Promise(async (resolve, reject) => {
        const userProductData = {
            user_id: data.user_id,
            product_id: data.product_id
        };

        db.query('INSERT INTO user_product_list SET ?', userProductData, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                result.err = "伺服器錯誤，請稍後再試!"
                reject(result);
                return;
            }
        })

        result.state = "購買成功";
        resolve(result);
    })
  }