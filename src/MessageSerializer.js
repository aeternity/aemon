import RLP from 'rlp'
import Encoder from './Encoder.js'
import ObjectSerializer from './ObjectSerializer.js'
import Constants from './Messages/Constants.js'
import Message from './Messages/Message.js'
import FragmentMessage from './Messages/FragmentMessage.js'
import CloseMessageSerializer from './Serializers/CloseMessageSerializer.js'
import PingMessageSerializer from './Serializers/PingMessageSerializer.js'
import ResponseMessageSerializer from './Serializers/ResponseMessageSerializer.js'
import GetNodeInfoMessageSerializer from './Serializers/GetNodeInfoMessageSerializer.js'
import NodeInfoMessageSerializer from './Serializers/NodeInfoMessageSerializer.js'
import FragmentMessageSerializer from './Serializers/FragmentMessageSerializer.js'
import KeyBlockMessageSerializer from './Serializers/KeyBlockMessageSerializer.js'
import MicroBlockMessageSerializer from './Serializers/MicroBlockMessageSerializer.js'
import TransactionsMessageSerializer from './Serializers/TransactionsMessageSerializer.js'
import GetGenerationMessageSerializer from './Serializers/GetGenerationMessageSerializer.js'
import GenerationMessageSerializer from './Serializers/GenerationMessageSerializer.js'

// composite serializer that also handles message tags
export default class MessageSerializer {
    #serializers = {}

    constructor() {
        const encoder = new Encoder()
        const objectSerializer = new ObjectSerializer()

        // serializers knows about message structure and handle custom serialization
        this.#serializers = {
            [CloseMessageSerializer.TAG]: new CloseMessageSerializer(encoder),
            [PingMessageSerializer.TAG]: new PingMessageSerializer(encoder),
            [ResponseMessageSerializer.TAG]: new ResponseMessageSerializer(encoder, this),
            [GetNodeInfoMessageSerializer.TAG]: new GetNodeInfoMessageSerializer(encoder),
            [NodeInfoMessageSerializer.TAG]: new NodeInfoMessageSerializer(encoder),
            [FragmentMessageSerializer.TAG]: new FragmentMessageSerializer(),
            [KeyBlockMessageSerializer.TAG]: new KeyBlockMessageSerializer(encoder),
            [MicroBlockMessageSerializer.TAG]: new MicroBlockMessageSerializer(encoder),
            [TransactionsMessageSerializer.TAG]: new TransactionsMessageSerializer(encoder),
            [GetGenerationMessageSerializer.TAG]: new GetGenerationMessageSerializer(encoder),
            [GenerationMessageSerializer.TAG]: new GenerationMessageSerializer(encoder),
        }
    }

    #supports(tag) {
        return this.#serializers.hasOwnProperty(tag)
    }

    #getSerializer(tag) {
        if (!this.#supports(tag)) {
            throw new Error('Unsupported message serializer tag: ' + tag)
        }

        return this.#serializers[tag]
    }

    serialize(message) {
        if (message instanceof FragmentMessage) {
            return this.#getSerializer(message.tag).serialize(message)
        }

        return [
            0x0,
            message.tag,
            ...this.#getSerializer(message.tag).serialize(message)
        ]
    }

    deserialize(data) {
        const tag = data[1]
        const rest = data.slice(2)

        if (this.#supports(tag)) {
            return this.#getSerializer(tag).deserialize(rest)
        }

        // Build a base message for statistic purposes
        const key = Object.keys(Constants).find(key => Constants[key] === tag)
        if (key === undefined) {
            throw new Error('Unsupported message serializer tag: ' + tag)
        }

        const name = key.replace('MSG_', '').toLowerCase()

        return new Message(name)
    }
}
