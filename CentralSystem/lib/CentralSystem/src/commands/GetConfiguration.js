import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/GetConfiguration.json'
import responseSchema from '../../ocpp-1.6-schemas/GetConfigurationResponse.json'

export class GetConfiguration extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
