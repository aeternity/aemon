import FieldEncoder from '../ChainObjects/FieldEncoder.js'

const objMap = (obj, fn) => {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
        return [k, fn(k, v)]
    }))
}

export default class TemplateFieldsEncoder {
    constructor(additionalEncoders, additionalDecoders) {
        this.fieldEncoder = new FieldEncoder(additionalEncoders, additionalDecoders)
    }

    fieldsToBinary(template, data) {
        return objMap(template, (field, type) => this.#fieldToBinary(type, data[field]))
    }

    binaryToFields(template, data) {
        const transformed = objMap(template, (field, type) => this.#binaryToField(type, data[field]))

        return {...data, ...transformed}
    }

    #fieldToBinary(typeInfo, value) {
        let type = typeInfo
        let template = {}
        let params = {}

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            ({type, template, params} = typeInfo)
        }

        if (Array.isArray(type)) {
            return value.map(v => this.#fieldToBinary(type[0], v))
        }

        // POJO check
        if (type === 'object') {
            return this.fieldsToBinary(template, value)
        }

        // console.log('fieldToBinary encode', type, value, params)

        return this.fieldEncoder.encode(type, value, params)
    }

    #binaryToField(typeInfo, value) {
        let type = typeInfo
        let template = {}
        let params = {}

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            ({type, template, params} = typeInfo)
        }

        if (Array.isArray(type)) {
            return value.map(v => this.#binaryToField(type[0], v))
        }

        if (type === 'object') {
            return this.binaryToFields(template, value)
        }

        // console.log('binaryToField decode', type, value, params)

        return this.fieldEncoder.decode(type, value, params)
    }
}
