import Message from './Message.js'

export default class CloseMessage extends Message {
    constructor(fields) {
        super('close')

        this.fields = fields || {vsn: 1n}
    }
}
