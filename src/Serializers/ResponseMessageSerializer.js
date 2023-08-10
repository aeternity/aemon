import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import ResponseMessage from '../Messages/ResponseMessage.js'

const STRUCT = {
    vsn: 'int',
    success: 'bool',
    messageType: 'int',
    errorReason: 'binary',
    message: 'binary',
}

export default class ResponseMessageSerializer {
    static get TAG() {
        return Constants.MSG_RESPONSE
    }

    constructor(encoder, serializer) {
        this.encoder = encoder
        this.serializer = serializer
    }

    serialize(data) {
        // serialize message without the tag (for some reason!? because the response carry the tag?!)
        const message = new Uint8Array(this.serializer.serialize(data.message).slice(2))
        const response = {...data, message}

        return this.encoder.serialize(
            Constants.MSG_RESPONSE,
            response.vsn,
            STRUCT,
            response
        )
    }

    deserialize(data) {
        const {_vsn, success, messageType, errorReason, message} = this.encoder.deserialize(STRUCT, data)
        let decodedMessage = null

        if (success) {
            const messageBin = new Uint8Array([0x0, Number(messageType), ...message])
            decodedMessage = this.serializer.deserialize(messageBin)
        }

        return new ResponseMessage(
            success,
            messageType,
            errorReason,
            decodedMessage,
            data.length,
        )
    }
}
