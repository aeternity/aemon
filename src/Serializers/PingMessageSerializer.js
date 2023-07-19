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
    peers: 'binary',
    peers: [{
        host: 'string',
        port: 'int',
        publicKey: 'peer_pubkey',
    }]
}

export default class PingMessageSerializer {
    static get TAG() {
        return Constants.MSG_PING
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.serialize(
            Constants.MSG_PING,
            message.vsn,
            STRUCT,
            message
        )
    }

    deserialize(data) {
        const fields = this.encoder.deserialize(STRUCT, data)
        fields.peers = fields.peers.map(({host, port, publicKey: pub}) => new Peer(host, port, {pub}))

        return new PingMessage(fields)
    }
}
