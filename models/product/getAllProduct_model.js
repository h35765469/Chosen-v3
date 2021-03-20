const db = require('../connection_db');

const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

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
        'product_onsale_schedule.type AS sale_type, ' + 'product_onsale_schedule.end_ts ' +   
        'FROM product INNER JOIN product_onsale_schedule ON product.id = product_onsale_schedule.product_id WHERE product_onsale_schedule.start_ts < now() AND product_onsale_schedule.end_ts > now()', 
        function(err, rows)
        {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                reject(ReturnCodeConfig.response('504', '獲取資料失敗', 'none', err));
                return;
            }
            var result = {};
            var tempBlocks = [];
            console.log("rows " + rows.length)
            for(i =0; i < rows.length; i++)
            {
                var row = rows[i]
                console.log("row " + row)
                if(tempBlocks[row.sale_type] != null)
                {
                    tempBlocks[row.sale_type].products.push(row)
                    continue;
                }
                var block = {};
                if(row.sale_type == "daily")
                {
                    block.title = "Daily Items"
                }
                else if(row.sale_type == "featured")
                {
                    block.title = "Featured Items"
                }
                var products = [];
                products.push(row);
                block.products = products;
                tempBlocks[row.sale_type] = block;
                console.log("temp " + row.sale_type + " " + block.title + " " + block.products + " " + tempBlocks[row.sale_type].length)
            }
            result.product_blocks = tempBlocks;
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', result));
        });
    });
}