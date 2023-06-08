import Constants from './Constants.js'

export default class GetGenerationMessage {
    constructor(fields) {
        this.fields = fields
    }

    get name() {
        return 'get_generation'
    }

    get tag() {
        return Constants.MSG_GET_GENERATION
    }

    get vsn() {
        return Constants.GET_GENERATION_VSN
    }

    get hash() {
        return this.fields.hash
    }

    get forward() {
        return this.fields.forward
    }
}
