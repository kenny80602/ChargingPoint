import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/Heartbeat.json'
import responseSchema from '../../ocpp-1.6-schemas/HeartbeatResponse.json'

export class Heartbeat extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
