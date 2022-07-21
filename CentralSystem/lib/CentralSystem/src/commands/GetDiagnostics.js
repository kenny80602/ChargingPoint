import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/GetDiagnostics.json'
import responseSchema from '../../ocpp-1.6-schemas/GetDiagnosticsResponse.json'

export class GetDiagnostics extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
