import * as ErrorCode from './ErrorCode.js'

class chargeCloudError extends Error {
    constructor(message){
        if(message instanceof Object){
            super(JSON.stringify(message,null,4))
        }else{
            super(message)
        }
        this.name = this.constructor.name
        Error.captureStackTrace(this,this.constructor)
    }
}

export const ChargeCloudError = chargeCloudError;

export const ChargeUnConnected = class ChargerUnConnected extends ChargeCloudError{
    httpStatus = 500;
    statusCode = ErrorCode.CHARGER_UNCONNECTED
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

export const NotFoundSiteLocation = class NotFoundSiteLocation extends ChargeCloudError{
    //grpcStatus = grpc.status.ALREADY_EXISTS
    statusCode = ErrorCode.SiteLocation_NotFound
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

export const NotFoundConnectorStatus = class NotFoundConnectorStatus extends ChargeCloudError{
    //grpcStatus = grpc.status.ALREADY_EXISTS
    statusCode = ErrorCode.ConnectorStatus_NotFound
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

export const NotFoundReservation = class NotFoundReservation extends ChargeCloudError{
    //grpcStatus = grpc.status.ALREADY_EXISTS
    statusCode = ErrorCode.Reservation_NotFound
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

export const NotFoundPoleConnectorStatus = class NotFoundPoleConnectorStatus extends ChargeCloudError{
    //grpcStatus = grpc.status.ALREADY_EXISTS
    statusCode = ErrorCode.PoleConnectorStatus_NotFound
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

export const NotFoundTransactionInfo = class NotFoundTransactionInfo extends ChargeCloudError{
    //grpcStatus = grpc.status.ALREADY_EXISTS
    httpStatus = 211;
    statusCode = ErrorCode.TransactionInfo_NotFound
    constructor(message = 'This Charge Point Is Not Connected'){
        super(message)
    }
}

