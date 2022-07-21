import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/DataTransfer.json'
import responseSchema from '../../ocpp-1.6-schemas/DataTransferResponse.json'

export const STATUS_ACCEPTED = 'Accepted'
export const STATUS_REJECTED = 'Rejected'
export const STATUS_UNKNOWNMESSAGEID = 'UnknownMessageId'
export const STATUS_UNKNOWNVENDORID = 'UnknownVendorId'

export class DataTransfer extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
