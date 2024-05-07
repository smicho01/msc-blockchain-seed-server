const { CronJob } = require('cron');
const { updateSeedServersList, updateBlockchainNodesEndpointsList } = require('./ServerUtils');
const { SEED_SERVERS, PROFILE, CURRENT_SERVER } = require('../config');
const { log, LogsColours } = require('../colours');
const { getCurrentDate } = require('../utils');
const { BlockchainEndpoints } = require('../initializer');

// param serring is an object
const cronejob_update_seed_servers_list = () => {
    let run = 1
    new CronJob(
        '*/3 * * * * *', // evey 5 seconds
        function () {
            log(`Crone Jon: Updating Seed Servers list [started]. Run loop: # ${run}`);
            updateSeedServersList()
            updateBlockchainNodesEndpointsList()
            run++
            log(`Crone job log: Seed servers for profile ${PROFILE} : ${SEED_SERVERS[PROFILE]}`)
            log(`SERVER_IP=${CURRENT_SERVER}`, LogsColours.BgGreen)
        
        }, // onTick
        null, // onComplete
        true, // start
        'Europe/London' // timeZone
    );
}

module.exports = { cronejob_update_seed_servers_list }