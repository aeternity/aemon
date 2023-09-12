import Constants from '../Messages/Constants.js'
import Message from '../Messages/Message.js'

const TAG = Constants.MSG_RESPONSE

export default class ResponseMessageSerializer {
    static get TAG() {
        return Constants.MSG_RESPONSE
    }

    constructor(fieldsEncoder, messageFactory) {
        this.fieldsEncoder = fieldsEncoder
        this.messageFactory = messageFactory
    }

    serialize(data) {
        const response = {...data}

        if (response.message instanceof Message) {
            response.message = this.fieldsEncoder.encode(response.message)
        }

        const encoded = this.fieldsEncoder.encode(response)

        return [...encoded]
    }

    deserialize(data) {
        const fields = this.fieldsEncoder.decode(TAG, data)
        const {success, messageType, message} = fields

        let decodedMessage = null
        if (success) {
            decodedMessage = this.messageFactory.create(
                Number(messageType),
                this.fieldsEncoder.decode(messageType, message)
            )
        }

        return this.messageFactory.create(
            TAG,
            {...fields, message: decodedMessage},
            data.length
        )
    }
}
