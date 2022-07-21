import BaseCommand from './BaseCommand.js'

import requestSchema from '../../ocpp-1.6-schemas/FirmwareStatusNotification.json'
import responseSchema from '../../ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json'

export const STATUS_DOWNLOADED = 'Downloaded'
export const STATUS_DOWNLOADFAILED = 'DownloadFailed'
export const STATUS_DOWNLOADING = 'Downloading'
export const STATUS_IDLE = 'Idle'
export const STATUS_INSTALLATIONFAILED = 'InstallationFailed'
export const STATUS_INSTALLING = 'Installing'
export const STATUS_INSTALLED = 'Installed'

export class FirmwareStatusNotification extends BaseCommand {
    constructor(values) {
        super(requestSchema, responseSchema, values)
    }
}
