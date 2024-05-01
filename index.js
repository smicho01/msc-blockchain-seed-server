const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const fetch = require('cross-fetch')
require('dotenv/config')
const seedServersRoutes = require('./routes/seedserver-route')
const { PROFILE, HTTP_PORT, CURRENT_SERVER } = require('./config')
const { log, LogsColours } = require('./colours')


/* Crone Jobs */
const { cronejob_update_seed_servers_list } = require('./src/crone-jobs')

const { BlockchainNodes, SeedServers } = require('./initializer')

const app = express()

app.use(bodyParser.json())

/* ROUTES */
/* BC routes */
const blockchainRoutes = require('./routes/blockchainnode-route')
const { registerServerWithAllSeedServers } = require('./src/ServerUtils')
app.use('/blockchainnode', blockchainRoutes)

/* Seer Servers Routes */

app.use('/seedserver', seedServersRoutes)

/* Healthcheck */
app.get('/healthcheck', (req, res) => {
    res.status(200).send({message: "healthy"})
})

app.listen(HTTP_PORT, () => {
  console.log(`Seed Server running on port: ${HTTP_PORT}`)
  log(`SERVER_IP=${CURRENT_SERVER}`, LogsColours.BgGreen)
  
})

function initialize() {
  registerServerWithAllSeedServers(`http://${CURRENT_SERVER}:${HTTP_PORT}`)
  cronejob_update_seed_servers_list()
  
}

initialize()

process.on('uncaughtException', function (err) {
  log("ERROR: uncaughtException", LogsColours.BgRed)
  console.log(err);
}); 