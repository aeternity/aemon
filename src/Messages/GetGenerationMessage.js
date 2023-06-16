import Message from './Message.js'

export default class GetGenerationMessage extends Message {
    constructor(fields) {
        super('get_generation')

        this.fields = fields
    }

    get hash() {
        return this.fields.hash
    }

    get forward() {
        return this.fields.forward
    }
}
