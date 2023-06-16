import Message from './Message.js'

export default class GenerationMessage extends Message {
    constructor(fields) {
        super('generation')

        this.fields = fields
    }

    get keyBlock() {
        return this.fields.keyBlock
    }

    get microBlocks() {
        return this.fields.microBlocks
    }

    get forward() {
        return this.fields.forward
    }
}
