import TEMPLATES from './MessageEncoderTemplates.js'
import MessageSerializer from '../Serializer/MessageSerializer.js'
import TemplateFieldsEncoder from '../TemplateFieldsEncoder.js'
import MessageFactory from '../MessageFactory.js'

export default class MessageEncoder {
    constructor() {
        const encoders = {
            p2p_message: (value) => new Uint8Array(this.encode(value).slice(2))
        }

        const decoders = {
            p2p_message: (value) => this.msgFactory.create(value.tag, this.#binaryToFields(value))
        }

        this.msgFactory = new MessageFactory()
        this.messageSerializer = new MessageSerializer()
        this.templateFieldsEncoder = new TemplateFieldsEncoder(encoders, decoders)
    }

    #binaryToFields(message) {
        const {tag, vsn} = message

        if (!TEMPLATES.hasOwnProperty(tag)) {
            return message
        }

        const template = TEMPLATES[tag][vsn]
        const fields = this.templateFieldsEncoder.binaryToFields(template, message)

        Object.assign(message, fields)

        return message
    }

    #fieldsToBinary(message) {
        const {tag, vsn} = message

        if (!TEMPLATES.hasOwnProperty(tag)) {
            return message
        }

        const template = TEMPLATES[tag][vsn]

        return {tag, ...this.templateFieldsEncoder.fieldsToBinary(template, message)}
    }

    encode(message) {
        const binaryFields = this.#fieldsToBinary(message)

        return this.messageSerializer.serialize(binaryFields)
    }

    decode(binaryData) {
        const message = this.messageSerializer.deserialize(binaryData)
        const fields = this.#binaryToFields(message)

        return this.msgFactory.create(fields.tag, fields)
    }
}
