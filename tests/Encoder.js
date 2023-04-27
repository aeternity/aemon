import test from 'ava'
import Encoder from '../src/Encoder.js'
import ChainObject from '../src/ChainObjects/ChainObject.js'

const encoder = new Encoder()
const headerData = new Uint8Array([
    0,   0,   0,   5,   0,   0,   0,   0,   0,   0,   0,   0,
    0,  11, 169, 218, 134, 224, 207,  49, 215, 188, 237,   5,
   52, 106, 143,  87, 231,   7, 116, 198,  81, 166, 190, 120,
  188, 188, 174, 151, 163, 157,   9,  93,  85, 124, 231,  58,
   42,  69, 161,  54,  12,  19, 249, 133, 120,  62,  14, 178,
  156,  80,  61, 183,  90, 139, 110, 227,  53, 232,  30, 211,
    0, 160, 146, 222,  70, 138, 159, 252, 135, 159, 144,  33,
  219, 211, 236,   2,  68,  31, 201,  37, 232, 189,  87, 187,
  179, 215,   9, 196,  41, 148, 100,  27, 108, 203,  69, 114,
   86,  63, 147, 154, 254,   8, 103,  57, 217,  13, 147,  88,
   73, 220, 169, 206, 188, 150, 219, 195, 148, 166,  78, 216,
   23, 204, 141, 102, 222,  57, 242,   3, 234,  65, 153,  28,
    0,   0,   1, 135, 157, 164,   3,  27, 236, 110, 135,  89,
   25, 223, 145, 182, 192, 120,  77,  56,  75,  95, 211, 189,
   13, 192, 229, 204,  97, 210,  32,  61, 223, 206, 171,  76,
  245,  36, 126,  61,  28,  44, 103, 212,   8, 132,  95, 112,
  239, 182, 172,  57, 195,  86, 238, 130, 216, 216, 169,  84,
   95,   5,  92, 224, 110, 185, 235, 230, 238,  39,  98,  12
])

const txData = new Uint8Array([
  248, 213,  12,   1, 161,   1, 234, 108, 123, 148,  81, 247,
  177,  44, 175, 199,  65, 254,  34, 194, 169, 172,  35,  70,
  135, 146, 156,  22,   7, 104,  16,  11,  42,  67,  76, 117,
   41,   3, 161,   1, 234, 108, 123, 148,  81, 247, 177,  44,
  175, 199,  65, 254,  34, 194, 169, 172,  35,  70, 135, 146,
  156,  22,   7, 104,  16,  11,  42,  67,  76, 117,  41,   3,
  130,  78,  32, 134,  17, 141, 161, 164, 232,   0, 131,  11,
  179,  59, 131, 137, 190,  62, 184, 123,  55,  54,  54,  55,
   54,  57,  58, 107, 104,  95,  99,  77, 104,  68,  74, 116,
   68,  54,  77, 122, 117,  89,  99, 120,  83, 100, 102, 114,
   86,  56, 102, 121,  75,  49,  87,  51, 117,  49, 100, 116,
  111, 122,  76, 112,  76, 107,  74, 106,  85,  86, 113, 114,
   57, 105,  51, 101, 102, 115,  49,  58, 109, 104,  95, 120,
   77,  97,  98,  51,  77,  80, 101, 109,  76, 105,  51,  68,
   74,  81, 120, 116,  90,  87, 110,  89,  76, 122, 120,  88,
   98,  88,  89, 113,  51, 103,  90, 100,  99, 110,  65,  78,
   74,  85,  56, 105,  97,  86,  77,  72, 112, 100,  57,  54,
   58,  49,  54,  56,  50,  52,  49,  49,  52,  48,  48
])

const tx = new ChainObject('spend_tx', {
    amount: 20000n,
    fee: 19300000000000n,
    nonce: 9027134n,
    payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g==',
    recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
    sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
    ttl: 766779n,
})

const fields = {
    version: ['uint_32', 4],
    flags: ['uint_32', 4],
    height: ['uint_64', 8],
    prevHash: ['micro_block_hash', 32],
    prevKeyHash: ['key_block_hash', 32],
    stateHash: ['block_state_hash', 32],
    txsHash: ['block_tx_hash', 32],
    time: ['uint_64', 8],
    // fraudHash: ['block_pof_hash', 32],
    signature: ['signature', 64],
}

const block = {
    version: 5n,
    flags: 0n,
    height: 764378n,
    prevHash: 'mh_22QHLLfgj6Sgts86q8R5S7Zn2qhKB8c7ptceoe31BkHfPgTB8V',
    prevKeyHash: 'kh_KcnKDpof7uRDx4B61AL4HEHFzzY9gz89MqZfcCEgriQvLTNa1',
    stateHash: 'bs_22jKGeGojfovDFdpawQ2n1A3TVwGsmTHbv2C4X39qwjLV7ywdJ',
    txsHash: 'bx_2vsvoLsbYmTop5Xu1QzLixs4z5CDr2NRU7jz4nPsXdYw1MebYa',
    time: 1681976984347n,
    signature: 'sg_Xw4GLQZicTsHhUJWM4earB9mUtRuqZFfkSUHF3FQawfpUJawFBiV9YtoMWtHuSu4UbRJcfpHhnvZzE9mxDktFxkMG2nZM',
}

test('Encode', t => {
    t.deepEqual(
        headerData,
        encoder.encode(block, fields),
    )
})

test('Decode', t => {
    t.deepEqual(
        encoder.decode(headerData, fields),
        block
    )
})

test('Encode Object', t => {
    t.deepEqual(
        encoder.decodeObject(txData),
        tx
    )
})
