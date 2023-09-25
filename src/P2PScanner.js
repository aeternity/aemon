import EventEmitter from 'events'
import P2PClient from './P2PClient.js'
import P2PServer from './P2PServer.js'
import PeerLocationProvider from './Providers/PeerLocationProvider.js'

export default class P2PScanner extends EventEmitter {
    constructor(network, localPeer, metrics, logger, locationProvider = null) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.metrics = metrics
        this.logger = logger
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
        this.logger.log('info', 'Scanner start', this.options)
        this.resetMetrics()

        this.network.on('peer.new', this.addDiscoveryPeer.bind(this))
        this.network.peers.map(this.addSeedPeer.bind(this))

        if (this.options.enableServer) {
            this.startServer(serverPort, serverHost)
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

        this.server.on('error', (error) => {
            this.logger.log('error', `Server error: ${error.message}`)
        })

        this.server.on('listening', (port) => {
            this.logger.log('warn', `TCP socket server is listening on port ${port}`)
        })

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
            this.logger.log('verbose', 'Won\'t connect to myself', {peer: peer.url})
            return
        }

        if (this.connections.outbound.has(peer.publicKey)) {
            this.logger.log('verbose', 'Already connected to peer, skipping.', {peer: peer.url})
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

        return this.addPeer(peer)
    }

    addDiscoveryPeer(peer) {
        if (this.options.connectOnDiscovery) {
            return this.addPeer(peer, this.connectToPeer.bind(this))
        }

        return this.addPeer(peer)
    }

    addPeer(peer, cb = () => {}) {
        this.logger.log('verbose', 'Added peer', {peer: peer.url})
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
        this.metrics.inc('connections_total', {direction: connection.direction, status: 'connect'})
        this.setPeerStatus(connection.peer, 1)
    }

    // event handlers
    onServerConnection(connection) {
        this.logger.log('verbose', 'Inbound peer connected', {peer: connection.peer.url})

        this.addConnection(connection)
        this.markConnected(connection)
    }

    onConnectionConnect(connection) {
        this.logger.log('verbose', 'Outbound peer connected', {peer: connection.peer.url})

        this.markConnected(connection)
    }

    onConnectionDisconnect(connection) {
        this.metrics.inc('connections_total', {direction: connection.direction, status: 'disconnect'})
    }

    onConnectionError(connection, error) {
        this.logger.log('verbose', `Peer connection error: ${error.message}`, {peer: connection.peer.url})

        this.metrics.inc('connections_total', {direction: connection.direction, status: 'error'})
        this.metrics.inc('connection_errors_total', {direction: connection.direction, code: error.code})
        this.setPeerStatus(connection.peer, 0)
    }

    onConnectionEnd(connection) {
        // this.logger.log('debug', "Connection end.", {peer: connection.peer.url})
        this.metrics.inc('connections_total', {direction: connection.direction, status: 'end'})
    }

    onConnectionClose(connection, hadError) {
        this.logger.log('verbose', 'Peer connection closed. Error: ' + Boolean(hadError), {peer: connection.peer.url})

        this.metrics.inc('connections_total', {direction: connection.direction, status: 'close'})
        this.setPeerStatus(connection.peer, 0)
        this.removeConnection(connection)
    }

    onConnectionSent(connection, message) {
        this.metrics.inc('messages_total', {direction: 'sent', type: message.name})
        this.logger.log('debug', 'P2P sent', {peer: connection.peer.url, msg: message})
    }

    onConnectionReceived(connection, message) {
        this.metrics.inc('messages_total', {direction: 'received', type: message.name})
        this.logger.log('debug', 'P2P received', {peer: connection.peer.url, msg: message})
    }

    onConnectionResponse(connection, response) {
        this.metrics.inc(
            'responses_total',
            {direction: 'received', type: response.type, errorReason: response.errorReason}
        )

        this.logger.log('debug', 'P2P response', {peer: connection.peer.url, response})

        if (!response.success) {
            this.logger.log(
                'warn',
                `Error response "${response.errorReason}". Closing connection.`,
                {peer: connection.peer.url}
            )
            connection.disconnect()
        }
    }

    onConnectionPing(connection, _ping) {
        this.logger.log('verbose', 'Ping request', {peer: connection.peer.url})
    }

    onConnectionPong(connection, pong, info) {
        const {peer} = connection
        const {responseTime, throughput} = info
        const cntSharedPeers = pong.peers.length

        this.logger.log('verbose', 'Ping response', {peer: peer.url})
        this.network.updatePeer(peer, pong.port, pong.peers)

        if (pong.difficulty > this.network.difficulty) {
            this.network.difficulty = pong.difficulty
            this.network.bestHash = pong.bestHash
            this.metrics.set('network_difficulty', {
                genesisHash: this.network.genesisHash,
            }, this.network.difficulty)
        }

        this.metrics.set('node_peers', {
            publicKey: peer.publicKey,
            kind: 'shared',
        }, cntSharedPeers)

        this.metrics.set('peer_difficulty', {
            publicKey: peer.publicKey,
            genesisHash: pong.genesisHash,
            syncAllowed: Number(pong.syncAllowed)
        }, pong.difficulty)

        this.metrics.observe('peer_latency_seconds', {publicKey: peer.publicKey}, responseTime)
        this.metrics.observe('peer_throughput_bytes', {publicKey: peer.publicKey}, throughput)

        connection.getInfo()

        // client.disconnect()
    }

    onConnectionNodeInfo(connection, info) {
        this.logger.log('verbose', 'Info response', {peer: connection.peer.url})
        const {peer} = connection

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

    onConnectionKeyBlock(connection, {keyBlock}) {
        const latency = (Date.now() - Number(keyBlock.time)) / 1000

        if (keyBlock.height > this.network.height) {
            this.network.height = keyBlock.height
            this.metrics.set('network_height', {}, this.network.height)
        }

        this.metrics.observe('block_latency_seconds', {'type': 'key'}, latency)

        this.metrics.set('miner_version', {
            beneficiary: keyBlock.beneficiary,
        }, keyBlock.info)
    }

    onConnectionMicroBlock(connection, {microBlock}) {
        const latency = (Date.now() - Number(microBlock.header.time)) / 1000

        this.metrics.observe('block_latency_seconds', {'type': 'micro'}, latency)
    }
}
