import test from 'ava'
import Encoder from '../src/Encoder.js'
import MicroBlockMessageSerializer from '../src/Serializers/MicroBlockMessageSerializer.js'
import MicroBlockMessage from '../src/Messages/MicroBlockMessage.js'

const serializer = new MicroBlockMessageSerializer(new Encoder())
const message = new MicroBlockMessage({
    version: 5n,
    flags: 0n,
    height: 766360n,
    prevHash: 'mh_2PQiVSEG1Yhjc9mNZxdjEEHoSaeSptXPJ9RV8VcMHuB59zxwGJ',
    prevKeyHash: 'kh_oakHZhkqsPWGdF7y5xUhPHYUEsgUqUJ1bqtauktFrhsm2rsgZ',
    stateHash: 'bs_21KHSDxPEqGJ7KRnA9KnHVZCcTyoNPK4H6EccLvbpfRs9NbDRS',
    txsHash: 'bx_2c3zuFEBtZHFhiF4eYa83b393gdrC6WNG4aiFwV6fHNSx74c2U',
    time: 1682334788843n,
    signature: 'sg_Vh5woKt2662tGdUGVd1r1Fee3wZCq5qFXG6uMv7yJLyTxNhHrtmueYjem46QK5byQYYccEXefhS1C2kgZJRPm2vKaB3fy'
})
const data = new Uint8Array([
  249,   1,   6,   1, 185,   1,   1, 248, 255, 102,   5, 184,
  216,   0,   0,   0,   5,   0,   0,   0,   0,   0,   0,   0,
    0,   0,  11, 177, 152, 182, 148,   5, 159, 169, 124,  30,
  142, 164, 157, 208,  64, 190, 205, 157,  82,  45, 240, 243,
  244, 208,  84,  47,  13, 125,  18,  54, 101, 246, 178,  14,
  242, 105, 197,  14,  84,  84,  48, 248, 195,  37, 214, 221,
   22, 172,  48,  15, 200,  37,  79,  38, 127, 230,   6,  44,
   76,  54, 149,  62,  88, 123, 123, 160, 227, 132, 105, 111,
  241, 174, 219, 181, 152,   8, 223, 253, 255, 131,  37,  26,
  204,  46, 152, 107,  81, 156,  56, 174, 203, 198, 181,  25,
  227, 246,  91, 203,  47, 211,  73,   6, 137,  70,   7,  78,
  103, 120,  80,  54, 100, 111, 133,  46,  20,  96, 175,  10,
  134,  70, 146, 157, 231, 164,  50,  76, 191, 150, 169, 139,
   57,   0,   0,   1, 135, 178, 247, 172, 235, 219,  77, 169,
  213, 178, 144,  40, 208,  73,  85,  13, 121, 151,  95, 221,
   21,  36,  83, 113,  92,  19, 209, 149, 159,  59,  61, 141,
  181, 248, 250,  47, 141, 107, 174,   0, 151, 147, 107,  11,
   32, 110,  55, 130, 222, 251,  15, 199,  26,  89, 249, 119,
  235, 124, 213, 199,  10,  74,  68,  63,   4, 103,  15,  68,
    2, 225, 160,  75, 114,  24, 142,  92, 241, 114,  21, 171,
   56, 116, 155, 149,  77, 138,   7, 231, 103, 189, 136, 144,
  227,  84, 121, 217,  46, 190, 154,  26,   2, 240, 148, 192,
    1
])

test('Deserialize Micro Block message', t => {
    t.deepEqual(
        serializer.deserialize(data),
        message
    )
})
