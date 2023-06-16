import Message from './Message.js'

export default class KeyBlockMessage extends Message {
    constructor(fields) {
        super('key_block')

        //@TODO validation ?
        this.fields = fields
    }

    get version() {
        return this.fields.version
    }

    get height() {
        return this.fields.height
    }

    get beneficiary() {
        return this.fields.beneficiary
    }

    get info() {
        return this.fields.info
    }

    get time() {
        return this.fields.time
    }
}
