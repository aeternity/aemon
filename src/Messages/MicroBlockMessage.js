import Constants from './Constants.js'

export default class MicroBlockMessage {
    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get name() {
        return 'micro_block'
    }

    get tag() {
        return Constants.MSG_MICRO_BLOCK
    }

    get vsn() {
        return Constants.MICRO_BLOCK_VSN
    }

    get version() {
        return this.fields.version
    }

    get height() {
        return this.fields.height
    }

    get time() {
        return this.fields.time
    }
}
