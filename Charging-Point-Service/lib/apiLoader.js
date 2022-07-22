import * as apis from './api.js';

export const load = (app, chargePoint) => {

    apis.init(chargePoint);

    app.post('/plugged/:connectorId', apis.plugged);
    app.post('/unplugged/:connectorId', apis.unplugged);
}