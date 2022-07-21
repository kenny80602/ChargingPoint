import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/Authorize.json'
import responseSchema from '../../ocpp-1.6-schemas/AuthorizeResponse.json'

export const STATUS_ACCEPTED = 'Accepted'
export const STATUS_BLOCKED = 'Blocked'
export const STATUS_EXPIRED = 'Expired'
export const STATUS_INVALID = 'Invalid'
export const STATUS_CONCURRENTTX = 'ConcurrentTx'

export class Authorize extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
