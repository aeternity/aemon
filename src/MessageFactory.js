import Constants from './Messages/Constants.js'
import ResponseMessage from './Messages/ResponseMessage.js'
import FragmentMessage from './Messages/FragmentMessage.js'
import CloseMessage from './Messages/CloseMessage.js'
import PingMessage from './Messages/PingMessage.js'
import NodeInfoMessage from './Messages/NodeInfoMessage.js'
import GetNodeInfoMessage from './Messages/GetNodeInfoMessage.js'
import GetGenerationMessage from './Messages/GetGenerationMessage.js'
import TransactionsMessage from './Messages/TransactionsMessage.js'
import MicroBlockMessage from './Messages/MicroBlockMessage.js'
import KeyBlockMessage from './Messages/KeyBlockMessage.js'
import GenerationMessage from './Messages/GenerationMessage.js'
import Message from './Messages/Message.js'
import Peer from './Peer.js'

export default class MessageFactory {
    create(tag, fields, messageSize) {
        fields.vsn = Number(fields.vsn)

        switch(tag) {
            case Constants.MSG_FRAGMENT:
                return new FragmentMessage(fields.index, fields.total, fields.data)
            case Constants.MSG_RESPONSE:
                return new ResponseMessage({size: messageSize, ...fields})
            case Constants.MSG_CLOSE:
                return new CloseMessage(fields)
            case Constants.MSG_PING:
                return this.createPingMessage(fields)
            case Constants.MSG_NODE_INFO:
                return new NodeInfoMessage(fields)
            case Constants.MSG_GET_NODE_INFO:
                return new GetNodeInfoMessage(fields)
            case Constants.MSG_GET_GENERATION:
                return new GetGenerationMessage(fields)
            case Constants.MSG_TXS:
                return new TransactionsMessage(fields)
            case Constants.MSG_MICRO_BLOCK:
                return new MicroBlockMessage(fields)
            case Constants.MSG_KEY_BLOCK:
                return new KeyBlockMessage(fields)
            case Constants.MSG_GENERATION:
                return new GenerationMessage(fields)
            default:
                return this.createDefaultMessage(tag, fields)
        }
    }

    createDefaultMessage(tag, fields) {
        const key = Object.keys(Constants).find(key => Constants[key] === tag)
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
