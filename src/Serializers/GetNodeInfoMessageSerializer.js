import Constants from '../Messages/Constants.js'
import GetNodeInfoMessage from '../Messages/GetNodeInfoMessage.js'

export default class GetNodeInfoMessageSerializer {
    static get TAG() {
        return Constants.MSG_GET_NODE_INFO
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    deserialize() {
        return new GetNodeInfoMessage()
    }

    serialize(message) {
        return [
            ...this.encoder.encodeInt(message.vsn)
        ]
    }
}
