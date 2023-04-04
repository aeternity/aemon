import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import ResponseMessage from '../Messages/ResponseMessage.js'

export default class ResponseMessageSerializer {
    static get TAG() {
        return Constants.MSG_P2P_RESPONSE
    }

    constructor(encoder, serializer) {
        this.encoder = encoder
        this.serializer = serializer
    }

    serialize(message) {
        const encodeMessage = this.serializer.encode(message.message)
        // console.log('SUBMESSAGE', encodeMessage)

        return [
            this.encoder.encodeInt(message.vsn),
            this.encoder.encodeBool(message.success),
            this.encoder.encodeInt(message.messageType),
            this.encoder.encodeBinary(message.errorReason),
            RLP.encode(encodeMessage)
        ]
    }

    deserialize(data) {
        const fields = RLP.decode(data)
        // console.log('FIELDS', fields)
        const [vsn, success, messageType, errorReason, message] = RLP.decode(data)
        // console.log('decoded response:', vsn, success, messageType, errorReason, message)
        const isSuccessful = this.encoder.decodeBool(success)
        const messageTag = Number(this.encoder.decodeInt(messageType))

        // console.log('messageTag:', messageTag)
        return new ResponseMessage(
            isSuccessful,
            messageTag,
            this.encoder.decodeString(errorReason),
            isSuccessful ? this.serializer.decode(messageTag, message) : null
        )
    }
}
