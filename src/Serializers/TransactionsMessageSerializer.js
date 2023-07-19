import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import TransactionsMessage from '../Messages/TransactionsMessage.js'

const STRUCT = {
    vsn: 'int',
    transactions: ['object'],
}

export default class TransactionsMessageSerializer {
    static get TAG() {
        return Constants.MSG_TXS
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        throw new Error('Not implemented.')
    }

    deserialize(data) {
        const {transactions} = this.encoder.deserialize(STRUCT, data)

        return new TransactionsMessage(transactions)
    }
}
