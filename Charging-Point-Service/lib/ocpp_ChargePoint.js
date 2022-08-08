import { ChargePoint, Connector, OCPPCommands } from "@pretso/ocpp";
import randomFloat from "random-float";
import * as StatusNotificationConst from "@pretso/ocpp/dist/commands/StatusNotification.js";
import * as RemoteStartTransactionConst from "@pretso/ocpp/dist/commands/RemoteStartTransaction.js";
import * as reserveNowConst from "@pretso/ocpp/dist/commands/ReserveNow.js";
import * as cancelReservationConst from "@pretso/ocpp/dist/commands/CancelReservation.js";
import * as unlockConnectorConst from "@pretso/ocpp/dist/commands/UnlockConnector.js";
import moment from "moment";
export default class PretsoChargePoint {
  constructor() {
    const connector1 = new Connector(1);
    const connector2 = new Connector(2);
    const connector3 = new Connector(3);
    this.instance = new ChargePoint({
      // centralSystemUrl: `ws://localhost:9220/kenny_pole`,`ws://localhost:9220/1`||

      centralSystemUrl: `ws://3.112.46.100:9220/1`,

      connectors: [connector1, connector2, connector3],
    });
    this.meterGen = null;
  }

  async run() {
    await this.instance.connect();

    this.instance.onRequest = async (command) => {
      try {
        switch (true) {
          case command instanceof OCPPCommands.RemoteStartTransaction:
            await this.startTransaction(command);
            return {
              status: RemoteStartTransactionConst.STATUS_ACCEPTED,
            };
          case command instanceof OCPPCommands.RemoteStopTransaction:
            setTimeout(() => this.stopTransaction(command), 1);
            return {
              status: RemoteStartTransactionConst.STATUS_ACCEPTED,
            };
          case command instanceof OCPPCommands.ReserveNow:
            setTimeout(() => this.reserveNow(command), 1);

            return {
              status: reserveNowConst.STATUS_ACCEPTED,
            };
          case command instanceof OCPPCommands.CancelReservation:
            setTimeout(() => this.cancelReservation(command), 1);
            return {
              status: cancelReservationConst.STATUS_ACCEPTED,
            };
          case command instanceof OCPPCommands.UnlockConnector:
            return {
              status: unlockConnectorConst.STATUS_UNLOCKED,
            };
        }
      } catch (error) {
        console.log(error);
      }
    };

    const boot = new OCPPCommands.BootNotification({
      chargePointVendor: "Delta",
      chargeBoxSerialNumber: "SR" + Math.round(Math.random() * 100000),
      chargePointSerialNumber: "123",
      chargePointModel: "DEL-2548",
    });

    console.log("boot.req", boot);
    let boot_res = await this.instance.send(boot);
    //連線後 send boot 的notification ，得到Return 印出來
    console.log("boot.res", boot_res);

    //根據boot Notification 回傳的Interval 定期回報HeartBeat
    let HeartBeatInterval = boot_res.interval;
    console.log("HeartBeatInterval", HeartBeatInterval);

    const Heartbeat_req = new OCPPCommands.Heartbeat({});
    setInterval(async () => {
      let heart_log = await this.instance.send(Heartbeat_req);
      console.log("HeartBeat", heart_log.currentTime);
    }, HeartBeatInterval * 1000);

    try {
      let send_currentStatus = await this.instance.sendCurrentStatus();
      console.log("send_currentStatus", send_currentStatus);
    } catch (error) {
      console.log("error", error);
    }
  }

  async startTransaction({ connectorId, idTag }) {
    const authCommand = new OCPPCommands.Authorize({
      idTag,
    });
    console.log("Auth.req :", JSON.stringify(authCommand));

    let auth_log = await this.instance.send(authCommand);
    console.log("auth:", auth_log);
    const statusCommand = new OCPPCommands.StatusNotification({
      connectorId,
      errorCode: StatusNotificationConst.ERRORCODE_NOERROR,
      status: StatusNotificationConst.STATUS_CHARGING,
    });

    let status_log = await this.instance.send(statusCommand);
    console.log("status_command:", statusCommand);
    console.log("status:", status_log);
    //建立CMD物件，再去判斷有無reservationId 沒有的話就不傳
    const connector = this.instance.options.connectors.find((element) => element.connectorId === connectorId);
    const reservationId = connector.reservationId;
    let StartTransactionCMD = {
      connectorId,
      idTag,
      meterStart: 1,
      timestamp: new Date().toISOString(),
    };
    if (reservationId) {
      StartTransactionCMD.reservationId = reservationId;
    }
    const startCommand = new OCPPCommands.StartTransaction(StartTransactionCMD);
    console.log("start_transaction:", startCommand);
    let start_transaction = await this.instance.send(startCommand);
    //得到Start Transaction 的Confirm後
    //塞transaction資訊給coonector info，讓收到stop transation時可以透過transactionId去找到對應的Connector
    connector.transaction = {
      connectorId,
      idTag,
      transactionId: start_transaction.transactionId,
    };

    console.log("start_transaction:", start_transaction);
    this.meterGen = setInterval(async () => {
      // console.log('start_transaction:', start_transaction, randomFloat(7, 12))。
      const meterCommand = new OCPPCommands.MeterValues({
        connectorId,
        transactionId: start_transaction.transactionId,
        meterValue: [
          {
            timestamp: moment().format("YYYY-MM-DDTHH:mm:ss"),
            sampledValue: [
              {
                value: randomFloat(7, 12).toFixed(2).toString(),
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "Current.Import",
                phase: "L3-N",
                location: "Outlet",
                unit: "A",
              },
              {
                value: randomFloat(40, 70).toFixed(0).toString(),
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "Energy.Active.Import.Register",
                phase: "L3-N",
                location: "Outlet",
                unit: "kWh",
              },
              {
                value: randomFloat(0.01, 0.05).toString(),
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "Energy.Active.Import.Interval",
                phase: "L3-N",
                location: "Outlet",
                unit: "kWh",
              },
              {
                value: randomFloat(1, 5).toString(),
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "Power.Active.Import",
                phase: "L3-N",
                location: "Outlet",
                unit: "kW",
              },
              {
                value: randomFloat(360, 365).toFixed(2).toString(),
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "Voltage",
                phase: "L3-N",
                location: "Outlet",
                unit: "V",
              },
              {
                value: "75",
                context: "Sample.Periodic",
                format: "Raw",
                measurand: "SoC",
                phase: "L3-N",
                location: "EV",
                unit: "Percent",
              },
            ],
          },
        ],
      });
      console.log("Meter Value: ", meterCommand);
      let meterValue = await this.instance.send(meterCommand);
      console.log("Meter Value: ", meterValue);
    }, 10 * 1000);
  }

  async stopTransaction({ transactionId }) {
    //用transaction去connector裡面找connectorId
    let connector = null;
    this.instance.options.connectors.forEach((element) => {
      if (element.transaction) {
        element.transaction.transactionId.toString() === transactionId.toString();
        connector = element;
      }
    });
    const statusCommand = new OCPPCommands.StatusNotification({
      connectorId: connector.transaction.connectorId,
      errorCode: StatusNotificationConst.ERRORCODE_NOERROR,
      status: StatusNotificationConst.STATUS_FINISHING,
    });
    console.log("status_command:", statusCommand);
    let status_log = await this.instance.send(statusCommand);
    console.log("status:", status_log);
    const stopCommand = new OCPPCommands.StopTransaction({
      transactionId,
      meterStop: 1,
      timestamp: new Date().toISOString(),
      transactionData: [
        {
          timestamp: moment().format("YYYY-MM-DDTHH:mm:ss"),
          sampledValue: [
            {
              value: randomFloat(7, 12).toFixed(2).toString(),

              context: "Transaction.End",
              format: "Raw",
              measurand: "Current.Import",
              phase: "L3-N",
              location: "Outlet",
              unit: "A",
            },
            {
              value: randomFloat(40, 70).toFixed(0).toString(),

              context: "Transaction.End",
              format: "Raw",
              measurand: "Energy.Active.Import.Register",
              phase: "L3-N",
              location: "Outlet",
              unit: "kWh",
            },
            {
              value: randomFloat(0.01, 0.05).toString(),

              context: "Transaction.End",
              format: "Raw",
              measurand: "Energy.Active.Import.Interval",
              phase: "L3-N",
              location: "Outlet",
              unit: "kWh",
            },
            {
              value: randomFloat(1, 5).toString(),

              context: "Transaction.End",
              format: "Raw",
              measurand: "Power.Active.Import",
              phase: "L3-N",
              location: "Outlet",
              unit: "kW",
            },
            {
              value: randomFloat(360, 365).toFixed(2).toString(),

              context: "Transaction.End",
              format: "Raw",
              measurand: "Voltage",
              phase: "L3-N",
              location: "Outlet",
              unit: "V",
            },
            {
              value: "75",
              context: "Transaction.End",
              format: "Raw",
              measurand: "SoC",
              phase: "L3-N",
              location: "EV",
              unit: "Percent",
            },
          ],
        },
      ],
    });
    console.log("stop_transaction:", stopCommand);
    clearInterval(this.meterGen);
    let stop_transaction = await this.instance.send(stopCommand);
    console.log("stop_transaction:", stop_transaction);
  }

  async toggleStatus(connectorId, status) {
    const statusCommand = new OCPPCommands.StatusNotification({
      connectorId: connectorId,
      errorCode: StatusNotificationConst.ERRORCODE_NOERROR,
      status: status,
    });

    let status_log = await this.instance.send(statusCommand);
    console.log("status notification", status_log);
  }

  async reserveNow(command) {
    let cp = this.instance;
    let connector = cp.options.connectors.find((element) => element.connectorId === command.connectorId);
    console.log("ReserveNow.req", command);

    connector.reservationId = command.reservationId;
    // command.expiryDate 沒寫 ，太麻煩 目前前端也用不到
    console.log("after ReserveNow", cp.options.connectors);
    await this.toggleStatus(command.connectorId, StatusNotificationConst.STATUS_RESERVED);
  }

  async cancelReservation(command) {
    let cp = this.instance;
    let connector = cp.options.connectors.find((element) => element.reservationId === command.reservationId);
    // command.expiryDate 沒寫 ，太麻煩 目前前端也用不到
    // console.log('ReserveNow', connector.connectorId, connector.reservationId)
    delete connector.reservationId;
    console.log("after cancelReserve ", cp.options.connectors);
    await this.toggleStatus(connector.connectorId, StatusNotificationConst.STATUS_AVAILABLE);
  }
}
