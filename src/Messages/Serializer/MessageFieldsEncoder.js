import RLP from 'rlp'
import TEMPLATES from './MessageSerializerTemplates.js'
import PrimitivesEncoder from '../../PrimitivesEncoder.js'

export default class MessageFieldsEncoder {
    constructor() {
        this.primEncoder = new PrimitivesEncoder()
    }

    #encodeField(typeInfo, value) {
        // console.log('encodeField', typeInfo, value)
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#encodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {type, template} = typeInfo

            return RLP.encode(this.encodeFields(value, template))
        }

        return this.primEncoder.encode(typeInfo, value)
    }

    #decodeField(typeInfo, value) {
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#decodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {type, template} = typeInfo

            return this.decodeFields(RLP.decode(value), template)
        }

        return this.primEncoder.decode(typeInfo, value)
    }

    encode(message) {
        // console.log('FieldsEncoder message:', message)
        const template = TEMPLATES[message.tag][message.vsn]
        const encodedFields = this.encodeFields(message, template)

        return RLP.encode(encodedFields)
    }

    decode(tag, data) {
        const fieldsBin = RLP.decode(data)
        const [vsn] = fieldsBin
        const template = TEMPLATES[tag][vsn]

        return this.decodeFields(fieldsBin, template)
    }

    /**
     * Encode data fields according to a template
     *
     * @param {object} data - An object with field => value items
     * @param {object} template - An object with field => type items
     * @returns {array} A poisioned array of encoded fields with preserved order
    */
    encodeFields(data, template) {
        const chunks = []

        for (const field in template) {
            const type = template[field]
            // console.log('encode filed iter: ', field, type, data[field])
            const encoded = this.#encodeField(type, data[field])

            chunks.push(encoded)
        }

        return chunks
    }

    /**
     * Decode data fields according to a template
     *
     * @param {array} data - An array with positioned values according to the template
     * @param {object} template - An object with field => type items
     * @returns {object} An object with decoded field => value items
    */
    decodeFields(data, template) {
        // console.log('decodeFields', data, template)
        let chunks = {}
        let idx = 0

        for (const field in template) {
            const type = template[field]
            chunks[field] = this.#decodeField(type, data[idx])
            idx++
        }

        return chunks
    }
}
