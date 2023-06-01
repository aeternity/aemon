import EventEmitter from 'events'
import P2PClient from './P2PClient.js'
import P2PServer from './P2PServer.js'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import InMemoryMetrics from './Metrics/InMemoryMetrics.js'
import PrometheusMetrics from './Metrics/PrometheusMetrics.js'
import PeerLocationProvider from './Providers/PeerLocationProvider.js'

const peerToString = (peer) => {
    return `${peer.publicKey}@${peer.host}:${peer.port}`
}

export default class P2PScanner extends EventEmitter {
    constructor(network, localPeer, metrics, locationProvider = null) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.metrics = metrics
        this.connections = {inbound: new Map(), outbound: new Map()}
        this.server = new P2PServer(network, localPeer)

        this.locationProvider = locationProvider
        if (locationProvider === null) {
            this.locationProvider = new PeerLocationProvider()
        }

        this.options = {
            enableServer: false,
            connectOnDiscovery: true,
            connectOnStart: true,
        }
    }

    setOption(option, value) {
        this.options[option] = value
    }

    start(serverPort, serverHost) {
        console.log('Scanner start with options:', this.options)
        this.resetMetrics()

        this.network.on('peer.new', this.addDiscoveryPeer.bind(this))
        this.network.peers.map(this.addSeedPeer.bind(this))

        if (this.options.enableServer) {
            this.startServer()
        }
    }

    stop() {
        this.server.close()
        this.emit('stop')
    }

    resetMetrics() {
        this.metrics.inc('connections', {direction: 'inbound'}, 0)
        this.metrics.inc('connections', {direction: 'outbound'}, 0)
        this.metrics.set('network_peers', {}, 0)
    }

    startServer(serverPort, serverHost) {
        const listenPort = serverPort || this.localPeer.port
        const listenHost = serverHost || this.localPeer.host

        this.server.on('connection', this.onServerConnection.bind(this))
        this.server.listen(listenPort, listenHost)
    }

    setPeerStatus(peer, status) {
        this.metrics.set('peer_status', {
            host: peer.host,
            port: peer.port,
            publicKey: peer.publicKey,
            lat: peer.lat,
            lon: peer.lon,
            country: peer.country,
            provider: peer.provider,
            owner: peer.owner,
            kind: peer.kind
        }, status)
    }

    connectToPeer(peer) {
        if (peer.publicKey === this.localPeer.publicKey) {
            console.log("THAT's ME, SKIP CONNECT")
            return
        }

        if (this.connections['outbound'].has(peer.publicKey)) {
            console.log(peerToString(peer), 'Already connected to peer, skipping.')
            return
        }

        const client = new P2PClient(this.network, this.localPeer, peer)

        this.addConnection(client.connection)

        client.connect()
    }

    addSeedPeer(peer) {
        if (this.options.connectOnStart) {
            return this.addPeer(peer, this.connectToPeer.bind(this))
        }

        this.addPeer(peer)
    }

    addDiscoveryPeer(peer) {
        if (this.options.connectOnDiscovery) {
            return this.addPeer(peer, this.connectToPeer.bind(this))
        }

        this.addPeer(peer)
    }

    addPeer(peer, cb = () => {}) {
        console.log('ADD PEER: ', peerToString(peer))

        this.metrics.inc('network_peers')
        this.locationProvider.updatePeerLocation(peer, () => cb(peer))
    }

    addConnection(connection) {
        this.connections[connection.direction].set(connection.peer.publicKey, connection)
        this.metrics.inc('connections', {direction: connection.direction})

        const connectionHandler = (handler) => {
            return (...args) => {
                return handler.bind(this)(connection, ...args)
            }
        }

        connection.on('connect', connectionHandler(this.onConnectionConnect))
        connection.on('disconnect', connectionHandler(this.onConnectionDisconnect))
        connection.on('error', connectionHandler(this.onConnectionError))
        connection.on('end', connectionHandler(this.onConnectionEnd))
        connection.on('close', connectionHandler(this.onConnectionClose))

        connection.on('sent', connectionHandler(this.onConnectionSent))
        connection.on('received', connectionHandler(this.onConnectionReceived))

        connection.on('response', connectionHandler(this.onConnectionResponse))
        connection.on('ping', connectionHandler(this.onConnectionPing))
        connection.on('pong', connectionHandler(this.onConnectionPong))
        connection.on('node_info', connectionHandler(this.onConnectionNodeInfo))
        connection.on('key_block', connectionHandler(this.onConnectionKeyBlock))
        connection.on('micro_block', connectionHandler(this.onConnectionMicroBlock))

        this.emit('connection', connection)
    }

    removeConnection(connection) {
        this.metrics.dec('connections', {direction: connection.direction})
        this.connections[connection.direction].delete(connection.peer.publicKey)
    }

    markConnected(connection) {
        this.metrics.inc('connections_total', {direction: connection.direction, status: "connect"})
        this.setPeerStatus(connection.peer, 1)
    }

    // event handlers
    onServerConnection(connection) {
        console.log(peerToString(connection.peer), '- new server connection')

        this.addConnection(connection)
        this.markConnected(connection)
    }

    onConnectionConnect(connection) {
        console.log(peerToString(connection.peer), ' - connected')

        this.markConnected(connection)
    }

    onConnectionDisconnect(connection) {
        this.metrics.inc('connections_total', {direction: connection.direction, status: "disconnect"})
    }

    onConnectionError(connection, error) {
        console.log(peerToString(connection.peer), `Error: ${error.message}`)

        this.metrics.inc('connections_total', {direction: connection.direction, status: "error"})
        this.metrics.inc('connection_errors_total', {direction: connection.direction, code: error.code})
        this.setPeerStatus(connection.peer, 0)
    }

    onConnectionEnd(connection) {
        // console.log(peerToString(connection.peer), "Connection end.")
        this.metrics.inc('connections_total', {direction: connection.direction, status: "end"})
    }

    onConnectionClose(connection, hadError) {
        console.log(peerToString(connection.peer), "Connection closed. Error: ", Boolean(hadError))

        this.metrics.inc('connections_total', {direction: connection.direction, status: "close"})
        this.setPeerStatus(connection.peer, 0)
        this.removeConnection(connection)
    }

    onConnectionSent(connection, message) {
        this.metrics.inc('messages_total', {direction: 'sent', type: message.name})
    }

    onConnectionReceived(connection, message) {
        this.metrics.inc('messages_total', {direction: 'received', type: message.name})
    }

    onConnectionResponse(connection, response) {
        this.metrics.inc(
            'responses_total',
            {direction: 'received', type: response.type, errorReason: response.errorReason}
        )
    }

    onConnectionPing(connection, ping) {
        console.log(peerToString(connection.peer), `ping, peers count: ${ping.peers.length}`)
    }

    onConnectionPong(connection, pong) {
        const peer = connection.peer
        const latency = (Date.now() - peer.lastPingTime) / 1000
        const cntSharedPeers = pong.peers.length
        // console.log(peerToString(peer), `pong, peers count: ${cntSharedPeers}, share: ${pong.share}`)

        this.network.updatePeers(peer, pong.peers)

        if (pong.difficulty > this.network.difficulty) {
            this.network.difficulty = pong.difficulty
            this.network.bestHash = pong.bestHash
            this.metrics.set('network_difficulty', {
                genesisHash: this.network.genesisHash,
            }, Number(this.network.difficulty))
        }

        this.metrics.set('node_peers', {
            publicKey: peer.publicKey,
            kind: 'shared',
        }, cntSharedPeers)

        this.metrics.set('peer_difficulty', {
            publicKey: peer.publicKey,
            genesisHash: pong.genesisHash,
            syncAllowed: Number(pong.syncAllowed)
        }, Number(pong.difficulty))

        this.metrics.observe('peer_latency_seconds', {publicKey: peer.publicKey}, latency)

        connection.getInfo()

        // client.disconnect()
    }

    onConnectionNodeInfo(connection, info) {
        // console.log(peerToString(connection.peer), 'NODE INFO:', info)
        const peer = connection.peer

        this.metrics.set('peer_info', {
            host: peer.host,
            port: peer.port,
            publicKey: peer.publicKey,
            version: info.version,
            revision: info.revision.slice(0, 9),
            vendor: info.vendor,
            os: info.os,
            networkId: info.networkId,
        }, 1)

        this.metrics.set('node_peers', {
            publicKey: peer.publicKey,
            kind: 'verified',
        }, info.verifiedPeers)

        this.metrics.set('node_peers', {
            publicKey: peer.publicKey,
            kind: 'unverified',
        }, info.unverifiedPeers)
    }

    onConnectionKeyBlock(connection, keyBlock) {
        const latency = (Date.now() - Number(keyBlock.time)) / 1000

        if (keyBlock.height > this.network.height) {
            this.network.height = keyBlock.height
            this.metrics.set('network_height', {}, Number(this.network.height))
        }

        this.metrics.observe('block_latency_seconds', {'type': 'key'}, latency)

        this.metrics.set('miner_version', {
            beneficiary: keyBlock.beneficiary,
        }, Number(keyBlock.info))
    }

    onConnectionMicroBlock(connection, microBlock) {
        const latency = (Date.now() - Number(microBlock.time)) / 1000

        this.metrics.observe('block_latency_seconds', {'type': 'micro'}, latency)
    }
}
