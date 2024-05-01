const Server = require('./server')

const BlockchainNodes = new Server()
BlockchainNodes.setType('node') // Sets default uri type as Blockchain Node and Seed Servers have different uri struct.
const SeedServers = new Server()
SeedServers.setType('seed')


module.exports = { BlockchainNodes, SeedServers }