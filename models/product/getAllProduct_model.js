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
module.exports.getShopProductData = function(userData)
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
            var tempBlocks = {};
            for(i =0; i < rows.length; i++)
            {
                var row = rows[i]
                if(tempBlocks[row.sale_type] != null)
                {
                    var sale_type = row.sale_type
                    delete row.sale_type
                    //判別錢是否足夠購買=====================
                    row.purchase_button_status = "enough"
                    if(row.price > userData.money)
                    {
                        row.purchase_button_status = "notEnough"
                    }
                    //==========================
                    tempBlocks[sale_type].products.push(row)
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
                block.sale_type = row.sale_type
                var products = [];
                delete row.sale_type
                //判別錢是否足夠購買=====================
                row.purchase_button_status = "enough"
                if(row.price > userData.money)
                {
                    row.purchase_button_status = "notEnough"
                }
                //==========================
                products.push(row);
                block.products = products;
                tempBlocks[block.sale_type] = block;
            }
            var product_blocks = [];
            for (const [key, value] of Object.entries(tempBlocks)) {
                product_blocks.push(value);
            }
            result.product_blocks = product_blocks;
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', result));
        });
    });
}

//藉著productId獲得product
module.exports.getShopProductDataById = function(productId)
{
    return new Promise((resolve, reject) =>
    {
        db.query('SELECT * FROM product WHERE id = ?', productId,  
        function(err, rows)
        {
            // 若資料庫部分出現問題，則回傳「伺服器錯誤，請稍後再試！」的結果。
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            // 若資料庫部分沒問題，則回傳全部產品資料。
            resolve(rows[0]);
        });
    });
}