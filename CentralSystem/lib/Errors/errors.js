import * as ErrorCode from './ErrorCode.js'

export class ChargeCloudError extends Error {
    constructor(message) {
        if (message instanceof Object) {
            super(JSON.stringify(message, null, 4))
        } else {
            super(message)
        }
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequest extends ChargeCloudError {
    grpcStatus = grpc.status.INVALID_ARGUMENT
    statusCode = ErrorCode.BAD_REQUEST

    constructor(message = 'Bad Request.') {
        super(message)
    }
}
