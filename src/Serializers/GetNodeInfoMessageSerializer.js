import Constants from '../Messages/Constants.js'
import GetNodeInfoMessage from '../Messages/GetNodeInfoMessage.js'

export default class GetNodeInfoMessageSerializer {
    static get TAG() {
        return Constants.MSG_GET_NODE_INFO
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return [
            ...this.encoder.encodeField('int', message.vsn)
        ]
    }

    deserialize() {
        return new GetNodeInfoMessage()
    }
}
