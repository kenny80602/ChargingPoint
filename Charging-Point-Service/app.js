import express from 'express'
import cors from 'cors'
import path from 'path'
import * as apiLoader from './lib/apiLoader.js'
import ChargePoint from './lib/ocpp_ChargePoint.js'

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
})
process.on('unhandledRejection', function (reason, p) {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

const chargePoint = new ChargePoint();
chargePoint.run();

const app = express();

app.use(cors())
app.use(express.json()) // to support JSON-encoded bodies
app.use(
    express.urlencoded({
        // to support URL-encoded bodies
        extended: true, 
    })
)

const __dirname = path.resolve(path.dirname(''))
console.log(__dirname)
app.use('/', express.static(path.join(__dirname, 'public'), { index: 'index.html' })) //set default page

//apis init
apiLoader.load(app, chargePoint)
const port = process.env.PORT || 5100

app.listen(port, () => {
    console.log(`Pretso Charge point listening at http://localhost:${port}`)
})
