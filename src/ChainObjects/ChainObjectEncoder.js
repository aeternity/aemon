import ChainObject from './ChainObject.js'
import Templates from './ChainObjectTemplates.js'
import PrimitivesEncoder from '../PrimitivesEncoder.js'

export default class ChainObjectEncoder {
    /**
     * @param {FieldsEncoder} fieldsEncoder
    */
    constructor(fieldsEncoder) {
        this.fieldsEncoder = fieldsEncoder
        this.primEncoder = new PrimitivesEncoder()
    }

    encode(object) {
        const {name, vsn} = object
        const template = Templates[name.toUpperCase()][vsn]

        if (template === undefined) {
            throw new Error(`Unsupported template version "${vsn}" for object type "${name}"`)
        }

        const encoded = this.fieldsEncoder.encodeFields(object, template)

        return new Uint8Array(encoded.flatMap(e => [...e]))
    }

    // Decoding a fixed size object
    // alternative compared to fields based decoding above
    // works based on object field sizes used to split on fields
    decode(name, data) {
        // version field is 4 bytes and should be always first
        // note that it may exists other objects with different version size?
        const vsn = this.primEncoder.decode('uint_32', data.slice(0, 4))

        const template = Templates[name.toUpperCase()][vsn]
        const binaryFields = this.fieldsEncoder.splitFields(data, template)
        const fields = this.fieldsEncoder.decodeFields(binaryFields, template)

        return new ChainObject(name, fields)
    }
}
