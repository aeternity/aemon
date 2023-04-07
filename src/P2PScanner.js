import EventEmitter from 'events'
import geoip from 'geoip-lite'
import P2PClient from './P2PClient.js'
import P2PServer from './P2PServer.js'
import P2PNoiseTransportFactory from './P2PNoiseTransportFactory.js'
import InMemoryMetrics from './Metrics/InMemoryMetrics.js'
import PrometheusMetrics from './Metrics/PrometheusMetrics.js'

const peerToString = (peer) => {
    return `${peer.publicKey}@${peer.host}:${peer.port}`
}

export default class P2PScanner extends EventEmitter {
    constructor(network, localPeer, metrics) {
        super()

        this.network = network
        this.localPeer = localPeer
        this.metrics = metrics
        this.connections = new Map()
        this.server = new P2PServer(network, localPeer)
    }

    scan(serverPort, serverHost) {
        this.metrics.inc('connections', {}, 0)
        this.metrics.set('network_peers', {}, this.network.peers.length)

        this.network.on('peer.new', this.onNetworkPeer.bind(this))
        this.network.peers.map(this.connectToPeer.bind(this))

        const listenPort = serverPort || this.localPeer.port
        const listenHost = serverHost || this.localPeer.host

        this.server.listen(listenPort, listenHost)
    }

    stop() {
        this.server.close()
        this.emit('stop')
    }

    setPeerStatus(peer, status) {
        this.metrics.set('peer_status', {
            host: peer.host,
            port: peer.port,
            publicKey: peer.publicKey,
            lat: peer.lat,
            lon: peer.lon,
        }, status)
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

        client.connection.on('connect', connectionHandler(this.onConnectionConnect))
        client.connection.on('disconnect', connectionHandler(this.onConnectionDisconnect))
        client.connection.on('error', connectionHandler(this.onConnectionError))
        client.connection.on('end', connectionHandler(this.onConnectionEnd))
        client.connection.on('close', connectionHandler(this.onConnectionClose))

        client.connection.on('sent', connectionHandler(this.onConnectionSent))
        client.connection.on('received', connectionHandler(this.onConnectionReceived))

        client.connection.on('response', connectionHandler(this.onConnectionResponse))
        client.connection.on('ping', connectionHandler(this.onConnectionPing))
        client.connection.on('pong', connectionHandler(this.onConnectionPong))
        client.connection.on('node_info', connectionHandler(this.onConnectionNodeInfo))

        this.emit('connection', client.connection)

        client.connect()
    }

    onNetworkPeer(peer) {
        // console.log('NEW PEER: ', peerToString(peer))
        if (peer.publicKey === this.localPeer.publicKey) {
            console.log("THAT's ME, SKIP CONNECT")
            return
        }

        const geo = geoip.lookup(peer.host)
        if (geo !== null) {
            peer.lat = Number(geo.ll[0])
            peer.lon = Number(geo.ll[1])
        }

        this.metrics.inc('network_peers')
        this.connectToPeer(peer)
    }

    onConnectionConnect(client) {
        this.metrics.inc('connections_total', {status: "connect"})
        this.setPeerStatus(client.peer, 1)
        client.startPinging()
    }

    onConnectionDisconnect(client) {
        this.metrics.inc('connections_total', {status: "disconnect"})
        // clients.delete(peer.publicKey)
    }

    onConnectionError(client, error) {
        console.log(peerToString(client.peer), `Error: ${error.message}`)

        this.metrics.inc('connections_total', {status: "error"})
        this.metrics.inc('connection_errors_total', {code: error.code})
        this.setPeerStatus(client.peer, 0)
    }

    onConnectionEnd(client) {
        this.metrics.inc('connections_total', {status: "end"})
        // console.log(peerToString(peer), "Connection end.")
    }

    onConnectionClose(client, hadError) {
        this.metrics.dec('connections')
        this.metrics.inc('connections_total', {status: "close"})
        this.setPeerStatus(client.peer, 0)
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
        this.metrics.inc(
            'responses_total',
            {direction: 'received', type: response.type, errorReason: response.errorReason}
        )
    }

    onConnectionPing(client, ping) {
        console.log(peerToString(client.peer), `ping, peers count: ${ping.peers.length}`)
    }

    onConnectionPong(client, pong) {
        const cntSharedPeers = pong.peers.length
        console.log(peerToString(client.peer), `pong, peers count: ${cntSharedPeers}, share: ${pong.share}`)

        this.network.updatePeers(client.peer, pong.peers)

        if (pong.difficulty > this.network.difficulty) {
            this.network.difficulty = pong.difficulty
            this.network.bestHash = pong.bestHash
            this.metrics.set('network_difficulty', {
                genesisHash: this.network.genesisHash,
            }, Number(this.network.difficulty))
        }

        this.metrics.set('node_peers', {
            publicKey: client.peer.publicKey,
            kind: 'shared',
        }, cntSharedPeers)

        this.metrics.set('peer_difficulty', {
            publicKey: client.peer.publicKey,
            genesisHash: pong.genesisHash,
            // bestHash: pong.bestHash,
            syncAllowed: Number(pong.syncAllowed)
        }, Number(pong.difficulty))

        client.getInfo()

        // client.disconnect()
    }

    onConnectionNodeInfo(client, info) {
        // console.log(peerToString(client.peer), 'NODE INFO:', info)
        const peer = client.peer

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
}
