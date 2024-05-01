const { CronJob } = require('cron');
const { updateSeedServersList } = require('./ServerUtils');
const { SEED_SERVERS, PROFILE, CURRENT_SERVER } = require('../config');
const { log, LogsColours } = require('../colours');
const { getCurrentDate } = require('../utils');

// param serring is an object
const cronejob_update_seed_servers_list = () => {
    let run = 1
    new CronJob(
        '*/8 * * * * *', // evey 5 seconds
        function () {
            log(`Crone Jon: Updating Seed Servers list [started]. Run loop: # ${run}`);
            updateSeedServersList()
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