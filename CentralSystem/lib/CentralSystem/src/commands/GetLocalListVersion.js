import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/GetLocalListVersion.json'
import responseSchema from '../../ocpp-1.6-schemas/GetLocalListVersionResponse.json'

export class GetLocalListVersion extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
