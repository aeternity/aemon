import RLP from 'rlp'
import Constants from './Constants.js'

export default class P2PResponseMessage {
    static get TAG() {
        return Constants.MSG_P2P_RESPONSE
    }

    static get VERSION() {
        return Constants.RESPONSE_VSN
    }

    constructor(success, messageType, errorReason, message) {
        this.success = !!success
        this.messageType = Number(messageType)
        this.errorReason = errorReason.toString()
        this.message = message
    }

    get tag() {
        return Constants.MSG_P2P_RESPONSE
    }

    encode(encoder, apiEncoder) {
        const message = this.message.encode(encoder, apiEncoder)
        // console.log('SUBMESSAGE', message)

        return [
            encoder.encodeInt(P2PResponseMessage.VERSION),
            encoder.encodeBool(this.success),
            encoder.encodeInt(this.messageType),
            encoder.encodeBinary(this.errorReason),
            RLP.encode(message)
        ]
    }
}
