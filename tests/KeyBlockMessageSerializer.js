import test from 'ava'
import Encoder from '../src/Encoder.js'
import KeyBlockMessageSerializer from '../src/Serializers/KeyBlockMessageSerializer.js'
import KeyBlockMessage from '../src/Messages/KeyBlockMessage.js'

const serializer = new KeyBlockMessageSerializer(new Encoder())
const message = new KeyBlockMessage({
    beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
    flags: 3221225472n,
    height: 767477n,
    info: 690n,
    miner: 'ak_25LNFMwQTijP3UWv53WvmLLgNUxcpiqteJ5dgJaHfQHXe1n8KH',
    nonce: 16763573506821029832n,
    pow: Uint8Array.from(Buffer.from(
`000dce6101b64e17028fd37902a8cd5e035d3356047f767404fdd20e05349a79\
060943310711f6bb07d21de5082a9a7409aa131409c822f00a1299e90b17b078\
0c2323800cc2e4680d343dd10d3bf5e00dddceac0df5daa80eb8de580f31e446\
10e8fd99131f3c4a150a363d151c598c15228803175c8cc9175f00a417ca693c\
18e39dc619d9a5701a26c3211a4e9eeb1b2123d91b3774181d4b04181dab257e\
1e62a78f1e6bb56d`
    , 'hex')),
    prevHash: 'mh_2cty9YZ1QikpU9yQ3KBsPAGoXiqkSsdhAGAVZhV2eJ76ct1eWD',
    prevKeyHash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
    stateHash: 'bs_SuaTBC7gRFdbsgAvKJ1p4irvHfcbttovoLfqkmdSxi3mHND5y',
    target: 553713663n,
    time: 1682683859810n,
    version: 5n,
})
const data = new Uint8Array([
  249,   1, 116,   1, 185,   1, 112,   0,   0,   0,   5, 192,
    0,   0,   0,   0,   0,   0,   0,   0,  11, 181, 245, 213,
   51, 205, 168,   8, 248,  88, 254,  15,  86, 154, 248, 207,
   16,  87,  40,  15,  41, 144,  18,  92, 151,  40,  64, 132,
  149, 125,  94,  42, 158, 181,  86, 112,  97, 254,  85, 187,
  122, 167, 155,  35,  70,  15, 210, 159, 255,  80,  30, 164,
  185, 140,  18,  72,  84, 141,   0, 120,   4, 196, 116,  72,
  243,  64,   2,  58, 210, 232, 251, 225, 225,  98, 183,  95,
  249, 106,  74, 207, 207,  31, 232,  54, 195, 214,  21, 245,
  193,  99, 128, 148,  90,   3, 122, 146, 150, 209, 175, 141,
  137, 104, 128, 232, 115,  19,  76,  25,  22, 129, 151, 229,
  172,  44,  46,  84, 117, 106,  12, 246, 192,  13, 189,   8,
   77, 176,   0, 109, 136, 244, 250, 225,  50, 184, 241, 221,
  183, 160,  78,  99, 183, 250, 150,  71, 154,  84, 187, 197,
   37, 165,  49, 167, 241, 188,  12, 228, 146,  18,  25,   3,
    6, 127, 176,  33,   0, 255, 255,   0,  13, 206,  97,   1,
  182,  78,  23,   2, 143, 211, 121,   2, 168, 205,  94,   3,
   93,  51,  86,   4, 127, 118, 116,   4, 253, 210,  14,   5,
   52, 154, 121,   6,   9,  67,  49,   7,  17, 246, 187,   7,
  210,  29, 229,   8,  42, 154, 116,   9, 170,  19,  20,   9,
  200,  34, 240,  10,  18, 153, 233,  11,  23, 176, 120,  12,
   35,  35, 128,  12, 194, 228, 104,  13,  52,  61, 209,  13,
   59, 245, 224,  13, 221, 206, 172,  13, 245, 218, 168,  14,
  184, 222,  88,  15,  49, 228,  70,  16, 232, 253, 153,  19,
   31,  60,  74,  21,  10,  54,  61,  21,  28,  89, 140,  21,
   34, 136,   3,  23,  92, 140, 201,  23,  95,   0, 164,  23,
  202, 105,  60,  24, 227, 157, 198,  25, 217, 165, 112,  26,
   38, 195,  33,  26,  78, 158, 235,  27,  33,  35, 217,  27,
   55, 116,  24,  29,  75,   4,  24,  29, 171,  37, 126,  30,
   98, 167, 143,  30, 107, 181, 109, 232, 164,  45,  73, 136,
   55, 127, 200,   0,   0,   1, 135, 199, 198,  19,  98,   0,
    0,   2, 178
])

test('Deserialize Key Block message', t => {
    t.deepEqual(
        serializer.deserialize(data),
        message
    )
})
