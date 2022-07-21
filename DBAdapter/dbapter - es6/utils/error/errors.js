import * as ErrorCode from './ErrorCode.js'

class dBAdapterError extends Error {
    constructor(message){
        if(message instanceof Object){
            super(JSON.stringify(message, null, 4));
        }else{
            super(message)
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this,this.constructor)
    }
}

export const DBAdapterError = dBAdapterError;

export const  NotFoundGetUserInfo = class NotFoundGetUserInfo extends dBAdapterError{
    httpStatus = 500;
    statusCode = ErrorCode.UserInfo_NotFound
    constructor(message = 'UserInfo_NotFound'){
        super(message)
    }
}
export const  NotFoundSiteInfo = class NotFoundSiteInfo extends dBAdapterError{
    httpStatus = 500;
    statusCode = ErrorCode.SiteInfo_NotFound
    constructor(message = 'SiteInfo_NotFound'){
        super(message)
    }
}

export const  NotFoundPoleInfo = class NotFoundPoleInfo extends dBAdapterError {
    httpStatus = 500;
    statusCode = ErrorCode.PoleInfo_NotFound
    constructor(message = 'PoleInfo_NotFound'){
        super(message)
    }
}
export const  NotFoundTransactionInfo = class NotFoundTransactionInfo extends dBAdapterError{
    httpStatus = 500;
    statusCode = ErrorCode.TransactionInfo_NotFound
    constructor(message = 'TransactionInfo_NotFound'){
        super(message)
    }
}

