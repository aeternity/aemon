import Constants from '../Messages/Constants.js'
import MicroBlockMessage from '../Messages/MicroBlockMessage.js'

const STRUCT = {
    vsn: 'int',
    block: 'object',
    light: 'bool',
}

export default class MicroBlockMessageSerializer {
    static get TAG() {
        return Constants.MSG_MICRO_BLOCK
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        throw new Error('Not implemented.')
    }

    deserialize(data) {
        const {block, light} = this.encoder.deserialize(STRUCT, data)

        if (!light) {
            throw new Error('Serializer supports only light blocks')
        }

        const struct = {
            version: ['uint_32', 4],
            flags: ['uint_32', 4],
            height: ['uint_64', 8],
            prevHash: ['micro_block_hash', 32],
            prevKeyHash: ['key_block_hash', 32],
            stateHash: ['block_state_hash', 32],
            txsHash: ['block_tx_hash', 32],
            time: ['uint_64', 8],
            // fraudHash: ['block_pof_hash', 32],
            signature: ['signature', 64],
        }

        const fields = this.encoder.decode(block.header, struct)

        return new MicroBlockMessage(fields)
    }
}
