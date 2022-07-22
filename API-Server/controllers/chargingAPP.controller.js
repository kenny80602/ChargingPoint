import * as chargingAppService from '../services/chargingAPP.service.js'


//尋找案場座標位置
export const sitesLocationInfo = async (req ,res ,next)  =>{
    let output = {status: 0, result: null, errMsgs: null }
    const {lat, lng, radius} = req.query;
    try {
        output.result = await chargingAppService.getSiteLocation(lat, lng, radius)
        //res.status(200).json(output);
        res.status(200).send(output);
    } catch (e) {
        next(e)
    }
    next()
}

export const getConnectorStatus = async(req, res ,next) =>{
    let output = {status: 0, result: null, errMsgs: null}
    const siteId = req.params.siteId
    try {
        output.result = await chargingAppService.getConnectorStatusServices(siteId);
        
        res.status(200).send(output);
    } catch (e) {
        next(e)
    }
    next()
}

export const getReservation = async(req, res, next) => {
    let output = {status: 0, result: null ,errMsgs: null}
    const transactionId = parseInt(req.params.id,10)
    try {
       output.result = await chargingAppService.getReservationService(transactionId) ;
       res.status(200).json(output);
    } catch (e) {
        next(e)
    }
    next()
}

export const getPoleConnectorStatus = async(req, res, next) => {
    let output = {status: 0, result: null, errMsgs: null}
    const siteId = parseInt(req.params.siteId,10);
    const poleId = parseInt(req.params.poleId,10);
    const connectorId = parseInt(req.params.connectorId,10);
    try {
        output.result = await chargingAppService.getPoleConnectorStatusService(siteId, poleId, connectorId)
        res.status(200).json(output);
    } catch (e) {
        next(e)
    }
    next()
}

export const transactionInfo = async (req, res, next) => {
    let output = { status: 0, result: null, errMsgs:null}
    const transactionId = parseInt(req.params.id,10)
    try {
        output.result = await chargingAppService.transactionInfoService(transactionId)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
    next()
}

export const getSelectConnector = async (req, res, next) => {
    let output = { status: 0, result: null, errMsgs: null}
    const siteId =  parseInt(req.params.siteId,10);
    try {
        output.result = await chargingAppService.getSelectConnectorService(siteId)
        res.status(200).send(output);
    } catch (e) {
        next(e)
    }
   
}


export const addReservation = async (req, res, next) => {
    const { siteId, poleId, connectorId, idTag } = req.body
    let output = {status: 0, result: null ,errMsgs: null}
    try {
        output.result = await chargingAppService.addReservationService(siteId, poleId, connectorId, idTag)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}

export const remoteStartTransaction = async (req ,res, next) => {
    const {poleId, connectorId, idTag, duration, transactionId} = req.body
    let output = {status: 0, result: null, errMsgs: null}
    try {
        output.result = await chargingAppService.remoteStartTransactionService(poleId, connectorId, idTag, duration, transactionId)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}

export const meterValues = async(req, res, next) =>{
    let output = {status: 0, result: null, errMsgs: null}
    const transactionId = parseInt(req.params.transactionId,10) 
    try {
        output.result = await chargingAppService.meterValuesService(transactionId);
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
}

export const remoteStopTransaction = async (req, res, next) => {
    let output = {status: 0, result: null, errMsgs: null}
    const { transactionId, poleId, connectorId } = req.body
    try {
        output.result = await chargingAppService.remoteStopTransactionService(transactionId, poleId, connectorId)
        res.status(200).json(output)
    } catch (e) {
        next(e)
    }
    next()
}
