import RLP from 'rlp'
import Constants from './Constants.js'

export default class FragmentMessage {
    static get TAG() {
        return Constants.MSG_FRAGMENT
    }

    constructor(index, total, data) {
        if (data.length > (65536 - 6)) {
            throw new Error('Data size must be maximum of 65530 bytes')
        }

        if (index > 65535) {
            throw new Error('Index must be maximum of 65535')
        }

        if (total > 65535) {
            throw new Error('Total must be maximum of 65535')
        }

        this.index = index
        this.total = total
        this.data = data
    }

    get tag() {
        return Constants.MSG_FRAGMENT
    }
}
