import TEMPLATES from './MessageEncoderTemplates.js'
import MessageSerializer from '../Serializer/MessageSerializer.js'
import SerializerTemplate from '../SerializerTemplate.js'
import MessageFactory from '../MessageFactory.js'

export default class MessageEncoder {
    constructor() {
        const encoders = {
            p2p_message: (value) => new Uint8Array(this.encode(value).slice(2))
        }

        const decoders = {
            p2p_message: (value) => this.messageFactory.create(value.tag, this.#binaryToFields(value))
        }

        this.messageFactory = new MessageFactory()
        this.messageSerializer = new MessageSerializer()
        this.serializerTemplate = new SerializerTemplate(encoders, decoders)
    }

    #binaryToFields(message) {
        const {tag, vsn} = message

        if (!TEMPLATES.hasOwnProperty(tag)) {
            return message
        }

        const template = TEMPLATES[tag][vsn]
        const fields = this.serializerTemplate.binaryToFields(template, message)

        Object.assign(message, fields)

        return message
    }

    #fieldsToBinary(message) {
        const {tag, vsn} = message

        if (!TEMPLATES.hasOwnProperty(tag)) {
            return message
        }

        const template = TEMPLATES[tag][vsn]

        return {tag, ...this.serializerTemplate.fieldsToBinary(template, message)}
    }

    encode(message) {
        const binaryFields = this.#fieldsToBinary(message)

        return this.messageSerializer.serialize(binaryFields)
    }

    decode(binaryData) {
        const message = this.messageSerializer.deserialize(binaryData)
        const fields = this.#binaryToFields(message)

        return this.messageFactory.create(fields.tag, fields)
    }
}
