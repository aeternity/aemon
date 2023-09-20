import Tags from '../MessageTags.js'

export default Object.freeze({
    [Tags.MSG_RESPONSE]: {
        1: {
            vsn: 'int',
            success: 'bool',
            messageType: 'int',
            errorReason: 'binary',
            message: 'binary',
        }
    },
    [Tags.MSG_CLOSE]: {
        1: {
            vsn: 'int',
        }
    },
    [Tags.MSG_GET_NODE_INFO]: {
        1: {
            vsn: 'int',
        }
    },
    [Tags.MSG_NODE_INFO]: {
        1: {
            vsn: 'int',
            version: 'string',
            revision: 'string',
            vendor: 'string',
            os: 'string',
            networkId: 'string',
            verifiedPeers: 'int',
            unverifiedPeers: 'int',
        }
    },
    [Tags.MSG_GET_GENERATION]: {
        1: {
            vsn: 'int',
            hash: 'binary',
            forward: 'bool',
        }
    },
    [Tags.MSG_PING]: {
        1: {
            vsn: 'int',
            port: 'int',
            share: 'int',
            genesisHash: 'binary',
            difficulty: 'int',
            bestHash: 'binary',
            syncAllowed: 'bool',
            peers: 'binary',
            peers: [{
                type: 'object',
                template: {
                    host: 'string',
                    port: 'int',
                    publicKey: 'binary',
                }
            }]
        }
    },
    [Tags.MSG_TXS]: {
        1: {
            vsn: 'int',
            transactions: ['binary'],
        }
    },
    [Tags.MSG_MICRO_BLOCK]: {
        1: {
            vsn: 'int',
            microBlock: 'binary',
            light: 'bool',
        }
    },
    [Tags.MSG_KEY_BLOCK]: {
        1: {
            vsn: 'int',
            keyBlock: 'binary',
        }
    },
    [Tags.MSG_GENERATION]: {
        1: {
            vsn: 'int',
            keyBlock: 'binary',
            microBlocks: ['binary'],
            forward: 'bool',
        }
    }
})
