import Message from './Message.js'

export default class ResponseMessage extends Message {
    constructor(fields) {
        super('response')

        // @TODO validation ?
        Object.assign(this, fields)
        this.messageType = Number(this.messageType || this.message.tag)
        this.success = !!this.success
        this.errorReason = (this.errorReason || '').toString()
    }

    get type() {
        if (!this.success) {
            return 'error'
        }

        return this.message.name
    }
}
