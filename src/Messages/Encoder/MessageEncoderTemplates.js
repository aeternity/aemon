import Tags from '../MessageTags.js'

export default Object.freeze({
    [Tags.MSG_RESPONSE]: {
        1: {
            vsn: 'int',
            success: 'bool',
            messageType: 'int',
            errorReason: 'binary',
            message: 'p2p_message',
        }
    },
    [Tags.MSG_GET_GENERATION]: {
        1: {
            vsn: 'int',
            hash: 'key_block_hash',
            forward: 'bool',
        }
    },
    [Tags.MSG_PING]: {
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
    [Tags.MSG_TXS]: {
        1: {
            vsn: 'int',
            transactions: ['chain_object'],
        }
    },
    [Tags.MSG_MICRO_BLOCK]: {
        1: {
            vsn: 'int',
            microBlock: 'chain_object',
            light: 'bool',
        }
    },
    [Tags.MSG_KEY_BLOCK]: {
        1: {
            vsn: 'int',
            keyBlock: 'key_block',
        }
    },
    [Tags.MSG_GENERATION]: {
        1: {
            vsn: 'int',
            keyBlock: 'key_block',
            microBlocks: ['micro_block'],
            forward: 'bool',
        }
    }
})
