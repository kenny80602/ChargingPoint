import * as  StatusNotification from "./src/commands/StatusNotification.js";
import { OCPPCommands } from "./src/index.js";

export default async function (cSystem) {
  //   cSystem.RemoteStartTransaction = async (client, poleId, connectorId, idTag) => {};
  // }



  cSystem.ReserveCharger = async (chargePoint, siteId, poleId, connectorId, idTag, reservationId, expiryDate) => {
    const index = chargePoint.info.connectors.findIndex((e) => e.connectorId === connectorId)
    chargePoint.info.connectors[index].transactionId = reservationId
    console.log(`reserved trasactionId-${index}: ${chargePoint.info.connectors[index].transactionId}`);



    let command = new OCPPCommands.ReserveNow({
      connectorId: connectorId,
      idTag: idTag,
      reservationId: reservationId,
      expiryDate: expiryDate,
    })

    console.log('CS: ReserveNOW Req', JSON.stringify(command));
    let res = await chargePoint.connection.send(command)
    console.log('CP: ReserveNOW Conf', JSON.stringify(res));
    return {
      transactionId: transactionId,
      status: "SUCCESS"
    }
  }



  cSystem.RemoteStartTransaction = async (chargePoint, poleId, connectorId, idTag, duration) => {
    const connector = chargePoint.info.connectors.find((item) => connectorId.toString() === item.connectorId.toString())
    if (!connector) {
      return null
    }

    if (
      connector.status === StatusNotification.STATUS_PREPARING ||
      connector.status === StatusNotification.STATUS_AVAILABLE ||
      connector.status === StatusNotification.STATUS_RESERVED
    ) {
      let command = new OCPPCommands.RemoteStartTransaction({
        connectorId: connectorId,
        idTag: idTag,
      })
      console.log('CS: RemoteStartTransaction Req', JSON.stringify(command));
      let result = await chargePoint.connection.send(command)
      console.log('CP: RemoteStartTransaction Conf', JSON.stringify(result));
      return result
    } else {
      console.log('other status');
    }

  }

  cSystem.RemoteStopTransaction = async (pochargePointle, connectorId, transactionId) => {
    const connector = chargePoint.info.connectors.find((item) => connectorId.toString() === item.connectorId.toString())
    if (!connector) {
      return null
    }

    if (
      connector.status === StatusNotification.STATUS_CHARGING
    ) {
      let command = new OCPPCommands.RemoteStopTransaction({
        transactionId: transactionId,
      })
      console.log('CS: RemoteStopTransaction Req', JSON.stringify(command));
      let result = await chargePoint.connection.send(command)
      console.log('CP: RemoteStopTransaction Conf', JSON.stringify(result));
      return result
    } else {
      console.log('other status');
    }
  }

}

