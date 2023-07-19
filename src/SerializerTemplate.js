const objMap = (obj, fn) => {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
        return [k, fn(k, v)]
    }))
}

//BinaryFieldsEncoder?
export default class SerializerTemplate {
    constructor(encoders, decoders) {
        this.encoders = encoders
        this.decoders = decoders
    }

    //toBinaryTemplate
    getTemplate(template) {
        return objMap(template, (k, v) => {
            if (Array.isArray(v)) {
                if (typeof v[0] === 'object') {
                    return v.map(e => {
                        return this.getTemplate(e)
                    })                    
                }

                return v.map(e => this.decoders.hasOwnProperty(e) ? 'binary' : e)
            }

            // POJO check
            if (Object.getPrototypeOf(v) === Object.prototype) {
                return this.getTemplate(v)
            }

            return this.decoders.hasOwnProperty(v) ? 'binary' : v
        })
    }

    fieldsToBinary(template, data) {
        return objMap(template, (field, type) => {
            const value = data[field]
            if (Array.isArray(type)) {
                return value.map(v => this.fieldsToBinary(type[0], v))
            }

            return this.encoders.hasOwnProperty(type) ? this.encoders[type](value) : value
        })
    }

    binaryToFields(template, data) {
        const transformed = objMap(template, (field, type) => {
            const value = data[field]
            if (Array.isArray(type)) {
                const itemType = type[0]
                if (typeof itemType === 'object') {
                    return value.map(v => this.binaryToFields(itemType, v))
                }

                return value.map(v => this.decoders.hasOwnProperty(itemType) ? this.decoders[itemType](v) : v)
            }

            // POJO check
            if (Object.getPrototypeOf(type) === Object.prototype) {
                return this.getTemplate(value)
            }

            return this.decoders.hasOwnProperty(type) ? this.decoders[type](value) : value
        })

        return {...data, ...transformed}
    }
}
