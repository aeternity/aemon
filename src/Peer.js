export default class Peer {
    #peers = new Set()
    constructor(host, port, keypair = {}) {
        this.host = host
        this.port = port
        this.keypair = keypair
        this.lat = 0
        this.lon = 0
        this.country = ''
        this.owner = 'unknown'
        this.kind = 'peer'
    }

    static withUrl(address) {
        const url = new URL(address)
        return new Peer(url.hostname, url.port, {pub: url.username})
    }

    get publicKey() {
        return this.keypair.pub
    }

    get privateKey() {
        return this.keypair.prv
    }

    get peers() {
        return Array.from(this.#peers.values())
    }

    addPeer(peer) {
        this.#peers.add(peer)
        // if (!this.peersMap.has(peer.publicKey)) {
        //     this.peersMap.set(peer.publicKey, peer)
        //     //emit event ?
        // }

        // return this.peersMap.get(peer.publicKey)
    }

    addPeers(peers) {
        // if (peers instanceof Map) {
        //     for (let peer of peers.values()) {
        //         this.addPeer(peer)
        //     }

        //     return
        // }

        peers.forEach(peer => this.addPeer(peer))
    }

    toString() {
        return `${this.publicKey}@${this.host}:${this.port}`
    }

    clone() {
        return new Peer(this.host, this.port, this.keypair)
    }
}
