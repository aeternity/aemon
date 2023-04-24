import test from 'ava'
import Encoder from '../src/Encoder.js'
import KeyBlockMessageSerializer from '../src/Serializers/KeyBlockMessageSerializer.js'
import KeyBlockMessage from '../src/Messages/KeyBlockMessage.js'

const serializer = new KeyBlockMessageSerializer(new Encoder())
const message = new KeyBlockMessage({
    beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
    flags: 3221225472n,
    height: 764953n,
    info: 681n,
    miner: 'ak_rTxWpyj9HtZu8Gvv7Em6pTb49KCLHYBsyx6ERrXaMjpb2usGR',
    nonce: 10906880716505021731n,
    pow: Uint8Array.from(Buffer.from(
`00ad2827023b158a026ae7a903374204042c209c045d30ac04fa1b9c05271fe9\
0655d32b07878bff0b0551fa0b076e390b2e317b0b7c8cc70cd455b00cf13ec0\
0dc4e0dd0ee8e3a00ef090320f8bf980102637f3102e4432104c6b06106d9121\
10c1a2ad1348734813c1965c14103dd31434fe1c149f227415e7dcc916af1fe2\
191291ff192f0beb1939564219b852e719dbe15d19dff1da1b6abbfe1b85c709\
1e916ffc1ecdf67a`
    , 'hex')),
    prevHash: 'mh_2Y9qZKyLFg1meENV77baCVKYzsjUQe7FefyoTpTnYkgR6mw3LS',
    prevKeyHash: 'kh_Bs9RL9E9pb5pKbSopcvGn8HZH5tHAJFxPEwEyhRPaB4XVUYtS',
    stateHash: 'bs_2mjTTcpwiWPEtZ3ymLdCLz9E1nxMtUruJ1AtTu5Qpnyvb6QgN8',
    target: 541088177n,
    time: 1682081437798n,
    version: 5n,
})
const data = new Uint8Array([
    0,   0,   0,   5, 192,   0,   0,   0,   0,   0,   0,   0,
    0,  11, 172,  25, 202, 110, 109,  22,  33, 203,  18, 248,
    6, 153,  12, 217, 203, 242, 195, 161,  15, 202, 112, 144,
  240, 146,  13, 199, 246, 254, 215,  51,  15,  63,  83,  62,
   24, 171,  89, 210, 144, 254,  60, 148, 243, 119,   0, 176,
   22, 247, 253,  67,   4, 218, 124,  29, 232, 135, 222,  73,
   98,  97, 110,  59, 210,  79, 240, 152, 233,  67, 253,  27,
  255, 178, 166,  38,  60, 214, 103,  73, 140,  52, 187, 106,
   46, 122,  54,  86,  85,  62, 160, 232, 135, 236,  62,   1,
  188, 108,   7, 144, 112,  80, 218,  65, 247, 177, 242, 247,
   13,   2, 154,  30, 224,  47, 194, 126, 184,  21,  11, 136,
  113, 172,  65, 126, 194,  16, 240, 178, 207,  31,  69, 165,
  225,  50, 184, 241, 221, 183, 160,  78,  99, 183, 250, 150,
   71, 154,  84, 187, 197,  37, 165,  49, 167, 241, 188,  12,
  228, 146,  18,  25,   3,   6, 127, 176,  32,  64,  89, 177,
    0, 173,  40,  39,   2,  59,  21, 138,   2, 106, 231, 169,
    3,  55,  66,   4,   4,  44,  32, 156,   4,  93,  48, 172,
    4, 250,  27, 156,   5,  39,  31, 233,   6,  85, 211,  43,
    7, 135, 139, 255,  11,   5,  81, 250,  11,   7, 110,  57,
   11,  46,  49, 123,  11, 124, 140, 199,  12, 212,  85, 176,
   12, 241,  62, 192,  13, 196, 224, 221,  14, 232, 227, 160,
   14, 240, 144,  50,  15, 139, 249, 128,  16,  38,  55, 243,
   16,  46,  68,  50,  16,  76, 107,   6,  16, 109, 145,  33,
   16, 193, 162, 173,  19,  72, 115,  72,  19, 193, 150,  92,
   20,  16,  61, 211,  20,  52, 254,  28,  20, 159,  34, 116,
   21, 231, 220, 201,  22, 175,  31, 226,  25,  18, 145, 255,
   25,  47,  11, 235,  25,  57,  86,  66,  25, 184,  82, 231,
   25, 219, 225,  93,  25, 223, 241, 218,  27, 106, 187, 254,
   27, 133, 199,   9,  30, 145, 111, 252,  30, 205, 246, 122,
  151,  93,   6,  57, 122, 214, 253,  35,   0,   0,   1, 135,
  163, 221, 216, 102,   0,   0,   2, 169
])

test('Deserialize Key Block message', t => {
    t.deepEqual(
        serializer.deserialize(data),
        message
    )
})
