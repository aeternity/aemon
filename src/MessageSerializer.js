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
        const encoder = new Encoder()
        const apiEncoder = new FateApiEncoder()

        this.#serializers = {
            [CloseMessageSerializer.TAG]: new CloseMessageSerializer(encoder),
            [PingMessageSerializer.TAG]: new PingMessageSerializer(encoder, apiEncoder),
            [ResponseMessageSerializer.TAG]: new ResponseMessageSerializer(encoder, this),
            [GetNodeInfoMessageSerializer.TAG]: new GetNodeInfoMessageSerializer(encoder),
            [NodeInfoMessageSerializer.TAG]: new NodeInfoMessageSerializer(encoder),
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
        return this.#getSerializer(message.tag).serialize(message)
    }

    decode(tag, data) {
        return this.#getSerializer(tag).deserialize(data)
    }

    serialize(message) {
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

        return this.decode(tag, rest)
    }
}
