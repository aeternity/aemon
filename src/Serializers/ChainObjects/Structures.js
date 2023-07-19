export default Object.freeze({
    SIGNED_TX: {
        signatures: ['signature'],
        transaction: 'object',
    },
    SPEND_TX: {
        sender: 'id',
        recipient: 'id',
        amount: 'int',
        fee: 'int',
        ttl: 'int',
        nonce: 'int',
        payload: 'bytearray',
    },
    LIGHT_MICRO_BLOCK: {
        header: 'binary',
        txHashes: 'binary',
        pof: 'binary',
    }
})
