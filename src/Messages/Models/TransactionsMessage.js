import Message from './Message.js'

export default class TransactionsMessage extends Message {
    constructor(fields) {
        super('txs')

        Object.assign(this, fields)
    }
}
