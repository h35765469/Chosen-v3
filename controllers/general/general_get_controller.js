const Check = require('../../service/member_check');

const verify = require('../../models/member/verification_model');
const GeneralData = require('../../models/general/get_general_model');

check = new Check();

module.exports = class General {
    //獲得general data
    getGeneral(req, res, next) {
        GeneralData.getGeneralData().then(result => {
            res.json({
               result
            })
        }, (err) => {
            res.json({
                err
            })
        })
    }
}