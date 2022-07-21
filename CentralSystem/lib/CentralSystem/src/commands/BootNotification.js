import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/BootNotification.json'
import responseSchema from '../../ocpp-1.6-schemas/BootNotificationResponse.json'

export const STATUS_ACCEPTED = 'Accepted'
export const STATUS_PENDING = 'Pending'
export const STATUS_REJECTED = 'Rejected'

export class BootNotification extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
