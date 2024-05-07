const { log, LogsColours } = require("./colours");

class Server {
    constructor() {
        this.nodes = []
        this.type = 'seed'
    }
    
    addNode(uri) {
        let foundNodes = this.nodes.filter(node => node === uri);
        if(foundNodes.length == 0){
            log(`Adding new Node/Peer to collection. Node: ${uri}`)
            this.nodes.push(uri)
            return {status: 'registered', message: `Node ${uri} registered` }
        }
        let msg = `Node with uri: ${uri} already exists`
        return {status: 'duplicated', message: msg}
    }

    getNodes() {
        return this.nodes
    }

    getNode(node) {
        let foundNode = this.nodes.filter(currentNode => currentNode === node)
        if(foundNode.length > 0){
            return foundNode[0]
        }
        return null
    }

    removeNode(uri) {
        this.nodes = this.nodes.filter(node => node != uri)
    }

    getRandomNode() {
        return this.nodes[Math.floor(Math.random() * this.nodes.length)]
    }

    setType(type) {
        this.type = type
    }
}

module.exports = Server