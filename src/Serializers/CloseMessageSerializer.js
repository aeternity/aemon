import Constants from '../Messages/Constants.js'
import CloseMessage from '../Messages/CloseMessage.js'

export default class CloseMessageSerializer {
    static get TAG() {
        return Constants.MSG_CLOSE
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    deserialize() {
        return new CloseMessage()
    }

    serialize(message) {
        return [
            ...this.encoder.encodeInt(message.vsn)
        ]
    }
}
