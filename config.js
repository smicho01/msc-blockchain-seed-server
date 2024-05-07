var ip = require("ip");

const HTTP_PORT = process.env.HTTP_PORT || 3030
const PROFILE = process.env.PROFILE || 'prod'
const APP_IP = ip.address()
let CURRENT_SERVER = process.env.SERVER_IP || APP_IP

/*
* Seed servers for selected profiles
* List should be updated when new server is registered or heartbeat call is failed (remove SS from list)
*/
let SEED_SERVERS = {
    "dev": [
        `http://${APP_IP}:3030`,
        `http://${APP_IP}:3040`
    ],
    "prod": [
        // add here nodes for production env. In the future they can be loaded from config server (GitHub repo)
        `http://13.40.42.210:3030`,
        'http://13.40.4.5:3030'
    ]
}

let BLOCKCHAIN_NODES_API_ENDPOINTS = {
    "dev": [],
    "prod": []
}

function addSeedServer(seedServer, profile) {
    const foundSever = findServerInProfile(seedServer, profile)
    if (foundSever === undefined) {
        console.log(`Updating SEED_SERVERS list for profile ${profile} with new server ${seedServer}`);
        SEED_SERVERS[profile].push(seedServer)
    }
}

function findServerInProfile(seedServer, profile) {
    return SEED_SERVERS[profile].find(server => server === seedServer);
}

function addBlockchainNodeApiEndpoint(apiurl, profile) {
    const foundSever = findBlockchainNodeApiEndpointInProfile(apiurl, profile)
    if (foundSever === undefined) {
        console.log(`Updating BLOCKCHAIN_NODES_API_ENDPOINTS list for profile ${profile} with new server ${apiurl}`);
        BLOCKCHAIN_NODES_API_ENDPOINTS[profile].push(apiurl)
    }
}
function findBlockchainNodeApiEndpointInProfile(apiurl, profile) {
    return BLOCKCHAIN_NODES_API_ENDPOINTS[profile].find(server => server === apiurl);
}

module.exports = { SEED_SERVERS, BLOCKCHAIN_NODES_API_ENDPOINTS, HTTP_PORT, PROFILE, APP_IP, CURRENT_SERVER, 
    addSeedServer, findServerInProfile, addBlockchainNodeApiEndpoint }