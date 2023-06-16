import Message from './Message.js'

export default class CloseMessage extends Message {
    constructor() {
        super('close')
    }
}
