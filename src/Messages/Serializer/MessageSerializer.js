import MessageFieldsEncoder from './MessageFieldsEncoder.js'
import ResponseMessageSerializer from './Serializers/ResponseMessageSerializer.js'
import FragmentMessageSerializer from './Serializers/FragmentMessageSerializer.js'
import MessageFactory from '../MessageFactory.js'

// composite serializer that also handles message tags
export default class MessageSerializer {
    #serializers = {}

    constructor() {
        this.factory = new MessageFactory()
        this.fieldsEncoder = new MessageFieldsEncoder()

        // serializers knows about message structure and handle custom serialization
        this.#serializers = {
            [ResponseMessageSerializer.TAG]: new ResponseMessageSerializer(
                this.fieldsEncoder,
                this.factory
            ),
            [FragmentMessageSerializer.TAG]: new FragmentMessageSerializer(),
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

    #serializeFields(message) {
        const {tag} = message

        if (this.#supports(tag)) {
            return this.#getSerializer(tag).serialize(message)
        }

        return this.fieldsEncoder.encode(message)
    }

    #deserializeFields(tag, data) {
        if (this.#supports(tag)) {
            return this.#getSerializer(tag).deserialize(data)
        }

        return this.fieldsEncoder.decode(tag, data)
    }

    serialize(message) {
        const {tag} = message
        const serialized = this.#serializeFields(message)

        return [0x0, tag, ...serialized]
    }

    deserialize(data) {
        const tag = data[1]
        const rest = data.slice(2)
        const fields = this.#deserializeFields(tag, rest)

        return this.factory.create(tag, fields, rest.length)
    }
}
