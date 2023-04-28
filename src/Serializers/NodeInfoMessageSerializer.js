import RLP from 'rlp'
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
        return this.encoder.encodeFields(message, STRUCT)
    }

    deserialize(data) {
        const objData = RLP.decode(data)
        // // struct based on version
        // const vsn = this.encoder.decodeField('int', objData[0])
        const fields = this.encoder.decodeFields(objData, STRUCT)

        return new NodeInfoMessage(fields)
    }
}
