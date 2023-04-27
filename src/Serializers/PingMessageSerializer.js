import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import PingMessage from '../Messages/PingMessage.js'
import Peer from '../Peer.js'

export default class PingMessageSerializer {
    static get TAG() {
        return Constants.MSG_PING
    }

    constructor(encoder, apiEncoder) {
        this.encoder = encoder
        this.apiEncoder = apiEncoder
    }

    serialize(message) {
        return [
            this.encoder.encodeField('int', message.vsn),
            this.encoder.encodeField('int', message.port),
            this.encoder.encodeField('int', message.share),
            this.encoder.encodeField('binary', this.apiEncoder.decode(message.genesisHash)),
            this.encoder.encodeField('int', message.difficulty),
            this.encoder.encodeField('binary', this.apiEncoder.decode(message.bestHash)),
            this.encoder.encodeField('bool', message.syncAllowed),
            this.serializePeers(message)
        ]
    }

    serializePeers(message) {
        const encoder = this.encoder
        const apiEncoder = this.apiEncoder

        return message.peers.map((peer) => {
            return RLP.encode([
                encoder.encodeField('string', peer.host),
                encoder.encodeField('int', peer.port),
                encoder.encodeField('binary', apiEncoder.decode(peer.publicKey)),
            ])
        })
    }

    deserialize(data) {
        const fieldsData = RLP.decode(data)
        // console.log('PING fields data', fieldsData)
        const [
            vsn,
            port,
            share,
            genesisHash,
            difficulty,
            bestHash,
            syncAllowed,
            peers
        ] = fieldsData

        const fields = {
            port: Number(this.encoder.decodeField('int', port)),
            share: this.encoder.decodeField('int', share),
            genesisHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeField('binary', genesisHash)),
            difficulty: this.encoder.decodeField('int', difficulty),
            bestHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeField('binary', bestHash)),
            syncAllowed: this.encoder.decodeField('bool', syncAllowed),
            peers: peers.map((peer) => {
                return this.deserializePeer(peer)
            }),
        }

        return new PingMessage(fields)
    }

    deserializePeer(buffer) {
        const encoder = this.encoder
        const apiEncoder = this.apiEncoder
        const [host, port, publicKey] = RLP.decode(buffer)

        return new Peer(
            encoder.decodeField('string', host),
            Number(encoder.decodeField('int', port)),
            {pub: apiEncoder.encode('peer_pubkey', encoder.decodeField('binary', publicKey))},
        )
    }
}
