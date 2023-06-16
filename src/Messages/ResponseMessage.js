import Message from './Message.js'

export default class ResponseMessage extends Message {
    constructor(success, messageType, errorReason, message, size = 0) {
        super('response')

        this.success = !!success
        this.messageType = Number(messageType)
        this.errorReason = errorReason.toString()
        this.message = message
        this.size = size
    }

    get type() {
        if (!this.success) {
            return 'error'
        }

        return this.message.name
    }
}
