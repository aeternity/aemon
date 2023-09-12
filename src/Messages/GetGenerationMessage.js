import Message from './Message.js'

export default class GetGenerationMessage extends Message {
    constructor(fields) {
        super('get_generation')

        Object.assign(this, fields)
    }
}
