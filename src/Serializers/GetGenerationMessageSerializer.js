import RLP from 'rlp'
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
        return this.encoder.encodeFields(message, STRUCT)
    }

    deserialize(data) {
        const objData = RLP.decode(data)
        // // struct based on version
        // const vsn = this.encoder.decodeField('int', objData[0])
        const fields = this.encoder.decodeFields(objData, STRUCT)

        return new GetGenerationMessage(fields)
    }
}
