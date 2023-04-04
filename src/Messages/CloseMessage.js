import Constants from './Constants.js'

export default class CloseMessage {
    get name() {
        return 'close'
    }

    get tag() {
        return Constants.MSG_CLOSE
    }

    get vsn() {
        return Constants.CLOSE_VSN
    }
}
