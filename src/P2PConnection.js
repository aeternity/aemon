import net from 'net'
import EventEmitter from 'events'
import PingMessage from './Messages/PingMessage.js'
import ResponseMessage from './Messages/ResponseMessage.js'
import CloseMessage from './Messages/CloseMessage.js'
import GetNodeInfoMessage from './Messages/GetNodeInfoMessage.js'
import NodeInfoMessage from './Messages/NodeInfoMessage.js'

export default class P2PConnection extends EventEmitter {
    constructor(direction, network, transportFactory, peer, socket) {
        super()

        this.direction = direction
        this.network = network
        this.transportFactory = transportFactory
        this.peer = peer
        this.socket = socket
        this.stream = this.socket

        this.socket.on('error', this.onError.bind(this))
        this.socket.on('close', this.onClose.bind(this))   
        this.socket.on('end', this.onEnd.bind(this))
    }

    setTimeout(milliseconds) {
        const socket = this.stream
        const timeoutHandler = () => this.onTimeout(socket, this.peer)

        socket.setTimeout(milliseconds, timeoutHandler)
        socket.once('connect', () => socket.setTimeout(0, timeoutHandler))
    }

    encrypt(remoteKey = null) {
        this.stream = this.transportFactory.create(this.socket, remoteKey)
        this.stream.on('data', this.onData.bind(this))
        this.stream.on('handshake', this.onHandshake.bind(this))
        this.stream.on('error', (error) => {
            this.stream.end()
            this.emit('error', error)
        })
    }

    connect(port, host) {
        this.socket.connect(port, host)
    }

    disconnect() {
        clearInterval(this.pingTimer)

        this.stream.end(new CloseMessage())
        this.emit('disconnect')
    }

    send(message) {
        this.stream.write(message)
        this.emit('sent', message)
    }

    onTimeout(socket, peer) {
        const error = new Error(`connect ECONNTIMEOUT ${peer.host}:${peer.port}`)
        error.code = 'ECONNTIMEOUT'
        error.address = peer.host
        error.port = peer.port
        socket.destroy(error)
    }

    onError(error) {
        this.peer.connected = false
        this.emit('error', error)
    }

    onEnd() {
        this.peer.connected = false
        this.emit('end')
    }

    onClose(hadError) {
        this.peer.connected = false
        this.emit('close', hadError)
    }

    onHandshake(remotePublicKey) {
        this.peer.connected = true
        this.emit('connect')
    }

    onData(message) {
        this.emit('received', message)

        if (message instanceof ResponseMessage) {
            return this.handleResponse(message)
        }

        if (message instanceof CloseMessage) {
            clearInterval(this.pingTimer)
            this.stream.end()
        }

        this.emit(message.name, message)
    }

    handleResponse(response) {
        this.emit('response', response)

        if (!response.success) {
            this.logger.log('warn', 'Invalid response, closing connection', {response})
            this.disconnect()
        }

        if (response.message instanceof PingMessage) {
            this.emit('pong', response.message)
        }

        if (response.message instanceof NodeInfoMessage) {
            this.emit('node_info', response.message)
        }
    }

    // peer/protocol implementation
    ping(localPeer) {
        this.peer.lastPingTime = Date.now()
        this.send(this.createPing(localPeer))
    }

    pong(localPeer) {
        const pong = this.createPing(localPeer)
        const response = new ResponseMessage(true, pong.tag, '', pong)
        this.send(response)
    }

    startPinging(localPeer) {
        this.ping(localPeer)
        this.pingTimer = setInterval(() => {
            this.ping(localPeer)
        }, 10e3)
    }

    handlePings(localPeer) {
        this.on('ping', (ping) => {
            this.pong(localPeer)
        })
    }

    getInfo() {
        this.send(new GetNodeInfoMessage())
    }

    // factory methods
    createPing(localPeer) {
        return new PingMessage({
            port: localPeer.port,
            share: 32n,
            genesisHash: this.network.genesisHash,
            difficulty: this.network.difficulty,
            bestHash: this.network.bestHash,
            syncAllowed: false,
            peers: this.network.peers.slice(0, 32) //32 random sample ?
        })
    }
}
