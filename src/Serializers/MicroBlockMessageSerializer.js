import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import MicroBlockMessage from '../Messages/MicroBlockMessage.js'

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
        const [_vsn, blockData, light] = RLP.decode(data)
        const [_objectTag, _version, headerData, txHashes, pof] = RLP.decode(blockData)
        const isLight = this.encoder.decodeBool(light)

        if (!isLight) {
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

        const fields = this.encoder.decode(headerData, struct)

        return new MicroBlockMessage(fields)
    }
}
