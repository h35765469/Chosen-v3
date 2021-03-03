//此class專門拿到玩家所有買過的商店用品

const db = require('../connection_db');
module.exports.getUserBuyProductData = function (userId) {
    return new Promise((resolve, reject) => {
        //獲取玩家所有購買造型。
        db.query('SELECT product.id, product.product_category_id, product.name, product.preview_img_url, product.description FROM product INNER JOIN user_product_list ON product.id = user_product_list.product_id WHERE user_product_list.user_id = ?', userId, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}