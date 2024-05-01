const { LogsColours, log } = require("../colours");
const { SEED_SERVERS, PROFILE, HTTP_PORT, APP_IP, CURRENT_SERVER } = require("../config");
const fetch = require('cross-fetch');
const { SeedServers } = require("../initializer");

function updateSeedServersList() {
    log(`Updating seed servers list for profile: ${PROFILE} `);
    let someUpdate = 'OLD UPDATE';
    SEED_SERVERS[PROFILE].forEach(server => {
        log(`Fetching seed server: ${server}`);
        // Check server heartbeat signal and if server present, send POST to register server
        try {
            fetch(`${server}/healthcheck`, {
                method: "GET"
            }).then((response) => {
                return response.json()
            }).then(returned => {
                const thsiServer = `http://${CURRENT_SERVER}:${HTTP_PORT}`
                if (returned.message === 'healthy') {
                    log(`Seed server: ${server} heartbeat signal 2check status: ${returned.message}`, LogsColours.BgYellow);
                    if (server !== thsiServer) {
                        fetch(`${server}/seedserver/register?node=${thsiServer}`, {
                            method: "POST"
                        }).then((response) => {
                            return response.json()
                        }).then(returned => {
                            //console.log(returned.message);
                        })
                    }

                } else {
                    log(`Seed server: ${server} heartbeat signal 2check status: ${returned.message}`, LogsColours.BgYellow);
                }
            }).catch(err => {
                log('LIPA !!', LogsColours.BgRed)
                removeServerFromList(server)

            })
        } catch (error) {

        }

    });


}

function broadcastBlockchainNodeToAllProfileSeedServers(node) {
    log(`Broadcasting node ${node} to all seed servers in the profile ${PROFILE}`, LogsColours.BgCyan);
    SEED_SERVERS[PROFILE].forEach(server => {
        if (server !== CURRENT_SERVER) {
            //log(`Broadcasting node: ${node} to seed server: ${server}`, LogsColours.BgGreen)
            fetch(`${server}/blockchainnode/register?node=${node}`, {
                method: "POST"
            }).then((response) => {
                return response.json()
            }).then(returned => {
                // console.log(returned.message);
            })
        }
    });
}

function registerServerWithAllSeedServers(server) {
    log(`Attempt to register server ${server} with all Seed Servers`, LogsColours.BgCyan)

    // Register with servers registered with selected server
    SEED_SERVERS[PROFILE].forEach(s => {
        fetch(`${s}/seedserver/list`, {
            method: "GET"
        }).then((response) => {
            return response.json()
        }).then(returned => {
            const listOfServersRegisteredWithGivenServer = returned;
            returned.forEach(retunredServer => {
                if (retunredServer !== server) { // register only with other servers than itself
                    fetch(`${retunredServer}/seedserver/register?node=${server}`, {
                        method: "POST"
                    }).then((response) => {
                        return response.json()
                    })
                }
            })
        })

        // Now register with the main server
        if (s !== server) { // register only with other servers than itself
            fetch(`${s}/seedserver/register?node=${server}`, {
                method: "POST"
            }).then((response) => {
                return response.json()
            }).then(returned => {
                log(`Status: ${server} ${returned.message.status} with ${s}`,
                    LogsColours.BgGreen)
            })
        }

    });
}

function removeServerFromList(server) {
    log(`Removing server ${server} from Seed Servers list`, LogsColours.BgRed)

    const index = SEED_SERVERS[PROFILE].indexOf(server);
    if (index > -1) { // only splice array when item is found
        SEED_SERVERS[PROFILE].splice(index, 1); // 2nd parameter means remove one item only
    }
    SeedServers.removeNode(server)
    log(`Updated Seed Servers list: ${SEED_SERVERS[PROFILE]}`, LogsColours.FgGreen)
}

module.exports = {
    updateSeedServersList, broadcastBlockchainNodeToAllProfileSeedServers,
    removeServerFromList, registerServerWithAllSeedServers
}