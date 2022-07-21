import * as sequelize from '../mysql/connection.js'
// import {User as users} from '../mysql/model/user.js'
import {Site as site} from '../mysql/model/site.js'
import {Pole as pole} from '../mysql/model/pole.js'
import {Transaction as transaction} from '../mysql/model/transaction.js'
import * as DBAdapterError from '../utils/error/errors.js'


export const getUserInfoService = async (userId,fields) => {
    
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

export const getSiteInfoService = async (siteId,fields) => {
    
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


export const getPoleInfoService = async(poleId,siteId,fields) => {
    
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

export const getTransactionInfoServices = async(transactionId,fields) => {
   
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

