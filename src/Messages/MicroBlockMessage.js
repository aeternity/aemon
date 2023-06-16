import Message from './Message.js'

export default class MicroBlockMessage extends Message {
    constructor(fields) {
        super('micro_block')

        //@TODO validation ?
        this.fields = fields
    }

    get version() {
        return this.fields.version
    }

    get height() {
        return this.fields.height
    }

    get time() {
        return this.fields.time
    }
}
