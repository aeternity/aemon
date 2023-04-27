import Constants from './Constants.js'

export default class TransactionsMessage {
    constructor(transactions) {
        this.transactions = transactions
    }

    get name() {
        return 'txs'
    }

    get tag() {
        return Constants.MSG_TXS
    }

    get vsn() {
        return Constants.TXS_VSN
    }
}
