let CentralSystem = null;

export const init = async (instance) => {
  CentralSystem = instance;
};

export const getHealthzStatus = async () => {
  try {
    return null;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const status = (req, res) => {
  onDigits(req, res)
  CentralSystem.onStatusUpdate = () => onDigits(req, res)
  res.end()
}

export const reserveCharger = async (req , res) => {
  try {
    let siteId = req.params.siteId
    const poleId = req.params.poleId
    const connectorId = parseInt(req.params.connectorId,10)
    const expiryDate = req.body.expiryDate
    const idTag = req.body.idTag

    const now = new Date()
    const reservationId = now.valueOf()

    console.log('poleId :' ,poleId);
    console.log('connectorId :',connectorId);
    console.log('expiryDate :',expiryDate);
    console.log('idTag :',idTag);
    console.log('reservationId :',reservationId);
    const pole = CentralSystem.poles.find((e) => e.poleId === poleId)

    let result = null
    if (pole) {
        result = await CentralSystem.ReserveCharger(pole,siteId, poleId, connectorId, idTag, reservationId, expiryDate)
    } else {
        result = {status:'Rejected', message:'The Pole is not connected.'}
    }
    res.json(result)
  } catch (error) {
    res.json(error);
  }
}

export const RemoteStartTransaction = async (req , res) => {
  try {
    const poleId = req.params.poleId
    const connectorId = parseInt(req.params.connectorId,10)
    const idTag = req.body.idTag
    const duration = req.body.duration
    console.log('poleId :' ,poleId);
    console.log('connectorId :',connectorId);
    console.log('idTag :',idTag);
    const pole = CentralSystem.poles.find((e) => e.poleId === poleId)

    let result = null
    if (pole) {
        result = await CentralSystem.RemoteStartTransaction(pole, poleId, connectorId, idTag, duration)
    } else {
        result = {status:'Disconnect', message:'The Pole is not connected.'}
    }
    if (!result) result = { status: 'Disconnect', message: 'The Pole is not connected.' }
    res.json(result)
  } catch (error) {
    res.json({ status: 'Error', message: error.message });
  }
}


export const RemoteStopTransaction = async (req , res) => {
  try {
    const poleId = req.params.poleId
    const connectorId = parseInt(req.params.connectorId,10)
    const transactionId = req.body.transactionId
    console.log('poleId :' ,poleId);
    console.log('connectorId :',connectorId);
    console.log('transactionId :',transactionId);
    const pole = CentralSystem.poles.find((e) => e.poleId === poleId)
    let result = null
    if (pole) {
        result = await CentralSystem.RemoteStopTransaction(pole,connectorId,transactionId)
    } else {
        result = {status:'Disconnect', message:'The Pole is not connected.'}
    }
    if (!result) result = { status: 'Disconnect', message: 'The Pole is not connected.' }
    res.json(result)
  } catch (error) {
    res.json({ status: 'Error', message: error.message });
  }
}