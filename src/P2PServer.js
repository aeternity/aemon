import net from 'net'
import crypto from 'crypto'
import EventEmitter from 'events'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import P2PConnection from './P2PConnection.js'
import Peer from './Peer.js'

export default class P2PServer extends EventEmitter {
    constructor(network, localPeer) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.transportFactory = new P2PNoiseTransportFactory(network, 'responder', localPeer.privateKey)
        this.server = new net.Server()

        this.server.on('error', (error) => {
            this.emit('error', error)
        })

        this.server.on('listening', (port) => {
            this.emit('listening', port)
        })

        this.server.on('connection', this.onConnection.bind(this))
    }

    listen(port, host) {
        this.server.listen(port, host)
    }

    close() {
        this.server.close()
    }

    onConnection(socket) {
        this.emit('accept', socket)

        let peer = this.network.peers.find((p) => p.host === socket.remoteAddress)
        if (peer === undefined) {
            const pub = 'rnd_' + crypto.randomBytes(16).toString('hex')
            peer = new Peer(socket.remoteAddress, 3015, {pub})
        }

        const connection = new P2PConnection('inbound', this.network, this.transportFactory, peer, socket)
        connection.handlePings(this.localPeer)
        connection.encrypt()

        this.emit('connection', connection)
    }
}
