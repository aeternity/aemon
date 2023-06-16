import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import ResponseMessage from '../Messages/ResponseMessage.js'

export default class ResponseMessageSerializer {
    static get TAG() {
        return Constants.MSG_RESPONSE
    }

    constructor(encoder, serializer) {
        this.encoder = encoder
        this.serializer = serializer
    }

    serialize(message) {
        const encodedMessage = this.serializer.encode(message.message)
        // console.log('SUBMESSAGE', encodedMessage)

        return [
            this.encoder.encodeField('int', message.vsn),
            this.encoder.encodeField('bool', message.success),
            this.encoder.encodeField('int', message.messageType),
            this.encoder.encodeField('binary', message.errorReason),
            RLP.encode(encodedMessage)
        ]
    }

    deserialize(data) {
        const fields = RLP.decode(data)
        // console.log('FIELDS', fields)
        const [vsn, success, messageType, errorReason, message] = RLP.decode(data)
        // console.log('decoded response:', vsn, success, messageType, errorReason, message)
        const isSuccessful = this.encoder.decodeField('bool', success)
        const messageTag = Number(this.encoder.decodeField('int', messageType))

        // console.log('RESPONSE MESSAGE:')
        // console.dir(message, {maxArrayLength: null})

        // console.log('messageTag:', messageTag)
        return new ResponseMessage(
            isSuccessful,
            messageTag,
            this.encoder.decodeField('string', errorReason),
            isSuccessful ? this.serializer.decode(messageTag, message) : null,
            data.length,
        )
    }
}
