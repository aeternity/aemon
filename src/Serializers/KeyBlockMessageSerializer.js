import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import KeyBlockMessage from '../Messages/KeyBlockMessage.js'

export default class KeyBlockMessageSerializer {
    static get TAG() {
        return Constants.MSG_KEY_BLOCK
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        throw new Error('Not implemented.')
    }

    deserialize(data) {
        const [_vsn, headerData] = RLP.decode(data)

        const struct = {
            version: ['uint_32', 4],
            flags: ['uint_32', 4],
            height: ['uint_64', 8],
            prevHash: ['micro_block_hash', 32],
            prevKeyHash: ['key_block_hash', 32],
            stateHash: ['block_state_hash', 32],
            miner: ['account_pubkey', 32],
            beneficiary: ['account_pubkey', 32],
            target: ['uint_32', 4],
            pow: ['binary', 168],
            nonce: ['uint_64', 8],
            time: ['uint_64', 8],
            //binary, but currently interpreted as int/node version
            info: ['uint_32', 4]
        }

        const fields = this.encoder.decode(headerData, struct)

        return new KeyBlockMessage(fields)
    }
}
