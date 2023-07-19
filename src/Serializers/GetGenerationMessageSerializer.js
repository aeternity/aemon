import Constants from '../Messages/Constants.js'
import GetGenerationMessage from '../Messages/GetGenerationMessage.js'

const STRUCT = {
    vsn: 'int',
    hash: 'key_block_hash',
    forward: 'bool',
}

export default class GetGenerationMessageSerializer {
    static get TAG() {
        return Constants.MSG_GET_GENERATION
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.serialize(
            Constants.MSG_GET_GENERATION,
            message.vsn,
            STRUCT,
            message
        )
    }

    deserialize(data) {
        const fields = this.encoder.deserialize(STRUCT, data)

        return new GetGenerationMessage(fields)
    }
}
