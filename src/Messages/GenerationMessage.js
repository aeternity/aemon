import Constants from './Constants.js'

export default class GenerationMessage {
    constructor(fields) {
        this.fields = fields
    }

    get name() {
        return 'generation'
    }

    get tag() {
        return Constants.MSG_GENERATION
    }

    get vsn() {
        return Constants.GENERATION_VSN
    }

    get keyBlock() {
        return this.fields.keyBlock
    }

    get microBlocks() {
        return this.fields.microBlocks
    }

    get forward() {
        return this.fields.forward
    }
}
