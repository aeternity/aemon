export default class SignedTransaction {
    constructor(transaction, signatures) {
        this.transaction = transaction
        this.signatures = signatures
    }
}
