import net from 'net'
import EventEmitter from 'events'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import P2PConnection from './P2PConnection.js'
import Peer from './Peer.js'
import Constants from './Messages/Constants.js'

export default class P2PServer extends EventEmitter {
    constructor(network, localPeer) {
        super()

        this.localPeer = localPeer
        this.network = network
        this.transportFactory = new P2PNoiseTransportFactory(network, 'responder', localPeer.privateKey)
        this.server = new net.Server()

        this.server.on('error', (error) => {
            this.emit('error', error)
            console.log(`Server Error: ${error.message}`)
        })

        this.server.on('listening', (port) => {
            this.emit('listening', port)
            console.log(`TCP socket server is running:`, this.server.address())
        })

        this.server.on('connection', this.onConnection.bind(this))
    }

    listen(port, host) {        
        // console.log('Local peer:', this.localPeer)
        this.server.listen(port, host)
    }

    close() {
        this.server.close()
    }

    onConnection(socket) {
        // console.log('NEW SERVER SOCKET:', socket)
        const peer = new Peer(socket.remoteAddress, 3015)

        // console.log('NEW CONNECTION: ', peer)

        const connection = new P2PConnection(this.network, this.transportFactory, peer, socket)
        connection.handlePings(this.localPeer)
        connection.encrypt()

        this.emit('connection', connection)
    }
}
