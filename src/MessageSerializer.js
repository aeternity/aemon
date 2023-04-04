import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import Encoder from './Encoder.js'
import Constants from './Messages/Constants.js'
import FragmentMessage from './Messages/FragmentMessage.js'
import CloseMessageSerializer from './Serializers/CloseMessageSerializer.js'
import PingMessageSerializer from './Serializers/PingMessageSerializer.js'
import ResponseMessageSerializer from './Serializers/ResponseMessageSerializer.js'
import GetNodeInfoMessageSerializer from './Serializers/GetNodeInfoMessageSerializer.js'
import NodeInfoMessageSerializer from './Serializers/NodeInfoMessageSerializer.js'
import FragmentMessageSerializer from './Serializers/FragmentMessageSerializer.js'

export default class MessageSerializer {
    #serializers = {}

    constructor() {
        this.encoder = new Encoder()
        this.apiEncoder = new FateApiEncoder()

        this.#serializers = {
            [CloseMessageSerializer.TAG]: new CloseMessageSerializer(this.encoder),
            [PingMessageSerializer.TAG]: new PingMessageSerializer(this.encoder, this.apiEncoder),
            [ResponseMessageSerializer.TAG]: new ResponseMessageSerializer(this.encoder, this),
            [GetNodeInfoMessageSerializer.TAG]: new GetNodeInfoMessageSerializer(this.encoder),
            [NodeInfoMessageSerializer.TAG]: new NodeInfoMessageSerializer(this.encoder),
            [FragmentMessageSerializer.TAG]: new FragmentMessageSerializer(),
        }
    }

    #supports(name) {
        return this.#serializers.hasOwnProperty(name)
    }

    #getSerializer(tag) {
        if (!this.#supports(tag)) {
            throw new Error('Unsupported message serializer tag: ' + tag)
        }

        return this.#serializers[tag]
    }

    encode(message) {
        if (!this.#supports(message.tag)) {
            throw new Error('Unsupported message tag', message.tag)
        }

        return this.#getSerializer(message.tag).serialize(message)
    }

    decode(tag, data) {
        if (this.#supports(tag)) {
            return this.#getSerializer(tag).deserialize(data)
        }        
    }

    serialize(message) {
        if (!this.#supports(message.tag)) {
            throw new Error('Unsupported message tag', message.tag)
        }

        if (message instanceof FragmentMessage) {
            return this.encode(message)
        }

        return [
            0x0,
            message.tag,
            ...RLP.encode(this.encode(message))
        ]
    }

    deserialize(data) {
        const tag = data[1]
        const rest = data.slice(2)

        if (!this.#supports(tag)) {
            throw new Error('Unsupported tag: ' + tag)
        }

        return this.decode(tag, rest)
    }
}
