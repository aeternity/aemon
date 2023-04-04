import Constants from './Constants.js'

export default class ResponseMessage {
    constructor(success, messageType, errorReason, message) {
        this.success = !!success
        this.messageType = Number(messageType)
        this.errorReason = errorReason.toString()
        this.message = message
    }

    get name() {
        return 'response'
    }

    get vsn() {
        return Constants.RESPONSE_VSN
    }

    get tag() {
        return Constants.MSG_P2P_RESPONSE
    }

    get type() {
        if (!this.success) {
            return 'error'
        }

        return this.message.name
    }
}
