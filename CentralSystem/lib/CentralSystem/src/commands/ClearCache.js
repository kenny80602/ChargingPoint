import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/ClearCache.json'
import responseSchema from '../../ocpp-1.6-schemas/ClearCacheResponse.json'

export const STATUS_ACCEPTED = 'Accepted'
export const STATUS_REJECTED = 'Rejected'

export class ClearCache extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
