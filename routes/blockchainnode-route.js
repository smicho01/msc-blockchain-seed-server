const express = require('express')
const router = express.Router()

const { BlockchainNodes, SeedServers, BlockchainEndpoints  } = require('../initializer');
const { broadcastBlockchainNodeToAllProfileSeedServers } = require('../src/ServerUtils');
const { PROFILE, addBlockchainNodeApiEndpoint } = require('../config');

router.post('/register', (req, res) => {
  
    console.log(`Register SBC node endpoint`);
    const { node, apiurl } = req.query // /register?node=http://<HOST>:<PORT>
   
    if(node === '' || node === null || node === undefined) {
        const msg = `Can't register node. Node must be a valid uri`
        console.log(msg)
        return res.status(400).send({message: msg})
    }

    // Check if node already added
    const foundNode = BlockchainNodes.getNode(node)
    if(!foundNode) {
        const result = BlockchainNodes.addNode(node) // ad websocket address        
        const resultEndpoint = BlockchainEndpoints.addNode(apiurl) // add API endpoint
        if(resultEndpoint.status == 'registered') {
            addBlockchainNodeApiEndpoint(apiurl, PROFILE)
            console.log('Blockchain node API endpoint registered: ',  apiurl)
        }    
        console.log(`All SBC nodes registered with this server: ${BlockchainNodes.getNodes()}`);
        // Broadcast new node registration to all other Seed Servers
        broadcastBlockchainNodeToAllProfileSeedServers(node, apiurl)
        return res.status(200).send({message: result})
    }

    return res.status(200).send({message: `Register node ${node} : Node ${node} exists`})
})

router.get('/getnodes', (req, res) => {
    res.status(200).send(BlockchainEndpoints.getNodes())
})

module.exports = router