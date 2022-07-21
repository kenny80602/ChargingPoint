import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/ChangeConfiguration.json'
import responseSchema from '../../ocpp-1.6-schemas/ChangeConfigurationResponse.json'

export const STATUS_ACCEPTED = 'Accepted'
export const STATUS_REJECTED = 'Rejected'
export const STATUS_REBOOTREQUIRED = 'RebootRequired'
export const STATUS_NOTSUPPORTED = 'NotSupported'

export class ChangeConfiguration extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
