const express = require('express');
const { SeedServers, BlockchainNodes } = require('../initializer');
const { addSeedServer, SEED_SERVERS } = require('../config');
const { log } = require('../colours');
const router = express.Router()

const PROFILE = process.env.PROFILE || 'prod'

router.post('/register', (req, res) => {
    
    const { node } = req.query
    console.log(`Register seed server endpoint: ${node}`);

    if(node === '' || node === null || node === undefined) {
        const msg = `Can't register node. Node must be a valid uri`
        return res.status(400).send({message: msg})
    }
    
    const result = SeedServers.addNode(node)
    if(result.status === 'registered') {
        //console.log(`Adding new seed server to SEED_SERVERS list`);
        
        addSeedServer(node, PROFILE)
    }
    res.status(200).send({message: result})
})

router.get('/list', (req, res) => {
    console.log(`Get list of all seed nodes`);
    
    res.status(200).send(SeedServers.getNodes())
})

/*
Get all registered SBC nodes
*/
router.get('/bcnodes', (req, res) => {
    console.log(`Get list of all registered SBC nodes`);
    const registeredNodes = BlockchainNodes.getNodes();
    res.status(200).send(registeredNodes)
})


module.exports = router