import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/UpdateFirmware.json'
import responseSchema from '../../ocpp-1.6-schemas/UpdateFirmwareResponse.json'

export class UpdateFirmware extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
