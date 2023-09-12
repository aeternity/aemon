import ObjectTags from './ObjectTags.js'

export default class ChainObject {
    constructor(name, fields) {
        this.name = name
        this.vsn = 1n

        Object.assign(this, fields)
    }

    get tag() {
        return ObjectTags[this.name.toUpperCase()]
    }
}
