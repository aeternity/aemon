import Constants from '../Messages/Constants.js'
import GetNodeInfoMessage from '../Messages/GetNodeInfoMessage.js'

const STRUCT = {
    vsn: 'int',
}

export default class GetNodeInfoMessageSerializer {
    static get TAG() {
        return Constants.MSG_GET_NODE_INFO
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.serialize(
            Constants.MSG_GET_NODE_INFO,
            message.vsn,
            STRUCT,
            message
        )
    }

    deserialize(data) {
        const fields = this.encoder.deserialize(STRUCT, data)

        return new GetNodeInfoMessage(fields)
    }
}
