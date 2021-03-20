//此class專門拿到玩家所有買過的商店用品

const { resolve } = require('bluebird');
const db = require('../connection_db');
const ReturnCodeConfig = require('../../service/ReturnCodeConfig')

module.exports.getUser = function(userId)
{
    return new Promise((resolve, reject) => {
        //獲取玩家基本基料。
        db.query('SELECT nickname, money FROM user WHERE id = ? LIMIT 1', userId, function (err, rows) {
            if (err) {
                reject(ReturnCodeConfig.response('504', '獲取資料失敗', 'none', err));
                return;
            }
            var result = {};
            result.nickname = rows[0].nickname;
            result.money = rows[0].money;

            //獲取玩家所選造型。
            db.query("SELECT product.id, product.product_category_id, product.name, product.preview_img_url, product.description FROM product" +
            "INNER JOIN user_select_product ON product.id = user_select_product.product_id" + 
            "WHERE user_select_product.user_id = ?", userId, function (err, rows) {
                if (err) {
                    reject(ReturnCodeConfig.response('504', '獲取資料失敗', 'none', err));
                    return;
                }
                result.selected_locker_products = rows;
                console.log("mite " + result);
                resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', result));
            });
        });
    });
}

module.exports.getUserBuyProductData = function (userId) {
    return new Promise((resolve, reject) => {
        //獲取玩家所有購買造型。
        db.query('SELECT product.id, product.product_category_id, product.name, product.preview_img_url, product.description FROM product INNER JOIN user_product_list ON product.id = user_product_list.product_id WHERE user_product_list.user_id = ?', userId, function (err, rows) {
            if (err) {
                reject(ReturnCodeConfig.response('504', '獲取資料失敗', 'none', err));
                return;
            }
            var result = {};
            result.user_products = rows;
            resolve(ReturnCodeConfig.response('0000', '獲取資料成功', 'none', result));
        });
    });
}

//購買虛擬貨幣
module.exports.postBuyVirtualMoneyData = function (userId)
{
    return new Promise((resolve, reject) =>
    {
        db.query('')
    });
}