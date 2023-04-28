import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import PingMessage from '../Messages/PingMessage.js'
import Peer from '../Peer.js'

const STRUCT = {
    vsn: 'int',
    port: 'int',
    share: 'int',
    genesisHash: 'key_block_hash',
    difficulty: 'int',
    bestHash: 'key_block_hash',
    syncAllowed: 'bool',
}

const PEER_STRUCT = {
    host: 'string',
    port: 'int',
    publicKey: 'peer_pubkey',
}

export default class PingMessageSerializer {
    static get TAG() {
        return Constants.MSG_PING
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        const peers = message.peers.map(peer => RLP.encode(this.encoder.encodeFields(peer, PEER_STRUCT)))

        return [
            ...this.encoder.encodeFields(message, STRUCT),
            peers
        ]
    }

    deserialize(data) {
        const objData = RLP.decode(data)
        // // struct based on version
        // const vsn = this.encoder.decodeField('int', objData[0])
        const fields = this.encoder.decodeFields(objData, STRUCT)
        fields.peers = objData[7].map(peer => this.deserializePeer(peer))

        return new PingMessage(fields)
    }

    deserializePeer(data) {
        const {host, port, publicKey: pub} = this.encoder.decodeFields(RLP.decode(data), PEER_STRUCT)

        return new Peer(host, port, {pub})
    }
}
