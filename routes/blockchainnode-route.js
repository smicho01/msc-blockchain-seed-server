const express = require('express')
const router = express.Router()

const { BlockchainNodes, SeedServers  } = require('../initializer');
const { broadcastBlockchainNodeToAllProfileSeedServers } = require('../src/ServerUtils');
const { PROFILE } = require('../config');

router.post('/register', (req, res) => {
  
    console.log(`Register SBC node endpoint`);
    const { node } = req.query // /register?node=http://<HOST>:<PORT>
    if(node === '' || node === null || node === undefined) {
        const msg = `Can't register node. Node must be a valid uri`
        console.log(msg)
        return res.status(400).send({message: msg})
    }

    // Check if node already added
    const foundNode = BlockchainNodes.getNode(node)
    if(!foundNode) {
        const result = BlockchainNodes.addNode(node)
        console.log(`All SBC nodes registered with this server: ${BlockchainNodes.getNodes()}`);
        // Broadcast new node registration to all other Seed Servers
        broadcastBlockchainNodeToAllProfileSeedServers(node)
        return res.status(200).send({message: result})
    }
    return res.status(200).send({message: `Register node ${node} : Node ${node} exists`})
})

module.exports = router