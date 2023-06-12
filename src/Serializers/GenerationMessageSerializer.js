import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import GenerationMessage from '../Messages/GenerationMessage.js'

const STRUCT = {
    vsn: 'int',
    keyBlock: 'object',
    // microBlocks: ['binary'],
    forward: 'bool',
}

export default class GenerationMessageSerializer {
    static get TAG() {
        return Constants.MSG_GENERATION
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.encodeFields(message, STRUCT)
    }

    deserialize(data) {
        // console.log('GENERATION MESSAGE:')
        // console.dir(data, {maxArrayLength: null})
        const objData = RLP.decode(data)
        const [_vsn, keyBlockData, microBlocksData, forwardData] = RLP.decode(data)
        const forward = this.encoder.decodeField('bool', forwardData)

        // // struct based on version
        // const vsn = this.encoder.decodeField('int', objData[0])
        // const fields = this.encoder.decodeFields(objData, STRUCT)


        const keyBlockStruct = {
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

        const keyBlock = this.encoder.decode(keyBlockData, keyBlockStruct)

        // TODO: FACTOR OUT BLOCK SERIALIZER USED BY MANY MESSAGE TYPES
        // https://github.com/aeternity/protocol/blob/master/serializations.md#micro-block

        // in total we should have:
        // 1. message serializers (using field encoders?)
        // 2. chain object serializer
        // 3. block serializer (using field encoder?)
        //

        // console.log('KEYBLOCK ', keyBlock)
        // console.dir(keyBlock.pow, {maxArrayLength: null})

        return new GenerationMessage({keyBlock, forward})
    }
}
