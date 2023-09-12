import Constants from '../Messages/Constants.js'

export default Object.freeze({
    [Constants.MSG_RESPONSE]: {
        1: {
            vsn: 'int',
            success: 'bool',
            messageType: 'int',
            errorReason: 'binary',
            message: 'p2p_message',
        }
    },
    [Constants.MSG_GET_GENERATION]: {
        1: {
            vsn: 'int',
            hash: 'key_block_hash',
            forward: 'bool',
        }
    },
    [Constants.MSG_PING]: {
        1: {
            vsn: 'int',
            port: 'int',
            share: 'int',
            genesisHash: 'key_block_hash',
            difficulty: 'int',
            bestHash: 'key_block_hash',
            syncAllowed: 'bool',
            peers: [{
                type: 'object',
                template: {
                    host: 'string',
                    port: 'int',
                    publicKey: 'peer_pubkey',
                }
            }]
        }
    },
    [Constants.MSG_TXS]: {
        1: {
            vsn: 'int',
            transactions: ['chain_object'],
        }
    },
    [Constants.MSG_MICRO_BLOCK]: {
        1: {
            vsn: 'int',
            microBlock: 'chain_object',
            light: 'bool',
        }
    },
    [Constants.MSG_KEY_BLOCK]: {
        1: {
            vsn: 'int',
            keyBlock: {
                type: 'binary_chain_object',
                params: {
                    objectName: 'key_block',
                },
            },
        }
    },
    [Constants.MSG_GENERATION]: {
        1: {
            vsn: 'int',
            keyBlock: {
                type: 'binary_chain_object',
                params: {
                    objectName: 'key_block',
                },
            },
            microBlocks: [{
                type: 'binary_chain_object',
                params: {
                    objectName: 'micro_block',
                },
            }],
            forward: 'bool',
        }
    }
})
