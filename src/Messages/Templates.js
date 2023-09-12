import Constants from './Constants.js'

export default Object.freeze({
    [Constants.MSG_RESPONSE]: {
        1: {
            vsn: 'int',
            success: 'bool',
            messageType: 'int',
            errorReason: 'binary',
            message: 'binary',
        }
    },
    [Constants.MSG_CLOSE]: {
        1: {
            vsn: 'int',
        }
    },
    [Constants.MSG_GET_NODE_INFO]: {
        1: {
            vsn: 'int',
        }
    },
    [Constants.MSG_NODE_INFO]: {
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
    [Constants.MSG_GET_GENERATION]: {
        1: {
            vsn: 'int',
            hash: 'binary',
            forward: 'bool',
        }
    },
    [Constants.MSG_PING]: {
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
    [Constants.MSG_TXS]: {
        1: {
            vsn: 'int',
            transactions: ['binary'],
        }
    },
    [Constants.MSG_MICRO_BLOCK]: {
        1: {
            vsn: 'int',
            microBlock: 'binary',
            light: 'bool',
        }
    },
    [Constants.MSG_KEY_BLOCK]: {
        1: {
            vsn: 'int',
            keyBlock: 'binary',
        }
    },
    [Constants.MSG_GENERATION]: {
        1: {
            vsn: 'int',
            keyBlock: 'binary',
            microBlocks: ['binary'],
            forward: 'bool',
        }
    }
})
