module.exports.response = function(returnCode, message, errType, data) {
    let result = {
    };
    result.returnCode = returnCode;
    result.message = message;
    result.errType = errType
    result.data = data;
    return result;
}