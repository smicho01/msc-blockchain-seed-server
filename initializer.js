const Server = require('./server')

// Used to register websockets
const BlockchainNodes = new Server()
BlockchainNodes.setType('node') // Sets default uri type as Blockchain Node and Seed Servers have different uri struct.

// Used to register blockchain nodes API endpoints
const BlockchainEndpoints = new Server()
BlockchainEndpoints.setType('seed') // same type as seed server, it is http:// not ws:// like it is in BlockchainNodes

// Used to register Seed Servers endpoints
const SeedServers = new Server()
SeedServers.setType('seed')

module.exports = { BlockchainNodes, SeedServers, BlockchainEndpoints }