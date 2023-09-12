import Message from './Message.js'

export default class GenerationMessage extends Message {
    constructor(fields) {
        super('generation')

        Object.assign(this, fields)
    }
}
