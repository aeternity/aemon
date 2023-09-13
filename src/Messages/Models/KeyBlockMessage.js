import Message from './Message.js'

export default class KeyBlockMessage extends Message {
    constructor(fields) {
        super('key_block')

        //@TODO validation ?
        Object.assign(this, fields)
    }
}
