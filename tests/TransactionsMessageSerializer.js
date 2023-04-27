import test from 'ava'
import Encoder from '../src/Encoder.js'
import ChainObject from '../src/ChainObjects/ChainObject.js'
import PrimitivesEncoder from '../src/PrimitivesEncoder.js'
import TransactionsMessageSerializer from '../src/Serializers/TransactionsMessageSerializer.js'
import TransactionsMessage from '../src/Messages/TransactionsMessage.js'

const serializer = new TransactionsMessageSerializer(new Encoder())
const message = new TransactionsMessage([
    new ChainObject('signed_tx', {
        transaction:         new ChainObject('spend_tx', {
            amount: 20000n,
            fee: 19300000000000n,
            nonce: 9027134n,
            payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g==',
            recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
            sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
            ttl: 766779n,
        }),
        signatures: ['sg_aCYXPaanvbRGNxK6n2UcYv2WxpU8uPEAN7KTK7xWZV8A94WusQCWwcSSgKweRspaEtcygaoRkQ9u7n2s2mcgknxZYJ96V']
    })
])

const data = new Uint8Array([
  249,   1,  41,   1, 249,   1,  37, 185,   1,  34, 249,   1,
   31,  11,   1, 248,  66, 184,  64, 253, 194, 139, 240,  16,
  159, 222,  79, 103, 182,   9, 225, 200,  99, 135,  77,  49,
  164,  79, 188, 175, 148, 205, 219,  37,  14, 248,  28, 254,
   12,   1,  40, 246, 170, 250, 122,  96, 135, 165, 115,  71,
   69, 115,  35,  69,  63, 127, 253,  52, 183, 115, 197,   9,
   68,  53, 204, 140, 246,  51,  43, 231,  53,  48,  12, 184,
  215, 248, 213,  12,   1, 161,   1, 234, 108, 123, 148,  81,
  247, 177,  44, 175, 199,  65, 254,  34, 194, 169, 172,  35,
   70, 135, 146, 156,  22,   7, 104,  16,  11,  42,  67,  76,
  117,  41,   3, 161,   1, 234, 108, 123, 148,  81, 247, 177,
   44, 175, 199,  65, 254,  34, 194, 169, 172,  35,  70, 135,
  146, 156,  22,   7, 104,  16,  11,  42,  67,  76, 117,  41,
    3, 130,  78,  32, 134,  17, 141, 161, 164, 232,   0, 131,
   11, 179,  59, 131, 137, 190,  62, 184, 123,  55,  54,  54,
   55,  54,  57,  58, 107, 104,  95,  99,  77, 104,  68,  74,
  116,  68,  54,  77, 122, 117,  89,  99, 120,  83, 100, 102,
  114,  86,  56, 102, 121,  75,  49,  87,  51, 117,  49, 100,
  116, 111, 122,  76, 112,  76, 107,  74, 106,  85,  86, 113,
  114,  57, 105,  51, 101, 102, 115,  49,  58, 109, 104,  95,
  120,  77,  97,  98,  51,  77,  80, 101, 109,  76, 105,  51,
   68,  74,  81, 120, 116,  90,  87, 110,  89,  76, 122, 120,
   88,  98,  88,  89, 113,  51, 103,  90, 100,  99, 110,  65,
   78,  74,  85,  56, 105,  97,  86,  77,  72, 112, 100,  57,
   54,  58,  49,  54,  56,  50,  52,  49,  49,  52,  48,  48
])

test('Deserialize Transactions message', t => {
    t.deepEqual(
        serializer.deserialize(data),
        message
    )
})
