import RLP from 'rlp'
import Constants from './Constants.js'

export default class PingMessage {
    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get name() {
        return 'ping'
    }

    get vsn() {
        return Constants.PING_VSN
    }

    get tag() {
        return Constants.MSG_PING
    }

    get port() {
        return Number(this.fields.port)
    }

    get share() {
        return this.fields.share
    }

    get peers() {
        return this.fields.peers
    }

    get difficulty() {
        return this.fields.difficulty
    }

    get genesisHash() {
        return this.fields.genesisHash
    }

    get bestHash() {
        return this.fields.bestHash
    }

    get syncAllowed() {
        return this.fields.syncAllowed
    }

    toJSON() {
        return {
            name: this.name,
            vsn: this.vsn,
            tag: this.tag,
            port: this.port,
            share: this.share,
            difficulty: this.difficulty,
            genesisHash: this.genesisHash,
            bestHash: this.bestHash,
            syncAllowed: this.syncAllowed,
            peersCount: this.peers.length
        }
    }
}
