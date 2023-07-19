import Constants from '../Messages/Constants.js'
import GenerationMessage from '../Messages/GenerationMessage.js'

const STRUCT = {
    vsn: 'int',
    keyBlockData: 'binary',
    microBlocksData: 'binary',
    forward: 'bool',
}

const FLAGS = {
    KEY: 0x80000000,
    INFO: 0x40000000
}

const KEY_BLOCK_STRUCT = {
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
    // since Minerva variable based on INFO flag
    // info: ['uint_32', 4]
}

export default class GenerationMessageSerializer {
    static get TAG() {
        return Constants.MSG_GENERATION
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        throw new Error('Not implemented.')
    }

    deserialize(data) {
        const {keyBlockData, microBlocksData, forward} = this.encoder.deserialize(STRUCT, data)

        const headStruct = {
            version: ['uint_32', 4],
            flags: ['uint_32', 4]
        }

        const {version, flags} = this.encoder.decode(keyBlockData, headStruct)

        const keyBlockStruct = {...KEY_BLOCK_STRUCT}
        if (Number(flags) & FLAGS.INFO) {
            //binary, but currently interpreted as int/node version
            keyBlockStruct.info = ['uint_32', 4]
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
