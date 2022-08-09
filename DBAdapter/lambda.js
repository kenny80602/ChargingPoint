const serverlessExpress = require('@vendia/serverless-express')
const app = require('./server.js')
const connect  = require('./mysql/connection.js')
let connection = null
async function handler(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false
  if (connection === null) connection = await connect.authenticate()
  return serverlessExpress({ app, resolutionMode: 'CALLBACK' })(event, context, callback)
}
module.exports = {
  handler
}