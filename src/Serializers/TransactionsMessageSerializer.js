import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import TransactionsMessage from '../Messages/TransactionsMessage.js'

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
        const [_vsn, txsData] = RLP.decode(data)
        const transactions = txsData.map(tx => this.encoder.decodeField('object', tx))

        return new TransactionsMessage(transactions)
    }
}
