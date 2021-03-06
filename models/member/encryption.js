const crypto = require('crypto');

module.exports = function getRePassword(password) {
    //加密
    let hashPassword = crypto.createHash('sha1');
    hashPassword.update(password);
    const rePassword = hashPassword.digest('hex');
    //   console.log('rePassword: ' + rePassword);
    return rePassword;
}

//產出token
module.exports.getReToken = function(token)
{
    //加密
    let hashToken = crypto.createHash('sha1');
    hashToken.update(token);
    const reToken = hashToken.digest('hex');
    //   console.log('rePassword: ' + rePassword);
    return reToken;
}

//產出隨機id
module.exports.getReRandomId = function()
{
    return crypto.randomBytes(16).toString("hex");;
}