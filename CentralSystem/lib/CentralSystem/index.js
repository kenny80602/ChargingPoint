import { CentralSystem } from "./src/index.js";
import * as StatusNotification from "./src/commands/StatusNotification.js";
import { OCPPCommands } from "./src/index.js";
import * as AuthorizeConst from "./src/commands/Authorize.js";
import * as StartTransactionConst from "./src/commands/StartTransaction.js";
import OCPPError, { ERROR_NOTIMPLEMENTED } from "./src/ocppError.js";
import * as BootNotificationConst from "./src/commands/BootNotification.js";
import * as StatusNotificationConst from "./src/commands/StatusNotification.js";
import { Transaction as transaction } from '../mysql/model/transaction.js'
import redisClient from "../../cache/index.js";
import moment from 'moment-timezone'
// import emitCPHandler from './emit.CP.Handler.js'
// import onCPHandler from './on.CP.Handler.js'

export function createServer(server) {
  const cSystem = new CentralSystem({
    validateConnection,
    wsOptions: { server },
  });

  cSystem.listen(null);
  cSystem.onStatusUpdate = async function () { };

  //
  cSystem.onRequest = async function (client, command) {
    const connection = client.connection;
    console.info(`New command from ${connection.url}`);
    console.log("Received command:", command);
    let connectorIndex = "";

    switch (true) {
      case command instanceof OCPPCommands.Authorize:
        console.log("CP: Authorize Req ", JSON.stringify(command));
        return {
          idTagInfo: {
            status: AuthorizeConst.STATUS_ACCEPTED,
          },
        };
      case command instanceof OCPPCommands.BootNotification:
        console.log("CP :BootNotification req :", JSON.stringify(command));
        client.info = {
          connectors: [],
          ...command,
        };
        return {
          status: BootNotificationConst.STATUS_ACCEPTED,
          currentTime: new Date().toISOString(),
          interval: 60,
        };
      case command instanceof OCPPCommands.StartTransaction:
        console.log("CP :StartTransaction req :", JSON.stringify(command));
        console.log(client.info.connectors);

        connectorIndex = client.info.connectors.findIndex(
          (item) => item.connectorId === command.connectorId
        );

        console.log(connectorIndex);
        const connectorId = client.info.connectors[connectorIndex].connectorId;
        const transactionId =
          client.info.connectors[connectorIndex].transactionId;
        const duration = parseInt(
          client.info.connectors[connectorIndex].duration,
          10
        );

        client.info.connectors[connectorIndex].status =
          StatusNotification.STATUS_CHARGING;
        //duration
        if (true) {
          client.info.connectors[connectorIndex].timer = setTimeout(
            async () => {
              let remoteStopResult = await cSystem.RemoteStopTransaction(
                client,
                connectorId,
                transactionId
              );
              console.log("Remote Stop From TS", remoteStopResult);
            },
            1000 * duration
          );
        }

        return {
          transactionId: transactionId,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED,
          },
        };
      case command instanceof OCPPCommands.StopTransaction:
        console.log("CP :StopTransaction req :", JSON.stringify(command));
        return {
          transactionId: 1,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED,
          },
        };
      case command instanceof OCPPCommands.Heartbeat:
        return {
          currentTime: new Date().toISOString(),
        };
      case command instanceof OCPPCommands.StatusNotification:
        // client.info = client.info || {};
        // client.info.connectors = client.info.connectors || [];
        console.log("CP: StatusNotification : ", JSON.stringify(command));
        connectorIndex = client.info.connectors.findIndex(
          (item) => command.connectorId === item.connectorId
        );
        if (connectorIndex === -1) {
          client.info.connectors.push({
            ...command,
          });
        } else {
          client.info.connectors[connectorIndex] = {
            ...command,
            ...client.info.connectors[connectorIndex],
          };
        }

        return {};
      case command instanceof OCPPCommands.MeterValues: {
        try {
          console.log("CP: MeterValues Req ", JSON.stringify(command));
          let meterList = command.meterValue.pop();
          let meterObj = {};
          for (let meter of meterList.sampledValue) {
            meterObj[meter.measurand] = meter.value;
          }
          const meterReq = {
            transactionId: command.transactionId,
            SoC: meterObj["SoC"],
            voltage: meterObj["Voltage"],
            current: meterObj["Current.Import"],
            energy: meterObj["Energy.Active.Import.Register"],
            power: meterObj["Power.Active.Import"],
          };
          console.log(meterReq);
          //使用redis儲存MeterValues資訊
          await redisClient.hmset(
            `transaction:${command.transactionId}:info:hash`,
            meterReq
          );

          return {};
        } catch (error) {
          return {};
        }
      }
      default:
        console.log("unkowned OCPP command", command);
        throw new OCPPError(ERROR_NOTIMPLEMENTED, "Unknown command");
    }
  };

  cSystem.ReserveCharger = async (chargePoint, siteId, poleId, connectorId, idTag, reservationId, expiryDate) => {

    const index = chargePoint.info.connectors.findIndex(
      (e) => e.connectorId === connectorId
    );
    const transactionId = reservationId;
    chargePoint.info.connectors[index].transactionId = transactionId;
    console.log(
      `reserved trasactionId-${index}: ${chargePoint.info.connectors[index].transactionId}`
    );

    //使用redis儲存使用者預約站相關訊息
    const ReserveChargerInfo = {
      siteId: siteId,
      poleId: poleId,
      connectorId: connectorId,
      idTag: idTag
    };

    await redisClient.hmset(
      `transaction:${transactionId}:info:hash`,
      ReserveChargerInfo
    );


    //使用MYSQL儲存使用者預約站相關訊息
    const ReserveChargerInfo_MYSQL = {
      siteId: parseInt(siteId, 10),
      poleId: parseInt(poleId, 10),
      transactionId: parseInt(transactionId, 10)
    };

    const mysqlInfo = await transaction.create(ReserveChargerInfo_MYSQL)
    console.log("id" + mysqlInfo.siteId);




    let command = new OCPPCommands.ReserveNow({
      connectorId: connectorId,
      idTag: idTag,
      reservationId: reservationId,
      expiryDate: expiryDate,
    });

    console.log("CS: ReserveNOW Req", JSON.stringify(command));
    let res = await chargePoint.connection.send(command);
    console.log("CP: ReserveNOW Conf", JSON.stringify(res));
    return { transactionId: transactionId, status: "SUCCESS" };
  };

  cSystem.RemoteStartTransaction = async (chargePoint, poleId, connectorId, idTag, duration) => {
    let nowDate = moment().toDate();
    const connector = chargePoint.info.connectors.find(
      (item) => connectorId.toString() === item.connectorId.toString()
    );
    connector.duration = duration;
    const transactionId = connector.transactionId;

    //使用redis儲存duration訊息
    const durationInfo = {
      duration: duration,
      startTime: nowDate
    };
    await redisClient.hmset(
      `transaction:${transactionId}:info:hash`,
      durationInfo
    );


    //使用MYSQL儲存使用者預約站相關訊息
    await transaction.update({startTime: nowDate}, {
      where: {
        transactionId: transactionId
      }
    });


    if (!connector) {
      return null;
    }

    if (
      connector.status === StatusNotification.STATUS_PREPARING ||
      connector.status === StatusNotification.STATUS_AVAILABLE ||
      connector.status === StatusNotification.STATUS_RESERVED
    ) {
      let command = new OCPPCommands.RemoteStartTransaction({
        connectorId: connectorId,
        idTag: idTag,
      });
      console.log("CS: RemoteStartTransaction Req", JSON.stringify(command));
      let result = await chargePoint.connection.send(command);
      console.log("CP: RemoteStartTransaction Conf", JSON.stringify(result));
      return result;
    } else {
      console.log("other status");
    }
  };

  cSystem.RemoteStopTransaction = async (chargePoint, connectorId, transactionId) => {

    let connectorIndex = chargePoint.info.connectors.findIndex(
      (item) => item.connectorId.toString() === connectorId.toString()
    );

    console.log(chargePoint.info.connectors[connectorIndex].timer);

    const connector = chargePoint.info.connectors.find(
      (item) => connectorId.toString() === item.connectorId.toString()
    );


    if (chargePoint.info.connectors[connectorIndex].timer !== "undefined")
      clearTimeout(chargePoint.info.connectors[connectorIndex].timer);



    if (!connector) {
      return null;
    }

    if (connector.status === StatusNotification.STATUS_CHARGING) {
      let command = new OCPPCommands.RemoteStopTransaction({
        transactionId: transactionId,
      });
      console.log("CS: RemoteStopTransaction Req", JSON.stringify(command));
      let result = await chargePoint.connection.send(command);
      console.log("CP: RemoteStopTransaction Conf", JSON.stringify(result));


      //從Redis數據取出 METER資料 再將資料儲存到MYSQL
      let transactionInfo = await redisClient.hmget(
        `transaction:${connector.transactionId}:info:hash`,
        "SoC",
        "voltage",
        "current",
        "energy",
        "power"
      );

      transactionInfo = {
        SoC: transactionInfo[0],
        voltage: transactionInfo[1],
        current: transactionInfo[2],
        energy: transactionInfo[3],
        power: transactionInfo[4],
        endTime: moment().toDate()
      }

      await transaction.update(transactionInfo, {
        where: {
          transactionId: connector.transactionId
        }
      });


      return result;
    } else {
      console.log("other status");
    }
  };

  return cSystem

  function validateConnection(url) {
    return true;
  }
}
