import Message from './Message.js'

export default class GetNodeInfoMessage extends Message {
    constructor() {
        super('get_node_info')
    }
}
