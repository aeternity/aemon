import net from 'net'
import EventEmitter from 'events'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import P2PConnection from './P2PConnection.js'
import Peer from './Peer.js'

export default class P2PClient extends EventEmitter {
    constructor(network, localPeer, peer) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.peer = peer

        const transportFactory = new P2PNoiseTransportFactory(network, 'initiator', this.localPeer.privateKey)
        const socket = new net.Socket()
        this.connection = new P2PConnection('outbound', this.network, transportFactory, this.peer, socket)
    }

    connect() {
        this.connection.setTimeout(5e3)
        this.connection.encrypt(this.peer.publicKey)
        this.connection.connect(this.peer.port, this.peer.host)

        this.connection.on('connect', () => {
            this.connection.startPinging(this.localPeer)
        })
    }

    disconnect() {
        this.connection.disconnect()
    }
}
