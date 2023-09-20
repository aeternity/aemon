import Message from './Message.js'

export default class NodeInfoMessage extends Message {
    constructor(fields) {
        super('node_info')

        // @TODO validation ?
        Object.assign(this, fields)
    }
}
