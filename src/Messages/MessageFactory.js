import MessageTags from './MessageTags.js'
import ResponseMessage from './Models/ResponseMessage.js'
import FragmentMessage from './Models/FragmentMessage.js'
import CloseMessage from './Models/CloseMessage.js'
import PingMessage from './Models/PingMessage.js'
import NodeInfoMessage from './Models/NodeInfoMessage.js'
import GetNodeInfoMessage from './Models/GetNodeInfoMessage.js'
import GetGenerationMessage from './Models/GetGenerationMessage.js'
import TransactionsMessage from './Models/TransactionsMessage.js'
import MicroBlockMessage from './Models/MicroBlockMessage.js'
import KeyBlockMessage from './Models/KeyBlockMessage.js'
import GenerationMessage from './Models/GenerationMessage.js'
import Message from './Models/Message.js'
// @TODO get rid of this dependancy as it's in the app domain, not messages
import Peer from '../Peer.js'

export default class MessageFactory {
    create(tag, fields, messageSize) {
        fields.vsn = Number(fields.vsn)

        switch (tag) {
        case MessageTags.MSG_FRAGMENT:
            return new FragmentMessage(fields.index, fields.total, fields.data)
        case MessageTags.MSG_RESPONSE:
            return new ResponseMessage({size: messageSize, ...fields})
        case MessageTags.MSG_CLOSE:
            return new CloseMessage(fields)
        case MessageTags.MSG_PING:
            return this.createPingMessage(fields)
        case MessageTags.MSG_NODE_INFO:
            return new NodeInfoMessage(fields)
        case MessageTags.MSG_GET_NODE_INFO:
            return new GetNodeInfoMessage(fields)
        case MessageTags.MSG_GET_GENERATION:
            return new GetGenerationMessage(fields)
        case MessageTags.MSG_TXS:
            return new TransactionsMessage(fields)
        case MessageTags.MSG_MICRO_BLOCK:
            return new MicroBlockMessage(fields)
        case MessageTags.MSG_KEY_BLOCK:
            return new KeyBlockMessage(fields)
        case MessageTags.MSG_GENERATION:
            return new GenerationMessage(fields)
        default:
            return this.createDefaultMessage(tag, fields)
        }
    }

    createDefaultMessage(tag, fields) {
        const key = Object.keys(MessageTags).find(key => MessageTags[key] === tag)
        if (key === undefined) {
            throw new Error('Unsupported message serializer tag: ' + tag)
        }

        const name = key.replace('MSG_', '').toLowerCase()

        return new Message(name, fields)
    }

    createPingMessage(fields) {
        fields.peers = fields.peers.map(({host, port, publicKey: pub}) => new Peer(host, port, {pub}))

        return new PingMessage(fields)
    }
}
