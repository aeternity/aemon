import net from 'net'
import EventEmitter from 'events'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import P2PConnection from './P2PConnection.js'
import Peer from './Peer.js'
import Constants from './Messages/Constants.js'
import ResponseMessage from './Messages/ResponseMessage.js'
import PingMessage from './Messages/PingMessage.js'

export default class P2PServer extends EventEmitter {
    constructor(network, localPeer) {
        super()

        this.localPeer = localPeer
        this.network = network
        this.transportFactory = new P2PNoiseTransportFactory(network, 'responder', localPeer.privateKey)
        this.server = new net.Server()

        this.server.on("error", (error) => {
            console.log(`Server Error: ${error.message}`)
        })

        this.server.on('listening', (port) => {
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
        connection.encrypt()

        connection.on('handshake', () => console.log('on handshake'))
        connection.on('pong', () => console.log('on pong'))
        connection.on('disconnect', () => console.log('on disconnect'))
        connection.on('error', (error) => console.log('on error', error))
        connection.on('end', () => console.log('on end'))
        connection.on('close', () => console.log('on close'))

        connection.on('ping', (ping) => {
            const pong = this.createPing()
            const response = new ResponseMessage(true, pong.tag, '', pong)
            connection.send(response)
        })

        this.emit('connection', connection)
    }

    createPing() {
        return new PingMessage({
            port: this.localPeer.port,
            share: 32n,
            genesisHash: this.network.genesisHash,
            difficulty: this.network.difficulty,
            bestHash: this.network.bestHash,
            syncAllowed: false,
            peers: this.network.peers
        })
    }
}
