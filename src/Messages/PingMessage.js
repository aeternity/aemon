import RLP from 'rlp'
import Constants from './Constants.js'

export default class PingMessage {
    get name() {
        return 'ping'
    }

    static get TAG() {
        return Constants.MSG_PING
    }

    static get VERSION() {
        return Constants.PING_VSN
    }

    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get tag() {
        return Constants.MSG_PING
    }

    get port() {
        return this.fields.port
    }

    get peers() {
        return this.fields.peers
    }

    get difficulty() {
        return this.fields.difficulty
    }

    encode(encoder, apiEncoder) {
        return [
            encoder.encodeInt(PingMessage.VERSION),
            encoder.encodeInt(this.fields.port),
            encoder.encodeInt(this.fields.share),
            encoder.encodeBinary(apiEncoder.decode(this.fields.genesisHash)),
            encoder.encodeInt(this.fields.difficulty),
            encoder.encodeBinary(apiEncoder.decode(this.fields.bestHash)),
            encoder.encodeBool(this.fields.syncAllowed),
            this.encodePeers(encoder, apiEncoder)
        ]
    }

    encodePeers(encoder, apiEncoder) {
        return this.fields.peers.map((peer) => {
            return RLP.encode([
                encoder.encodeString(peer.host),
                encoder.encodeInt(peer.port),
                encoder.encodeBinary(apiEncoder.decode(peer.publicKey)),
            ])
        })
    }
}
