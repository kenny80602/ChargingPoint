import { parse } from 'uuid';
import * as apiService from '../services/api.service.js'



export const getUserInfo = async(req, res, next) => {
    let output = {status: 0, result: null,errMsgs: null}
    let {fields} = req.query;
    if (typeof fields === 'string')  fields = [fields]
    let userId =parseInt(req.params.userId,10)
    try {
        output.result = await apiService.getUserInfoService(userId,fields)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}

export const siteInfo = async(req, res, next) => {
    let output = {status: 0, result: null,errMsgs: null}
    let {fields} = req.query;
    if (typeof fields === 'string')  fields = [fields]
    let siteId =parseInt(req.params.siteId,10)
    try {
        output.result = await apiService.getSiteInfoService(siteId,fields)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}

export const poleInfo = async(req , res, next) => {
    let output = {status: 0, result: null, errMsgs: null}
    try {
        let {fields} = req.query;
        if(typeof fields === 'string') fields = [fields]
        let poleId = parseInt(req.params.poleId,10)
        let siteId = parseInt(req.params.siteId,10)
        output.result = await apiService.getPoleInfoService(poleId,siteId,fields)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }

}

export const transactionInfo = async(req, res, next) => {
    let output = {status: 0, result: null, errsMgs:null}
    try {
        let{fields} = req.query
        if(typeof fields === 'string') fields = [fields]
        let transactionId = parseInt(req.params.transactionId,10)
        output.result = await apiService.getTransactionInfoServices(transactionId,fields)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}


