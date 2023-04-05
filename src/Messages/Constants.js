export default Object.freeze({
    MSG_FRAGMENT: 0,
    MSG_P2P_RESPONSE: 100,
    MSG_PING: 1,
    MSG_PING_RSP: 2,
    MSG_GET_HEADER_BY_HASH: 3,
    MSG_HEADER: 4,
    MSG_GET_N_SUCCESSORS: 5,
    MSG_HEADER_HASHES: 6,
    MSG_GET_BLOCK_TXS: 7,
    MSG_GET_GENERATION: 8,
    MSG_TXS: 9,
    MSG_BLOCK_TXS: 13,
    MSG_KEY_BLOCK: 10,
    MSG_MICRO_BLOCK: 11,
    MSG_GENERATION: 12,
    MSG_GET_HEADER_BY_HEIGHT: 15,
    MSG_GET_NODE_INFO: 125,
    MSG_NODE_INFO: 126,
    MSG_CLOSE: 127,

    MSG_TX_POOL_SYNC_INIT:   20,
    MSG_TX_POOL_SYNC_UNFOLD: 21,
    MSG_TX_POOL_SYNC_GET:    22,
    MSG_TX_POOL_SYNC_FINISH: 23,

    RESPONSE_VSN: 1,
    PING_VSN: 1,
    GET_MEMPOOL_VSN: 1,
    MEMPOOL_VSN: 1,
    GET_HEADER_BY_HASH_VSN: 1,
    GET_HEADER_BY_HEIGHT_VSN: 2,
    HEADER_VSN: 1,
    GET_N_SUCCESSORS_VSN: 2,
    HEADER_HASHES_VSN: 1,
    GET_BLOCK_TXS_VSN: 1,
    GET_GENERATION_VSN: 1,
    KEY_BLOCK_VSN: 1,
    MICRO_BLOCK_VSN: 1,
    GENERATION_VSN: 1,
    TXS_VSN: 1,
    BLOCK_TXS_VSN: 1,
    PEER_VSN: 1,

    TX_POOL_SYNC_INIT_VSN:   1,
    TX_POOL_SYNC_UNFOLD_VSN: 1,
    TX_POOL_SYNC_GET_VSN:    1,
    TX_POOL_SYNC_FINISH_VSN: 1,

    GET_NODE_INFO_VSN: 1,
    NODE_INFO_VSN: 1,
    CLOSE_VSN: 1,
})
