export default Object.freeze({
    ACCOUNT: {
        nonce: 'int',
        balance: 'int',
    },
    SIGNED_TX: {
        signatures: ['signature'],
        transaction: 'chain_object',
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
        header: {
            type: 'object',
            template: {
                version: 'uint_32',
                flags: 'uint_32',
                height: 'uint_64',
                prevHash: 'micro_block_hash',
                prevKeyHash: 'key_block_hash',
                stateHash: 'block_state_hash',
                txsHash: 'block_tx_hash',
                time: 'uint_64',
                // fraudHash: 'block_pof_hash',
                signature: 'signature',
            }
        },
        txHashes: ['tx_hash'],
        pof: 'binary',
    },
    MICRO_BLOCK_BODY: {
        txs: ['chain_object'],
        pof: 'binary'
    },
    MICRO_BLOCK: {
        header: {
            type: 'object',
            template: {
                version: 'uint_32',
                flags: 'uint_32',
                height: 'uint_64',
                prevHash: 'micro_block_hash',
                prevKeyHash: 'key_block_hash',
                stateHash: 'block_state_hash',
                txsHash: 'block_tx_hash',
                time: 'uint_64',
                // fraudHash: 'block_pof_hash',
                signature: 'signature',
            }
        },
        body: 'chain_object'
    },
    KEY_BLOCK: {
        version: 'uint_32',
        flags: 'uint_32',
        height: 'uint_64',
        prevHash: 'micro_block_hash',
        prevKeyHash: 'key_block_hash',
        stateHash: 'block_state_hash',
        miner: 'account_pubkey',
        beneficiary: 'account_pubkey',
        target: 'uint_32',
        pow: 'pow',
        nonce: 'uint_64',
        time: 'uint_64',
        //binary, but currently interpreted as int/node version
        info: 'uint_32'
    },
})
