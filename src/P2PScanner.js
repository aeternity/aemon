import EventEmitter from 'events'
import P2PClient from './P2PClient.js'
import P2PServer from './P2PServer.js'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'

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
        this.stats = {
            connections: {
                current: 0,
                handshake: 0,
                disconnect: 0,
                end: 0,
                close: 0,
                total: 0,
            },
            peers: {
                unique: 0,
                total: 0,
            },
            messages: {
                sent: {},
                received: {},
                response: {},
            },
            errors: {}
        }
    }

    printStats() {
        const callback = () => {
            console.log(JSON.stringify(this.stats))

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

        this.stats.connections.current++
        this.stats.connections.total++
        this.stats.peers.unique++

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
        // connection.connect(peer)
        // this.connections.set(peer.publicKey, connection)
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
        this.stats.connections.handshake++
        client.startPinging()
    }

    onConnectionDisconnect(client) {
        this.stats.connections.disconnect++
        // clients.delete(peer.publicKey)
    }

    onConnectionError(client, error) {
        console.log(peerToString(client.peer), `Error: ${error.message}`)
        if (!this.stats.errors.hasOwnProperty(error.code)) {
            this.stats.errors[error.code] = 0
        }

        this.stats.errors[error.code]++
    }

    onConnectionEnd(client) {
        this.stats.connections.end++
        // console.log(peerToString(peer), "Connection end.")
    }

    onConnectionClose(client, hadError) {
        this.stats.connections.current--
        this.stats.connections.close++
        console.log(peerToString(client.peer), "Connection closed. Error: ", Boolean(hadError))
        this.connections.delete(client.peer.publicKey)        
    }

    onConnectionSent(client, message) {
        if (!this.stats.messages.sent.hasOwnProperty(message.name)) {
            this.stats.messages.sent[message.name] = 0
        }

        this.stats.messages.sent[message.name]++
    }

    onConnectionReceived(client, message) {
        // console.log('RECV: ', client, message)
        if (!this.stats.messages.received.hasOwnProperty(message.name)) {
            this.stats.messages.received[message.name] = 0
        }

        this.stats.messages.received[message.name]++
    }

    onConnectionResponse(client, response) {
        if (!response.success) {
            return
        }

        if (!this.stats.messages.response.hasOwnProperty(response.message.name)) {
            this.stats.messages.response[response.message.name] = 0
        }

        this.stats.messages.response[response.message.name]++
    }

    onConnectionPong(client, pong) {
        // console.log(peerToString(peer), `pong, peers count: ${pong.peers.length}`)
        this.stats.peers.total += pong.peers.length

        // this.network.updatePeers(peer, pong.peers)
        // peer.addPeers(pong.peers)
        this.network.updatePeers(client.peer, pong.peers)
        this.network.difficulty = (this.network.difficulty < pong.difficulty) ? pong.difficulty : this.network.difficulty
        // client.disconnect()
    }
}