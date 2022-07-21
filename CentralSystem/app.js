import http from 'http'
import express from 'express'
import cors from 'cors'
import moment from 'moment-timezone'
import * as CentralSystemfrom from './lib/CentralSystem/index.js'
import router from './routes/index.js'
import errorHandler from './middleware/errorHandler.js'
import * as APIService from './services/index.js'

moment.tz.setDefault('Asia/Taipei')

let nowDate = moment().toDate();
console.log(nowDate);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
})

process.on('unhandledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

const app = express()

app.use(cors())
app.use(express.json()) // to support JS7ON-encoded bodies
app.use(
    express.urlencoded({
        // to support URL-encoded bodies
        extended: true,
    })
)

// central system server init
var server = http.createServer(app)
const centralSystem = CentralSystemfrom.createServer(server)

//apis init
app.use('/api/v2/', router)
app.use(errorHandler)

//api cs init
APIService.init(centralSystem)

const port = process.env.PORT || 9220

server.listen(port, () => {
    console.log(`Central System listening at http://localhost:${port}`)
})
