import ObjectTags from './ObjectTags.js'

export default class Transaction {
    constructor(name, fields) {
        const NAME = name.toUpperCase()

        this.name = name
        this.fields = fields
        this.tag = ObjectTags[NAME + '_TX']
    }
}
