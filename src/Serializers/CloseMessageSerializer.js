import Constants from '../Messages/Constants.js'
import CloseMessage from '../Messages/CloseMessage.js'

const STRUCT = {
    vsn: 'int',
}

export default class CloseMessageSerializer {
    static get TAG() {
        return Constants.MSG_CLOSE
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return this.encoder.serialize(
            Constants.MSG_CLOSE,
            message.vsn,
            STRUCT,
            message
        )
    }

    deserialize(data) {
        const fields = this.encoder.deserialize(STRUCT, data)

        return new CloseMessage(fields)
    }
}
