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
        this.height = 0

        peers.map(peer => this.addPeer(Peer.withUrl(peer)))

        /* eslint-disable no-param-reassign */
        this.#peers.forEach(peer => {
            peer.owner = 'aeternity'
            peer.kind = 'seed'
        })
    }

    get peers() {
        return Array.from(this.#peers, ([_key, peer]) => peer)
    }

    addPeer(peer) {
        if (this.#peers.has(peer.publicKey)) {
            return this.#peers.get(peer.publicKey)
        }

        this.#peers.set(peer.publicKey, peer)
        this.emit('peer.new', peer)

        return peer
    }

    updatePeer(source, port = 3015, peers = []) {
        const networkSource = this.addPeer(source)
        const networkPeers = peers.map(this.addPeer.bind(this))
        // const peerKeys = networkPeers.map(peer => peer.publicKey)

        networkSource.addPeers(networkPeers)
        networkSource.port = port

        this.emit('peer.update', networkSource)
    }

    toString() {
        const cntPeers = this.#peers.size
        const networkStr = `networkID: ${this.networkId}, difficulty: ${this.difficulty}, peers: ${cntPeers}`
        const peersString = Array.from(this.#peers).map(([_key, peer]) => {
            return `\t${peer.toString()} => ${peer.peers.length}`
        }).join('\n')

        return `----------------------\n${networkStr}\n${peersString}\n----------------------`
    }
}
