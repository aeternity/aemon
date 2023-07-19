import Constants from '../Messages/Constants.js'
import NodeInfoMessage from '../Messages/NodeInfoMessage.js'

const STRUCT = {
    vsn: 'int',
    version: 'string',
    revision: 'string',
    vendor: 'string',
    os: 'string',
    networkId: 'string',
    verifiedPeers: 'int',
    unverifiedPeers: 'int',
}

export default class NodeInfoMessageSerializer {
    static get TAG() {
        return Constants.MSG_NODE_INFO
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.serialize(
            Constants.MSG_NODE_INFO,
            message.vsn,
            STRUCT,
            message
        )
    }

    deserialize(data) {
        const fields = this.encoder.deserialize(STRUCT, data)

        return new NodeInfoMessage(fields)
    }
}
