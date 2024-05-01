const Server = require("./server")


describe('Server', () => {

    let server

    beforeEach(() => {
        server = new Server()
    })

    it('validates empty server list on start', () => {
        expect(server.getNodes().length)
            .toEqual(0)
    })

    it('validates default type as seed', () => {
        expect(server.type)
            .toEqual('seed')
    })

    it('validates type as node', () => {
        server.setType('node')
        expect(server.type)
            .toEqual('node')
    })

    it('validates correct added nodes number', () => {
        server.addNode('node1')
        server.addNode('node2')
        expect(server.getNodes().length)
           .toEqual(2)
    })

    it('validates correct node removal', () => {
        server.addNode('node1')
        server.addNode('node2')
        server.removeNode('node1')
        expect(server.getNodes().length)
           .toEqual(1)
    })

    it('validates correct node name', () => {
        server.addNode('node1')
        server.addNode('node2')
        const findNode = server.getNode('node2')
        expect(findNode)
           .toEqual('node2')
    })

    it('finds the existing node', () => {
        server.addNode('node1')
        server.addNode('node2')
        const findNode = server.getNode('node2')
        expect(findNode)
           .toEqual('node2')
    })

    it('returns null if node not found', () => {
        server.addNode('node1')
        server.addNode('node2')
        const findNode = server.getNode('node3')
        expect(findNode)
           .toEqual(null)
    })

    it('select random node taht exists', () => {
        server.addNode('node1')
        server.addNode('node2')
        const randomNode = server.getRandomNode()
        expect(randomNode === 'node1' || randomNode === 'node2')
           .toBeTruthy()
    })
})