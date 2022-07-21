import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/UnlockConnector.json'
import responseSchema from '../../ocpp-1.6-schemas/UnlockConnectorResponse.json'

export const STATUS_UNLOCKED = 'Unlocked'
export const STATUS_UNLOCKFAILED = 'UnlockFailed'
export const STATUS_NOTSUPPORTED = 'NotSupported'

export class UnlockConnector extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
