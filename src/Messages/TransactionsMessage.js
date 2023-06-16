import Message from './Message.js'

export default class TransactionsMessage extends Message {
    constructor(transactions) {
        super('txs')

        this.transactions = transactions
    }
}
