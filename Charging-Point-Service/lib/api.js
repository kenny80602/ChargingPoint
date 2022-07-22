import * as StatusNotificationConst from '@pretso/ocpp/dist/commands/StatusNotification.js'
let chargePoint = null;

export const init = (instance) => {
    chargePoint = instance;
}

export const plugged = (req, res) => {
    const connectorId = req.params.connectorId;
    chargePoint.toggleStatus(connectorId, StatusNotificationConst.STATUS_PREPARING);
    res.end();
}

export const unplugged = (req, res) => {
    const connectorId = req.params.connectorId;
    chargePoint.toggleStatus(connectorId, StatusNotificationConst.STATUS_AVAILABLE);
    res.end();
}
