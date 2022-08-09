const  sequelize = require('../mysql/connection.js')
// const {User as users} = require('../mysql/model/user.js')
const site = require('../mysql/model/site.js')
const pole = require('../mysql/model/pole.js')
const transaction = require('../mysql/model/transaction.js')
const  DBAdapterError = require('../utils/error/errors.js')


exports.getUserInfoService = async (userId,fields) => {
    
        const userInfo = await users.findOne({
            where:{ userId: userId },
            attributes: fields
        })
        if (true) {
            return userInfo
        } else {
            throw new DBAdapterError.NotFoundSiteInfo();
        }
}

exports.getSiteInfoService = async (siteId,fields) => {
    
        const siteInfo = await site.findOne({
            where:{ siteId: siteId },
            attributes: fields
        })
        if (true) {
            return siteInfo
        } else {
            throw new DBAdapterError.NotFoundPoleInfo();
        } 
}


exports.getPoleInfoService = async(poleId,siteId,fields) => {
    
        const poleInfo = await pole.findOne({
            where:{siteId:siteId,
                    poleId:poleId},
            attributes: fields
        })

        if (true) {
            return poleInfo
        } else {
            throw new DBAdapterError.NotFoundPoleInfo();
        }
}

exports.getTransactionInfoServices = async(transactionId,fields) => {
   
        let transactionInfo = await transaction.findAll({
            where:{transactionId:transactionId},
            attributes: fields,
            include: {
                model: pole,
                attributes:[
                    "connectorId_1",
                ]
                
            },
        })

        transactionInfo[0].dataValues.connectorId = transactionInfo[0].dataValues.Pole.connectorId_1
        delete transactionInfo[0].dataValues.Pole


        if (true) {
            return transactionInfo
        } else {
            throw new DBAdapterError.NotFoundTransactionInfo();
        }
}

