import redisClient from '../cache/index.js'
import * as redisKey from '../cache/redis.key.js'
import {CentralSystem,DBAdapter} from '../lib/axiosClient.js'
import * as ChargingCloud_Error from '../utils/error/errors.js'
import * as module from '../module/api.js'



export const getSiteLocation = async (lat, lng, radius) => {

        let output = []
        let siteList = await redisClient.georadius(
            redisKey.Site_Position_Geo(),
            lng,
            lat,
            parseInt(radius,10),
            "km",
            "WITHCOORD"
        );
        const siteIdList = siteList.map((e) => e[0]);
        const multi = redisClient.multi();
        for (const siteId of siteIdList) {
          multi.hgetall(redisKey.Site_Info_Hash(siteId));
        }
        let siteInfoList = await multi.exec();
        siteInfoList.forEach((siteInfo, i) => {
          let total = 0;
          let available = 0;
          let other = 0;
          let Unavailable = 0;
          let status = "offline";
          for (const colum in siteInfo) {
            if (colum.includes("connectorStatus")) {
              total++;
              if (siteInfo[colum] === "Available") available++;
              else if (siteInfo[colum] === "Unavailable") Unavailable++;
              else other++;
            }
          }
          if (available > 0) {
            status = "available"
          } else {
            status = "full"
          }

          output.push({
            siteId: siteList[i][0],
            status: status,
            location: [siteList[i][1][0], siteList[i][1][1]],
          });
        });

            return output;

        


}

export const getConnectorStatusServices = async(siteId) =>{
        
        const poleKeys = await redisClient.keys(`site:${siteId}:pole:*:hash`);
        const multi = redisClient.multi();
        for(const key of poleKeys){
            multi.hmget(key,'connectorNum','siteName','status')
        }
        const poleInfo = await multi.exec();
        poleKeys.forEach((key,i) =>{
            for(let connectId = 1 ; connectId <= parseInt(poleInfo[i][0],10);connectId++){
                multi.hmget(key,`connectorStatus _${connectId}`,'status')
            }
        })
        const polesConnectorInfo = await multi.exec();
        let status = {
            available: 0,
            charging: 0,
            reserved: 0,
            unavailable: 0,
            faulted: 0
        }
        let index = 0;
        poleKeys.forEach((key, i) => {
            for(let connectId = 1; connectId <= parseInt(poleInfo[i][0],10); connectId++){
                if(poleInfo[i][2] === 'unavailable') polesConnectorInfo[index][1] = 'unavailable'
                switch(polesConnectorInfo[index][1]){
                    case 'available':
                        status.available++
                        break
                    case 'unavailable':
                        status.unavailable++
                        break
                    case 'reserved':
                        status.reserved++
                        break
                    case 'faulted':
                        status.faulted++
                        break
                    default:
                        status.charging++
                        break
                }
                index++
            }
        })


            return status;

        
    
        
    
}

export const getReservationService = async(transactionId) => {

    //預約充電樁各資訊 
    let transactionParams = new URLSearchParams();
    transactionParams.append("fields", "siteId");
    transactionParams.append("fields", "poleId");
    transactionParams.append("fields", "connectorId");
    transactionParams.append("fields", "userId");
    let {data: reservation} = await DBAdapter.get(`/api/v1/transaction/${transactionId}`,{params:transactionParams})

            const siteId = parseInt(reservation.result.siteId,10)
            const poleId = parseInt(reservation.result.poleId,10)
            const connectorId = parseInt(reservation.result.connectorId,10)
            const userId = parseInt(reservation.result.userId,10)
    //案場資訊
    let siteParams = new URLSearchParams();
    siteParams.append("fields", "siteName")
    siteParams.append("fields",`connectorPower_${connectorId}`)
    let {data: siteInfo} = await DBAdapter.get(`/api/v1/site/${siteId}/pole/${poleId}`,{params:siteParams})
    const siteName =siteInfo.result.siteName
    const connectorPower = siteInfo.result.connectorPower_1 ||siteInfo.result.connectorPower_2

    //使用者資訊   
    let userParams = new URLSearchParams();
    userParams.append("fields","name")
    userParams.append("fields","vehicleId")
    userParams.append("fields","vehicleModel")
    let {data:userInfo} = await DBAdapter.get(`/api/v1/user/${userId}`,{params:userParams});
    const userName =userInfo.result.name
    const vehicleId = userInfo.result.vehicleId
    const vehicleModel = userInfo.result.vehicleModel
        let reservationInfo ={
            userName: userName,
            vehicleId: vehicleId,
            vehicleId: vehicleId,
            vehicleModel: vehicleModel,
            siteName:siteName,
            connectorPower: connectorPower
        }

                return reservationInfo;

    }




export const getPoleConnectorStatusService = async(siteId, poleId, connectorId) => {
    let connectorParams = new URLSearchParams();
    connectorParams.append("fields",`connectorStatus_${connectorId}`)

    let {data : connectorStatus} = await DBAdapter.get(`/api/v1/site/${siteId}/pole/${poleId}`,{params : connectorParams })
    let connectorStatusInfo = connectorStatus.result.connectorStatus_1 || connectorStatus.result.connectorStatus_2
        

            return {connectorStatusInfo};

}

export const transactionInfoService = async (transactionId) => {


    let connectorParams = new URLSearchParams();
    connectorParams.append("fields",`transactionId`)
    connectorParams.append("fields",`siteId`)
    connectorParams.append("fields",`poleId`)
    connectorParams.append("fields",`startTime`)
    connectorParams.append("fields",`SoC`)
    connectorParams.append("fields",`voltage`)
    connectorParams.append("fields",`current`)
    connectorParams.append("fields",`energy`)
    connectorParams.append("fields",`power`)
    connectorParams.append("fields",`endTime`)

    let {data : connectorStatus} = await DBAdapter.get(`/api/v1/transaction/${transactionId}`,{params : connectorParams })
    let connectorStatusInfo = connectorStatus.result 


            return connectorStatusInfo;

}


export const transactionInfoRedisService = async(transactionId) =>{
    let exist = []
    let transactionInfo =  await redisClient.hmget(
        redisKey.Transaction_Info_Hash(transactionId),
        "SOC",
        "voltage",
        "current",
        "powerConsumption",
        "startTime",
        "endTime",
    )
    for (const num in transactionInfo) {
        if(transactionInfo[num]===null){exist = false}
        }

    if(exist){
        transactionInfo = {
            SOC: transactionInfo[0],
            voltage: transactionInfo[1],
            current: transactionInfo[2],
            powerConsumption: transactionInfo[3],
            startTime: transactionInfo[4],
            endTime: transactionInfo[5]
            
        }
        return transactionInfo;
    }
    var transactionParams = new URLSearchParams();
    transactionParams.append("fields", "SOC");
    transactionParams.append("fields", "voltage");
    transactionParams.append("fields", "current");
    transactionParams.append("fields", "powerConsumption");
    transactionParams.append("fields", "startTime");
    transactionParams.append("fields", "endTime");

    let {data: information} = await DBAdapter.get(`/api/v1//transaction/${transactionId}`,{
        params:transactionParams});
     await redisClient.hmset(
        redisKey.Transaction_Info_Hash(transactionId),
            information.result
        )
        let transactionData = await redisClient.hmget(
            redisKey.Transaction_Info_Hash(transactionId),
            "SOC",
            "voltage",
            "current",
            "powerConsumption",
            "startTime",
            "endTime",
        )
        
            transactionData = {
                SOC: transactionData[0],
                voltage: transactionData[1],
                current: transactionData[2],
                powerConsumption: transactionData[3],
                startTime: transactionData[4],
                endTime: transactionData[5]
                
            }
            return transactionData;


}

export const getSelectConnectorService = async(siteId) =>{

    const poleKeys = await redisClient.keys(`site:${siteId}:pole:*:hash`);
    const multi = redisClient.multi();
    for(const key of poleKeys){
        multi.hmget(key,'connectorNum','siteName','status')
    }

    let totalResult =[]

    
    for (let i = 0; i < poleKeys.length; i++) {

            //解析poleId
            const value = poleKeys[i];
            const parts = value.replace(`site:${siteId}:pole:` ,'' );
            console.log(parts);
            const poleId = parts.replace(`:hash` ,'' );

    //connectorStatus_1 初始化
    let result = {
        poleId : 0,
        connectorStatus_1 : 0
    }

    //connectorStatus_2 初始化
    let result1 = {
        poleId : 0,
        connectorStatus_2 : 0
    }
    
    let index = 0;
    let poleStatus = await redisClient.hmget(`site:${siteId}:pole:${poleId}:hash`,'connectorStatus_1','connectorStatus_2','siteName','status')
            
            //connectorStatus_1
            if(poleStatus[0] === 'unavailable') poleStatus[0] = 'unavailable'
            switch(poleStatus[0]){
                case 'available':
                    result.poleId = poleId
                    result.connectorStatus_1 = 'available'
                    totalResult.push(result)
                    break
                case 'charging':
                    result.poleId = poleId
                    result.connectorStatus_1 = 'charging'
                    totalResult.push(result)
                    break
                case 'reserved':
                    result.poleId = poleId
                    result.connectorStatus_1 = 'reserved'
                    totalResult.push(result)
                    break
                case 'faulted':
                    result.poleId = poleId
                    result.connectorStatus_1 = 'faulted'
                    totalResult.push(result)
                    break
                default:
                    result.poleId = poleId
                    result.connectorStatus_1 = 'unavailable'
                    totalResult.push(result)
                    break
        }


        //connectorStatus_2
        if(poleStatus[1] === 'unavailable') poleStatus[1] = 'unavailable'
        switch(poleStatus[1]){
            case 'available':
                result1.poleId = poleId
                result1.connectorStatus_2 = 'available'
                totalResult.push(result1)
                break
            case 'charging':
                result1.poleId = poleId
                result1.connectorStatus_2 = 'charging'
                totalResult.push(result1)
                break
            case 'reserved':
                result1.poleId = poleId
                result1.connectorStatus_2 = 'reserved'
                totalResult.push(result1)
                break
            case 'faulted':
                result1.poleId = poleId
                result1.connectorStatus_2 = 'faulted'
                totalResult.push(result1)
                break
            default:
                result1.poleId = poleId
                result1.connectorStatus_2 = 'available'
                totalResult.push(result1)
                break
    }

}
    return totalResult
}

export const addReservationService = async(siteId, poleId, connectorId, idTag) => {
    try {
        const connectorStatus = await redisClient.hget(`site:${siteId}:pole:${poleId}:hash`,`connectorStatus_${connectorId}`)
        if(connectorStatus === "available"){
            let {data} = await CentralSystem.post(
                `/api/v2/reserveCharger/${siteId}/${poleId}/${connectorId}`,
                {
                    idTag: idTag,
                    expiryDate:"123"
                }
            )
            console.log(data);
            if (data.status === "SUCCESS") {
                return {
                  status: data.status,
                  transactionId: data.transactionId,
                };

            }   

        }

    } catch (e) {
        throw new Error(e.message);
    }
}

export const remoteStartTransactionService = async (poleId, connectorId, idTag, duration, transactionId) => {
    try {
        let result = await CentralSystem.post(`/api/v2/remoteStartTransaction/${poleId}/${connectorId}`,{
            idTag : idTag,
            duration : duration
        })
        return result.data.result
    } catch (e) {
        throw new Error(e.message)
    }
}

export const meterValuesService = async (transactionId) => {
    try {
        console.log(transactionId);
        let meterValuesInfo = await redisClient.hmget(
            `transaction:${transactionId}:info:hash`,
            "SoC",
            "voltage",
            "current",
            "energy",
            "power"
        )

        meterValuesInfo ={
            SoC : meterValuesInfo[0],
            voltage : meterValuesInfo[1],
            current : meterValuesInfo[2],
            energy : meterValuesInfo[3],
            power : meterValuesInfo[4]
        }
        return meterValuesInfo
    } catch (e) {
        throw new Error(e.message)
    }
}

export const remoteStopTransactionService = async(transactionId, poleId, connectorId) => {
    try {
        let result = await CentralSystem.post(
            `/api/v2/remoteStopTransaction/${poleId}/${connectorId}`,
            {   transactionId: transactionId
        });
    } catch (e) {
        throw new Error(e.message)
    }
}
