const { LogsColours, log } = require("../colours");
const { SEED_SERVERS, PROFILE, HTTP_PORT, APP_IP, CURRENT_SERVER, BLOCKCHAIN_NODES_API_ENDPOINTS } = require("../config");
const fetch = require('cross-fetch');
const { SeedServers, BlockchainEndpoints, BlockchainNodes } = require("../initializer");

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
                log("Can't reach seed server", LogsColours.BgRed)
                removeSeedServerFromList(server)

            })
        } catch (error) {

        }

    });

    log(`Registered Blockchain API endpoints: ${BlockchainEndpoints.getNodes()}`)
}

function updateBlockchainNodesEndpointsList() {
    log(`Updating Blockchain nodes list for profile: ${PROFILE} `);
    let someUpdate = 'OLD UPDATE';
    BLOCKCHAIN_NODES_API_ENDPOINTS[PROFILE].forEach(server => {
        log(`Fetching Blockchain node endpoint: ${server}`);
        // Check server heartbeat signal and if server present, send POST to register server
        try {
            fetch(`${server}/node/healthcheck`, {
                method: "GET"
            }).then((response) => {
                return response.json()
            }).then(returned => {
                const thsiServer = `http://${CURRENT_SERVER}:${HTTP_PORT}`
                if (returned.message === 'healthy') {
                   
                } else {
                    log(`Blockchain node: ${server} heartbeat signal 2check status: ${returned.message}`, LogsColours.BgYellow);
                }
            }).catch(err => {
                log("Can't Blockchain node endpoint", LogsColours.BgRed)
                removeBlockchainNodeEndpointFromList(server)
            })
        } catch (error) {

        }

    });

    log(`Registered Blockchain API endpoints: ${BlockchainEndpoints.getNodes()}`)
}

updateBlockchainNodesEndpointsList

function broadcastBlockchainNodeToAllProfileSeedServers(node, nodeApiUrl) {
    log(`Broadcasting node ${node} to all seed servers in the profile ${PROFILE}`, LogsColours.BgCyan);
    SEED_SERVERS[PROFILE].forEach(server => {
        if (server !== CURRENT_SERVER) {
            //log(`Broadcasting node: ${node} to seed server: ${server}`, LogsColours.BgGreen)
            fetch(`${server}/blockchainnode/register?node=${node}&apiurl=${nodeApiUrl}`, {
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

function removeSeedServerFromList(server) {
    log(`Removing server ${server} from Seed Servers list`, LogsColours.BgRed)
    const index = SEED_SERVERS[PROFILE].indexOf(server);
    if (index > -1) { // only splice array when item is found
        SEED_SERVERS[PROFILE].splice(index, 1); // 2nd parameter means remove one item only
    }
    SeedServers.removeNode(server)
    log(`Updated Seed Servers list: ${SEED_SERVERS[PROFILE]}`, LogsColours.FgGreen)
}

function removeBlockchainNodeEndpointFromList(server) {
    log(`Removing Blockchain node endpoint ${server} from list`, LogsColours.BgRed)

    const index = BLOCKCHAIN_NODES_API_ENDPOINTS[PROFILE].indexOf(server);
    if (index > -1) { // only splice array when item is found
        BLOCKCHAIN_NODES_API_ENDPOINTS[PROFILE].splice(index, 1); // 2nd parameter means remove one item only
    }
    BlockchainEndpoints.removeNode(server)
    log(`Updated Blockchain nodes list: ${BLOCKCHAIN_NODES_API_ENDPOINTS[PROFILE]}`, LogsColours.FgGreen)
}

module.exports = {
    updateSeedServersList, updateBlockchainNodesEndpointsList, 
    broadcastBlockchainNodeToAllProfileSeedServers,
    removeSeedServerFromList, registerServerWithAllSeedServers
}