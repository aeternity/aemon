import geoip from 'geoip-lite'
import EventEmitter from 'events'
import Peer from './Peer.js'

export default class P2PNetwork extends EventEmitter {
    #peers = new Map()

    constructor(networkId, genesisHash, peers = []) {
        super()

        this.networkId = networkId
        this.genesisHash = genesisHash
        this.bestHash = genesisHash
        this.difficulty = 0

        peers.map(peer => this.addPeer(Peer.withUrl(peer)))

        this.#peers.forEach(peer => {
            peer.owner = 'aeternity'
            peer.kind = 'seed'
        })
    }

    get peers() {
        return Array.from(this.#peers, ([key, peer]) => peer)
    }

    addPeer(peer) {
        if (!this.#peers.has(peer.publicKey)) {
            peer.ref = 'NETWORK'
            this.updatePeerLocation(peer)
            this.#peers.set(peer.publicKey, peer)
            this.emit('peer.new', peer)

            return peer
        }

        return this.#peers.get(peer.publicKey)
    }

    updatePeers(source, peers = []) {
        const networkSource = this.addPeer(source)
        const networkPeers = peers.map(this.addPeer.bind(this))
        // const peerKeys = networkPeers.map(peer => peer.publicKey)

        networkSource.addPeers(networkPeers)

        this.emit('peer.update', source)
    }

    updatePeerLocation(peer) {
        const geo = geoip.lookup(peer.host)
        if (geo !== null) {
            peer.lat = Number(geo.ll[0])
            peer.lon = Number(geo.ll[1])
        }
    }

    updatePeerInfo(peer, info) {
        this.emit('peer.update', peer)
    }

    toString() {
        const cntPeers = this.#peers.size
        const networkStr = `networkID: ${this.networkId}, difficulty: ${this.difficulty}, peers: ${cntPeers}`
        const peersString = Array.from(this.#peers).map(([key, peer]) => {
            return `\t${peer.toString()} => ${peer.peers.length}`
        }).join("\n")

        return `${networkStr}`
        return `----------------------\n${networkStr}\n${peersString}\n----------------------`
    }
}
