import net from 'net'
import EventEmitter from 'events'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import P2PConnection from './P2PConnection.js'
import PingMessage from './Messages/PingMessage.js'
import GetNodeInfoMessage from './Messages/GetNodeInfoMessage.js'
import Peer from './Peer.js'

export default class P2PClient extends EventEmitter {
    constructor(network, localPeer, peer) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.peer = peer

        const transportFactory = new P2PNoiseTransportFactory(network, 'initiator', this.localPeer.privateKey)
        const socket = new net.Socket()
        this.connection = new P2PConnection(this.network, transportFactory, this.peer, socket)
    }

    connect() {
        this.connection.setTimeout(5e3)
        this.connection.encrypt(this.peer.publicKey)
        this.connection.connect(this.peer.port, this.peer.host)
    }

    disconnect() {
        this.connection.disconnect()
    }

    ping() {
        this.peer.lastPingTime = Date.now()
        this.connection.send(this.createPing())
    }

    getInfo() {
        this.connection.send(new GetNodeInfoMessage())
    }

    startPinging() {
        this.ping()
        this.pingTimer = setInterval(() => {
            this.ping()
        }, 10e3)
    }

    createPing() {
        return new PingMessage({
            port: this.localPeer.port,
            share: 32n,
            genesisHash: this.network.genesisHash,
            difficulty: this.network.difficulty,
            bestHash: this.network.bestHash,
            syncAllowed: false,
            peers: this.network.peers.slice(0, 32) //32 random sample ?
        })
    }
}
