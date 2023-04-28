import Constants from './Constants.js'

export default class KeyBlockMessage {
    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get name() {
        return 'key_block'
    }

    get tag() {
        return Constants.MSG_KEY_BLOCK
    }

    get vsn() {
        return Constants.KEY_BLOCK_VSN
    }

    get version() {
        return this.fields.version
    }

    get height() {
        return this.fields.height
    }

    get beneficiary() {
        return this.fields.beneficiary
    }

    get info() {
        return this.fields.info
    }

    get time() {
        return this.fields.time
    }
}
