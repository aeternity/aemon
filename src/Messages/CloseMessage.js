import Constants from './Constants.js'

export default class CloseMessage {
    get name() {
        return 'close'
    }

    get tag() {
        return Constants.MSG_CLOSE
    }

    static get TAG() {
        return Constants.MSG_CLOSE
    }

    static get VERSION() {
        return Constants.CLOSE_VSN
    }

    encode(encoder) {
        return [
            ...encoder.encodeInt(CloseMessage.VERSION)
        ]
    }
}
