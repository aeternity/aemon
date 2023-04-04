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
            this.encoder.encodeInt(message.vsn),
            this.encoder.encodeInt(message.port),
            this.encoder.encodeInt(message.share),
            this.encoder.encodeBinary(this.apiEncoder.decode(message.genesisHash)),
            this.encoder.encodeInt(message.difficulty),
            this.encoder.encodeBinary(this.apiEncoder.decode(message.bestHash)),
            this.encoder.encodeBool(message.syncAllowed),
            this.serializePeers(message)
        ]
    }

    serializePeers(message) {
        const encoder = this.encoder
        const apiEncoder = this.apiEncoder

        return message.peers.map((peer) => {
            return RLP.encode([
                encoder.encodeString(peer.host),
                encoder.encodeInt(peer.port),
                encoder.encodeBinary(apiEncoder.decode(peer.publicKey)),
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
            port: Number(this.encoder.decodeInt(port)),
            share: this.encoder.decodeInt(share),
            genesisHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeBinary(genesisHash)),
            difficulty: this.encoder.decodeInt(difficulty),
            bestHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeBinary(bestHash)),
            syncAllowed: this.encoder.decodeBool(syncAllowed),
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
            encoder.decodeString(host),
            Number(encoder.decodeInt(port)),
            {pub: apiEncoder.encode('peer_pubkey', encoder.decodeBinary(publicKey))},
        )
    }
}
