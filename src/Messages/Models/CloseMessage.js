import Message from './Message.js'

export default class CloseMessage extends Message {
    constructor(fields) {
        super('close')

        Object.assign(this, fields)
    }
}
