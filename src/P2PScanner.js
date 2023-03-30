import EventEmitter from 'events'
import P2PClient from './P2PClient.js'
import P2PServer from './P2PServer.js'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import InMemoryMetrics from './Metrics/InMemoryMetrics.js'

const peerToString = (peer) => {
    return `${peer.publicKey}@${peer.host}:${peer.port}`
}

export default class P2PScanner extends EventEmitter {
    constructor(network, localPeer) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.connections = new Map()
        this.server = new P2PServer(network, localPeer)
        this.metrics = new InMemoryMetrics()
    }

    printStats() {
        const callback = () => {
            console.log(this.metrics.data)

            if (this.connections.size === 0) {
                this.stop()
            }
        }

        this.printTimer = setInterval(callback.bind(this), 500)
    }

    scan(serverPort, serverHost) {
        this.network.on('peer', this.onNetworkPeer.bind(this))
        this.network.peers.map(this.connectToPeer.bind(this))

        const listenPort = serverPort || this.localPeer.port
        const listenHost = serverHost || this.localPeer.host

        this.server.listen(listenPort, listenHost)
    }

    stop() {
        this.server.close()
        clearInterval(this.printTimer)
        console.log(this.network.toString())
        this.emit('stop')
    }

    connectToPeer(peer) {
        const client = new P2PClient(this.network, this.localPeer, peer)
        // const connection = client.connection

        this.connections.set(peer.publicKey, client.connection)

        this.metrics.inc('connections')

        const connectionHandler = (handler) => {
            return (...args) => {
                return handler.bind(this)(client, ...args)
            }
        }

        client.connection.on('handshake', connectionHandler(this.onConnectionHandshake))
        client.connection.on('pong', connectionHandler(this.onConnectionPong))
        client.connection.on('sent', connectionHandler(this.onConnectionSent))
        client.connection.on('received', connectionHandler(this.onConnectionReceived))
        client.connection.on('response', connectionHandler(this.onConnectionResponse))
        client.connection.on('disconnect', connectionHandler(this.onConnectionDisconnect))
        client.connection.on('error', connectionHandler(this.onConnectionError))
        client.connection.on('end', connectionHandler(this.onConnectionEnd))
        client.connection.on('close', connectionHandler(this.onConnectionClose))

        this.emit('connection', client.connection)

        client.connect()
    }

    onNetworkPeer(peer) {
        // console.log('NEW PEER: ', peerToString(peer))
        if (peer.publicKey === this.localPeer.publicKey) {
            console.log("THAT's ME, SKIP CONNECT")
            return
        }

        this.connectToPeer(peer)
    }

    onConnectionHandshake(client) {
        this.metrics.inc('connections_total', {status: "handshake"})
        client.startPinging()
    }

    onConnectionDisconnect(client) {
        this.metrics.inc('connections_total', {status: "disconnect"})
        // clients.delete(peer.publicKey)
    }

    onConnectionError(client, error) {
        console.log(peerToString(client.peer), `Error: ${error.message}`)

        this.metrics.inc('errors_total', {code: error.code})
    }

    onConnectionEnd(client) {
        this.metrics.inc('connections_total', {status: "end"})
        // console.log(peerToString(peer), "Connection end.")
    }

    onConnectionClose(client, hadError) {
        this.metrics.dec('connections')
        this.metrics.inc('connections_total', {status: "close"})
        console.log(peerToString(client.peer), "Connection closed. Error: ", Boolean(hadError))
        this.connections.delete(client.peer.publicKey)        
    }

    onConnectionSent(client, message) {
        this.metrics.inc('messages_total', {direction: 'sent', type: message.name})
    }

    onConnectionReceived(client, message) {
        this.metrics.inc('messages_total', {direction: 'received', type: message.name})
    }

    onConnectionResponse(client, response) {
        if (!response.success) {
            this.metrics.inc('responses_total', {direction: 'received', type: 'error'})
            return
        }

        this.metrics.inc('responses_total', {direction: 'received', type: response.message.name})
    }

    onConnectionPong(client, pong) {
        // console.log(peerToString(peer), `pong, peers count: ${pong.peers.length}`)
        this.metrics.inc('peers_total', {}, pong.peers.length)

        // this.network.updatePeers(peer, pong.peers)
        // peer.addPeers(pong.peers)
        this.network.updatePeers(client.peer, pong.peers)
        this.network.difficulty = (this.network.difficulty < pong.difficulty) ? pong.difficulty : this.network.difficulty
        // client.disconnect()
    }
}