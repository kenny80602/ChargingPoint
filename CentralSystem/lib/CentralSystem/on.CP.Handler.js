import { OCPPCommands } from './src/index.js';
import * as AuthorizeConst from './src/commands/Authorize.js';
import * as StartTransactionConst from './src/commands/StartTransaction.js';
import OCPPError, { ERROR_NOTIMPLEMENTED } from './src/ocppError.js';
import * as BootNotificationConst from './src/commands/BootNotification.js';
import * as StatusNotificationConst from './src/commands/StatusNotification.js';
import redisClient from '../../cache/index.js';

export default async function (client, command) {
    const connection = client.connection;
    console.info(`New command from ${connection.url}`);
    console.log('Received command:', command)
    let connectorIndex = ""

    switch (true) {

      case command instanceof OCPPCommands.Authorize:
        console.log('CP: Authorize Req ', JSON.stringify(command))
        return {
            idTagInfo: {
                status: AuthorizeConst.STATUS_ACCEPTED
            },
        }
      case command instanceof OCPPCommands.BootNotification:
        console.log('CP :BootNotification req :', JSON.stringify(command));
        client.info = {
          connectors: [],
          ...command
        };
        return {
          status: BootNotificationConst.STATUS_ACCEPTED,
          currentTime: new Date().toISOString(),
          interval: 60
        };
      case command instanceof OCPPCommands.StartTransaction:
        console.log('CP :StartTransaction req :', JSON.stringify(command));
        console.log(client.info.connectors);

        connectorIndex = client.info.connectors.findIndex(
          (item) => item.connectorId === command.connectorId)

        console.log(connectorIndex);
        const connectorId = client.info.connectors[connectorIndex].connectorId
        const transactionId = client.info.connectors[connectorIndex].transactionId
        //duration
        if(true){
          client.info.connectors[connectorIndex].timer = setTimeout(async () => {
            
          }) 
        }

        return {
          transactionId: transactionId,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED
          }
        };
      case command instanceof OCPPCommands.StopTransaction:
        console.log('CP :StopTransaction req :', JSON.stringify(command));
        return {
          transactionId: 1,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED
          }
        };
      case command instanceof OCPPCommands.Heartbeat:
        return {
          currentTime: new Date().toISOString()
        };
      case command instanceof OCPPCommands.StatusNotification:
        // client.info = client.info || {};
        // client.info.connectors = client.info.connectors || [];
        console.log('CP: StatusNotification : ',JSON.stringify(command));
        connectorIndex = client.info.connectors.findIndex(item => command.connectorId === item.connectorId);
        if (connectorIndex === -1) {
          client.info.connectors.push({
            ...command
          });
        } else {
          client.info.connectors[connectorIndex] = {
            ...command,
            ...client.info.connectors[connectorIndex]
          };
        }
      
        return {};
      case command instanceof OCPPCommands.MeterValues: {
          try {
              console.log('CP: MeterValues Req ', JSON.stringify(command))
              let meterList = command.meterValue.pop()
              let meterObj = {}
              for (let meter of meterList.sampledValue) {
                  meterObj[meter.measurand] = meter.value
              }
              const meterReq = {
                  transactionId: command.transactionId,
                  SoC: meterObj['SoC'],
                  voltage: meterObj['Voltage'],
                  current: meterObj['Current.Import'],
                  energy: meterObj['Energy.Active.Import.Register'],
                  power: meterObj['Power.Active.Import'],
              }
              console.log(meterReq);
              //使用redis儲存MeterValues資訊
               await redisClient.hmset(`transaction:${command.transactionId}:info:hash`,meterReq)
               

              return {}
          } catch (error) {
              return {}
          }
      }
      default:
        console.log('unkowned OCPP command', command)
        throw new OCPPError(ERROR_NOTIMPLEMENTED, 'Unknown command');
    }
  };