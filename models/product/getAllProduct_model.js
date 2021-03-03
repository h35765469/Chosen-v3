const db = require('../connection_db');

module.exports = function getProductData(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product', function (err, rows) {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.status = "取得全部訂單資料失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(rows);
        })
    })
}

//獲得所有這時間上架到商店的商品
module.exports.getShopProductData = function()
{
    let result = {};
    return new Promise((resolve, reject) =>
    {
        db.query('SELECT product.id as product_id, product.product_category_id, product.name, product.price, product.preview_img_url, product.description, product.skin_id, ' +
        'product_onsale_schedule.end_ts ' +   
        'FROM product INNER JOIN product_onsale_schedule ON product.id = product_onsale_schedule.product_id WHERE product_onsale_schedule.start_ts < now() AND product_onsale_schedule.end_ts > now()', 
        function(err, rows)
        {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                result.status = "取得全部訂單資料失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(rows);
        });
    });
}