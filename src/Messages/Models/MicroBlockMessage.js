import Message from './Message.js'

export default class MicroBlockMessage extends Message {
    constructor(fields) {
        super('micro_block')

        //@TODO validation ?
        Object.assign(this, fields)
    }
}
