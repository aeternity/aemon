import test from 'ava'
import Encoder from '../src/Encoder.js'
import GenerationMessageSerializer from '../src/Serializers/GenerationMessageSerializer.js'
import GenerationMessage from '../src/Messages/GenerationMessage.js'

const serializer = new GenerationMessageSerializer(new Encoder())
const message = new GenerationMessage({
    forward: false,
    keyBlock: {
        version: 5n,
        flags: 3221225472n,
        height: 500000n,
        prevHash: 'mh_25mm2bobYqY1MCqPT2GxPkC6h1xc1CwqJ7LacypWMfSHqahdrH',
        prevKeyHash: 'kh_2vM3MUrRZTm6WpUkZtsZwbmZ5gkP3UN8PgaH3PpiarSsXkJgDN',
        stateHash: 'bs_VnnB92J1JHHgC3Xv71d4uwgbCPr8QLK8332iTUVDCvuHe1PTn',
        miner: 'ak_2jyHh9dxmW17CksxuY8udRZ7ZDYT2sqBm12tJ9oqUNzS5DZhpt',
        beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
        target: 543061122n,
        pow: new Uint8Array([
           0, 114,  22, 232,  2,  49, 131, 133,  2,  68,  34,  63,
           3,  21, 157, 191,  4, 142, 162, 218,  4, 247,  39,  59,
           5,  58,  66, 255,  5, 202, 218, 177,  6,   7, 204, 152,
           7,  57,  85, 203,  7, 115,  76, 113,  8, 111, 237, 254,
           8, 172, 185, 170,  9,  68, 113, 233,  9, 252,  97, 188,
          10, 179,  72,  11, 11,  65,   1,  25, 11, 148,  99,  94,
          14, 217,  45, 230, 18, 149, 126, 215, 19,  95,  48, 193,
          19, 191, 219,  78, 20,  25,  43,  60, 20,  68, 180,  54,
          20, 204,  77,  41, 20, 219, 166, 151, 22,  95, 244,  25,
          22, 128, 217, 234, 22, 186, 185,   4, 22, 236,   6, 103,
          23,   1, 146, 197, 23,  63, 117, 165, 23, 168, 221,  35,
          24, 211, 101,   1, 25, 208, 253, 116, 26,  77,  98,   8,
          27,  89, 150, 169, 27, 202, 190, 169, 28,  49, 170,  89,
          28, 186, 168, 250, 29,  93, 195, 237, 31, 121, 101,  70
        ]),
        nonce: 15970349912862235774n,
        time: 1633582271742n,
        info: 630n
    }
})
const data = new Uint8Array([
  249,  12, 176,   1, 185,   1, 112,   0,   0,   0,   5, 192,
    0,   0,   0,   0,   0,   0,   0,   0,   7, 161,  32, 142,
  135, 229,  89,  68, 219,  16,   6,  71,  97,  34,  43, 251,
  114, 162, 181, 124,  46,  53, 125,  11,   2, 252,  60, 205,
  221,  56, 232, 126, 166, 137, 251, 252, 210, 218,  26,  55,
   38, 104,  54, 249, 133,  49,  16, 215, 200,  73, 158, 140,
  165, 141, 111, 232,  46,  17, 244,  10, 187, 235,  22, 246,
   44, 146,  88,  65,  94, 158, 144, 174,  34,   6,  25, 132,
  188,  74, 226, 169, 160,  32,  72, 128, 197, 183, 217,  13,
  124,  68,  19, 165, 234,  84,  43, 245,  61, 233,  23, 229,
   68,  13,  30, 118, 242, 137, 113, 102, 250, 233, 184,  15,
   83, 187,  85, 106, 225,  47,  19,  70, 120,  66, 172,  15,
  195, 250,  26, 238,  20,  46, 183, 225,  50, 184, 241, 221,
  183, 160,  78,  99, 183, 250, 150,  71, 154,  84, 187, 197,
   37, 165,  49, 167, 241, 188,  12, 228, 146,  18,  25,   3,
    6, 127, 176,  32,  94, 116, 130,   0, 114,  22, 232,   2,
   49, 131, 133,   2,  68,  34,  63,   3,  21, 157, 191,   4,
  142, 162, 218,   4, 247,  39,  59,   5,  58,  66, 255,   5,
  202, 218, 177,   6,   7, 204, 152,   7,  57,  85, 203,   7,
  115,  76, 113,   8, 111, 237, 254,   8, 172, 185, 170,   9,
   68, 113, 233,   9, 252,  97, 188,  10, 179,  72,  11,  11,
   65,   1,  25,  11, 148,  99,  94,  14, 217,  45, 230,  18,
  149, 126, 215,  19,  95,  48, 193,  19, 191, 219,  78,  20,
   25,  43,  60,  20,  68, 180,  54,  20, 204,  77,  41,  20,
  219, 166, 151,  22,  95, 244,  25,  22, 128, 217, 234,  22,
  186, 185,   4,  22, 236,   6, 103,  23,   1, 146, 197,  23,
   63, 117, 165,  23, 168, 221,  35,  24, 211, 101,   1,  25,
  208, 253, 116,  26,  77,  98,   8,  27,  89, 150, 169,  27,
  202, 190, 169,  28,  49, 170,  89,  28, 186, 168, 250,  29,
   93, 195, 237,  31, 121, 101,  70, 221, 162,  20, 161, 150,
  216,  28, 126,   0,   0,   1, 124,  89,  23,  76, 254,   0,
    0,   2, 118, 249,  11,  56, 185,  11,  53,   0,   0,   0,
    5,   0,   0,   0,   0,   0,   0,   0,   0,   0,   7, 161,
   31, 252, 210, 218,  26,  55,  38, 104,  54, 249, 133,  49,
   16, 215, 200,  73, 158, 140, 165, 141, 111, 232,  46,  17,
  244,  10, 187, 235,  22, 246,  44, 146,  88, 252, 210, 218,
   26,  55,  38, 104,  54, 249, 133,  49,  16, 215, 200,  73,
  158, 140, 165, 141, 111, 232,  46,  17, 244,  10, 187, 235,
   22, 246,  44, 146,  88, 109,   3, 145, 133, 196, 161,  17,
  241,  12,  56, 210,  91,   6,  51,  10,  76,  70, 155, 193,
  100, 103, 180, 179,  19,  72, 190, 200,  91, 185, 119, 131,
   29, 228, 223, 101, 174, 102,  51, 161, 144, 134,  89, 170,
   53, 194,  76,  32,  28,   3, 215, 161,  97,  70,  28, 117,
  185, 208,  58,  86,  26,  81, 203, 212, 111,   0,   0,   1,
  124,  89,  23,  76,  49, 172, 103,  82, 102, 179,  57,  41,
  115, 109, 211,  28, 230,  39, 107, 146, 156, 178,  47,  90,
   62, 177, 255,  32,  38, 149,  16,  17, 189, 120, 253, 139,
  109, 161, 112, 192,  35, 157,  43, 177,  73,  24, 176,  52,
  129, 124, 250, 148,  63,  91, 151, 172, 218,  80, 128, 126,
   84,   6,  29, 250,  37,  14,  43, 122,   7, 249,  10,  90,
  101,   5, 249,  10,  84, 185,   1,  34, 249,   1,  31,  11,
    1, 248,  66, 184,  64,  21,  34,  35, 214, 105, 114, 230,
   71, 140, 140, 230, 136,  80, 175, 178,   5,  90, 247, 179,
  113, 150,  30,  39,  13, 147, 131,  94,  59, 216,  49,   5,
  177, 123, 127,  24,  48, 157,  20,  13,  91,  19,  84,  17,
  189,  82, 108,  75, 172, 129,  87, 252, 234,  74,  86, 159,
  244,  86,  57,  97, 178,  48,  97,  94,   8, 184, 215, 248,
  213,  12,   1, 161,   1, 107, 250, 172, 209, 233, 130,  52,
  168, 220,  92, 204,  58,  96,  19,  66, 242, 160, 213, 228,
   20, 170, 138, 129, 119, 254, 253,  46, 221,  95, 200, 138,
  155, 161,   1, 107, 250, 172, 209, 233, 130,  52, 168, 220,
   92, 204,  58,  96,  19,  66, 242, 160, 213, 228,  20, 170,
  138, 129, 119, 254, 253,  46, 221,  95, 200, 138, 155, 130,
   78,  32, 134,  17, 141, 161, 164, 232,   0, 131,   7, 161,
   40, 131,  77,  30,   4, 184, 123,  52,  57,  57,  57,  57,
   56,  58, 107, 104,  95,  88, 105,  74,  83,  66, 105,  54,
   82, 116,  77,  69, 120,  57,  69,  86, 122,  50,  74,  57,
  104, 101,  88,  55, 120, 104, 119,  80,  90,  85,  52, 114,
   87, 107,  49, 111,  82,  72, 104,  90,  89, 112,  81, 117,
   86, 119,  89, 122,  50, 119,  58, 109, 104,  95,  82,  51,
  110,  55,  71,  67, 115,  87,  68, 111,  66,  49,  76, 111,
   57,  50,  99,  89,  50,  69,  72,  76, 106, 110,  78,  99,
   84,  74, 106,  86, 111, 100,  67, 116,  70,  67,  68,  87,
   90, 120,  81,  55,  70,  53,  83,  51,  55, 107,  85,  58,
   49,  54,  51,  51,  53,  56,  50,  50,  52,  57, 185,   1,
   35, 249,   1,  32,  11,   1, 248,  66, 184,  64,  90,  47,
   20,  10,  77,  58,  23, 118,  46, 240, 212, 106, 247,  86,
  232, 180, 110, 172,  23, 205,  33, 247, 218,  20, 191, 151,
  125,  64, 125, 144, 214,  64, 135, 101, 254, 102, 143, 252,
  118, 232, 137, 107,  16, 231,  13,  87,  85,  89, 216,  87,
  173, 146, 113, 183, 163,  55, 135,  85,  80, 247,  32,  38,
  144,   3, 184, 216, 248, 214,  12,   1, 161,   1, 107, 250,
  172, 209, 233, 130,  52, 168, 220,  92, 204,  58,  96,  19,
   66, 242, 160, 213, 228,  20, 170, 138, 129, 119, 254, 253,
   46, 221,  95, 200, 138, 155, 161,   1, 107, 250, 172, 209,
  233, 130,  52, 168, 220,  92, 204,  58,  96,  19,  66, 242,
  160, 213, 228,  20, 170, 138, 129, 119, 254, 253,  46, 221,
   95, 200, 138, 155, 130,  78,  32, 134,  17, 146,  73, 188,
  176,   0, 131,   7, 161,  40, 131,  77,  30,   5, 184, 124,
   52,  57,  57,  57,  57,  56,  58, 107, 104,  95,  88, 105,
   74,  83,  66, 105,  54,  82, 116,  77,  69, 120,  57,  69,
   86, 122,  50,  74,  57, 104, 101,  88,  55, 120, 104, 119,
   80,  90,  85,  52, 114,  87, 107,  49, 111,  82,  72, 104,
   90,  89, 112,  81, 117,  86, 119,  89, 122,  50, 119,  58,
  109, 104,  95,  50,  99,  66,  56,  76,  67,  99, 106,  84,
  101,  71,  69,  98,  84, 102,  68, 106,  52, 100,  52,  65,
  113,  84,  67,  97,  90,  80, 103,  65,  98, 109,  55,  72,
  104,  86, 102,  83,  77,  98,  78, 116,  51, 120,  97, 116,
  103,  76, 122,  77,  65,  58,  49,  54,  51,  51,  53,  56,
   50,  50,  53,  57, 185,   1,  34, 249,   1,  31,  11,   1,
  248,  66, 184,  64,  72, 129,  66, 217, 184,  68, 126, 189,
  244,  37, 101, 108, 102,  84,  92,  91, 247, 155, 212,  80,
  233,  21,   1,  24, 111,  53, 137,  29, 205, 123, 208, 128,
   51, 248,   9,  57, 138, 124, 126,  59,  56,  95,  38, 128,
   16,   3,  66, 181, 152,  27, 117, 154, 248, 104, 251, 121,
  147, 109,  11,  12,  74,  21, 234,   4, 184, 215, 248, 213,
   12,   1, 161,   1, 107, 250, 172, 209, 233, 130,  52, 168,
  220,  92, 204,  58,  96,  19,  66, 242, 160, 213, 228,  20,
  170, 138, 129, 119, 254, 253,  46, 221,  95, 200, 138, 155,
  161,   1, 107, 250, 172, 209, 233, 130,  52, 168, 220,  92,
  204,  58,  96,  19,  66, 242, 160, 213, 228,  20, 170, 138,
  129, 119, 254, 253,  46, 221,  95, 200, 138, 155, 130,  78,
   32, 134,  17, 141, 161, 164, 232,   0, 131,   7, 161,  40,
  131,  77,  30,   6, 184, 123,  52,  57,  57,  57,  57,  56,
   58, 107, 104,  95,  88, 105,  74,  83,  66, 105,  54,  82,
  116,  77,  69, 120,  57,  69,  86, 122,  50,  74,  57, 104,
  101,  88,  55, 120, 104, 119,  80,  90,  85,  52, 114,  87,
  107,  49, 111,  82,  72, 104,  90,  89, 112,  81, 117,  86,
  119,  89, 122,  50, 119,  58, 109, 104,  95, 103,  74,  72,
   88, 120,  57, 112,  66, 115,  83, 112,  87,  83,  89,  80,
  101,  89,  72, 118,  99, 101,  75,  74, 118,  49,  83,  49,
   84,  65, 106, 107,  81,  72, 112,  68, 121,  72, 114,  69,
   68, 103,  85,  89,  83,  70, 109,  86,  97, 114,  58,  49,
   54,  51,  51,  53,  56,  50,  50,  54,  57, 185,   1,  35,
  249,   1,  32,  11,   1, 248,  66, 184,  64, 241, 167, 129,
  118, 187, 251, 115, 241,  90,  54, 188,  87, 153, 252,  56,
  236,  21, 164, 205, 106,  32,   7,   0, 107,  76, 204, 253,
  229, 137, 135,  22,  83,  62, 204, 147,  63, 133, 154, 129,
  240,  34, 124, 209, 172, 155, 240,  51,  44,  52, 205, 197,
   63, 174, 240, 212, 198, 205,  98,  19, 115, 137,  54, 199,
   11, 184, 216, 248, 214,  12,   1, 161,   1, 177, 248,  16,
  253, 156, 176,  66,  50, 176,  90, 111,  10, 135, 183, 228,
   14,  83, 225,  45, 214,  91,  69,  68,   8, 139, 192,  46,
  200, 108, 193,  63,   6, 161,   1, 177, 248,  16, 253, 156,
  176,  66,  50, 176,  90, 111,  10, 135, 183, 228,  14,  83,
  225,  45, 214,  91,  69,  68,   8, 139, 192,  46, 200, 108,
  193,  63,   6, 130,  78,  32, 134,  17, 146,  73, 188, 176,
    0, 131,   7, 161,  40, 131,  81, 228, 231, 184, 124,  52,
   57,  57,  57,  57,  56,  58, 107, 104,  95,  88, 105,  74,
   83,  66, 105,  54,  82, 116,  77,  69, 120,  57,  69,  86,
  122,  50,  74,  57, 104, 101,  88,  55, 120, 104, 119,  80,
   90,  85,  52, 114,  87, 107,  49, 111,  82,  72, 104,  90,
   89, 112,  81, 117,  86, 119,  89, 122,  50, 119,  58, 109,
  104,  95,  50,  87, 111,  56,  98, 109,  68, 114, 118,  88,
   68,  71,  51, 122,  82, 114, 116,  52,  87,  80, 118,  87,
   54,  51,  54,  88,  88,  83, 106, 121, 115, 114,  80,  81,
  105,  65,  66, 120,  67, 110,  54,  65, 117, 107, 107, 116,
  115,  67, 111,  54,  58,  49,  54,  51,  51,  53,  56,  50,
   50,  53,  53, 185,   1,  35, 249,   1,  32,  11,   1, 248,
   66, 184,  64, 130, 227, 196, 124,  70, 179, 107, 192,  29,
  101,  35,  78,  94, 117, 201, 200, 109,  89,  96,  84, 130,
   62,  96, 124,  73, 251, 241, 123, 125,  27, 229, 212, 245,
  165,  80,  38,  72, 133,  98, 252, 145, 107, 119, 231,  46,
   33, 168,  81, 241,  57, 245, 122,  89, 175, 215, 241, 102,
  121, 123, 239,  57, 136, 198,  13, 184, 216, 248, 214,  12,
    1, 161,   1, 177, 248,  16, 253, 156, 176,  66,  50, 176,
   90, 111,  10, 135, 183, 228,  14,  83, 225,  45, 214,  91,
   69,  68,   8, 139, 192,  46, 200, 108, 193,  63,   6, 161,
    1, 177, 248,  16, 253, 156, 176,  66,  50, 176,  90, 111,
   10, 135, 183, 228,  14,  83, 225,  45, 214,  91,  69,  68,
    8, 139, 192,  46, 200, 108, 193,  63,   6, 130,  78,  32,
  134,  17, 146,  73, 188, 176,   0, 131,   7, 161,  40, 131,
   81, 228, 232, 184, 124,  52,  57,  57,  57,  57,  56,  58,
  107, 104,  95,  88, 105,  74,  83,  66, 105,  54,  82, 116,
   77,  69, 120,  57,  69,  86, 122,  50,  74,  57, 104, 101,
   88,  55, 120, 104, 119,  80,  90,  85,  52, 114,  87, 107,
   49, 111,  82,  72, 104,  90,  89, 112,  81, 117,  86, 119,
   89, 122,  50, 119,  58, 109, 104,  95,  50, 101,  76,  90,
  105,  51,  55,  49,  81,  71,  66,  98,  82,  99,  82,  89,
  116, 121,  53,  85,  51, 113, 112,  74,  82, 122, 109,  67,
   72, 109, 101,  80, 117, 121,  56,  77,  89,  53, 116,  82,
   84,  70, 122,  90, 102, 113, 106,  68,  81,  71,  58,  49,
   54,  51,  51,  53,  56,  50,  50,  54,  53, 185,   1,  35,
  249,   1,  32,  11,   1, 248,  66, 184,  64,  22, 115, 200,
  216,  23, 229,  89,  10, 196, 198, 179, 171, 105, 220,  45,
  222, 184, 189, 251, 109, 203,  10,  85,  16, 213,  88, 176,
  207, 116, 127, 102, 121, 121, 188, 122,  89, 247,  44, 186,
   34, 105,  78,  42, 171, 103, 207,  18, 186, 198, 114,  82,
   26, 186, 204,   5,  15, 173, 184, 200,  99,  73,  75,  67,
   15, 184, 216, 248, 214,  12,   1, 161,   1, 234, 108, 123,
  148,  81, 247, 177,  44, 175, 199,  65, 254,  34, 194, 169,
  172,  35,  70, 135, 146, 156,  22,   7, 104,  16,  11,  42,
   67,  76, 117,  41,   3, 161,   1, 234, 108, 123, 148,  81,
  247, 177,  44, 175, 199,  65, 254,  34, 194, 169, 172,  35,
   70, 135, 146, 156,  22,   7, 104,  16,  11,  42,  67,  76,
  117,  41,   3, 130,  78,  32, 134,  17, 146,  73, 188, 176,
    0, 131,   7, 161,  40, 131,  77, 141,  83, 184, 124,  52,
   57,  57,  57,  57,  56,  58, 107, 104,  95,  88, 105,  74,
   83,  66, 105,  54,  82, 116,  77,  69, 120,  57,  69,  86,
  122,  50,  74,  57, 104, 101,  88,  55, 120, 104, 119,  80,
   90,  85,  52, 114,  87, 107,  49, 111,  82,  72, 104,  90,
   89, 112,  81, 117,  86, 119,  89, 122,  50, 119,  58, 109,
  104,  95,  50, 105, 103, 118, 103,  81,  56, 113, 110,  75,
   86,  99,  80, 121,  98, 120, 117, 119,  90, 110, 117, 120,
   66,  68,  99, 119,  76,  56,  69, 119,  76,  89,  57, 102,
  116, 117, 116,  54, 114, 103, 100, 119,  72, 121,  78,  52,
  113,  70,  80,  55,  58,  49,  54,  51,  51,  53,  56,  50,
   50,  53,  55, 185,   1,  35, 249,   1,  32,  11,   1, 248,
   66, 184,  64, 204,  98, 210, 220, 151, 153, 127, 231, 119,
   69, 223, 189, 228,   5, 170, 193,   1, 181,  96, 176,  91,
   56, 144,  83, 224,  65,  24, 148,   2, 106,   3,  43,  85,
   97, 152,  64,  94,  94,  49, 196, 234, 126, 230,  62, 179,
  194,  39, 245,  28,  94, 127, 166,  29,  91, 213, 144, 247,
  220, 253, 231, 151, 202, 240,   8, 184, 216, 248, 214,  12,
    1, 161,   1, 234, 108, 123, 148,  81, 247, 177,  44, 175,
  199,  65, 254,  34, 194, 169, 172,  35,  70, 135, 146, 156,
   22,   7, 104,  16,  11,  42,  67,  76, 117,  41,   3, 161,
    1, 234, 108, 123, 148,  81, 247, 177,  44, 175, 199,  65,
  254,  34, 194, 169, 172,  35,  70, 135, 146, 156,  22,   7,
  104,  16,  11,  42,  67,  76, 117,  41,   3, 130,  78,  32,
  134,  17, 146,  73, 188, 176,   0, 131,   7, 161,  40, 131,
   77, 141,  84, 184, 124,  52,  57,  57,  57,  57,  56,  58,
  107, 104,  95,  88, 105,  74,  83,  66, 105,  54,  82, 116,
   77,  69, 120,  57,  69,  86, 122,  50,  74,  57, 104, 101,
   88,  55, 120, 104, 119,  80,  90,  85,  52, 114,  87, 107,
   49, 111,  82,  72, 104,  90,  89, 112,  81, 117,  86, 119,
   89, 122,  50, 119,  58, 109, 104,  95,  50, 109,  82,  81,
  121,  89,  89, 106,  81, 109,  83, 106, 116,  82, 109,  66,
   53, 101, 113,  89, 100, 106, 102,  84,  50, 106,  85,  76,
   50,  55, 121,  66,  90,  57,  65,  68,  97, 101,  87,  99,
   67,  80, 118,  80,  57,  49,  69, 110,  90, 102,  58,  49,
   54,  51,  51,  53,  56,  50,  50,  54,  55, 185,   1,  35,
  249,   1,  32,  11,   1, 248,  66, 184,  64,  80, 237,  82,
  111,  24,   3, 104, 143,  20, 101, 200, 204, 214,  46,  76,
   31,  83,  11, 229,  35, 133, 151,  45, 141,  70,  61, 211,
   29,   1,  73, 199, 179, 123, 125, 171,  66, 217, 172,  39,
  187,  63, 124, 130, 181,   4,  91, 217, 211,  17, 170, 118,
   68,  81,  93, 134, 248, 171,  55, 175, 210,  68, 174, 243,
    9, 184, 216, 248, 214,  12,   1, 161,   1, 240, 225,  49,
   21, 229,   4, 197, 213,  23, 201, 228,  93, 188,  38,  23,
   82,  74, 244, 189,  94,  16, 220, 227, 190, 171, 105,  34,
  183, 193,  55, 221,  92, 161,   1, 240, 225,  49,  21, 229,
    4, 197, 213,  23, 201, 228,  93, 188,  38,  23,  82,  74,
  244, 189,  94,  16, 220, 227, 190, 171, 105,  34, 183, 193,
   55, 221,  92, 130,  78,  32, 134,  17, 146,  73, 188, 176,
    0, 131,   7, 161,  40, 131,  81, 142, 215, 184, 124,  52,
   57,  57,  57,  57,  56,  58, 107, 104,  95,  88, 105,  74,
   83,  66, 105,  54,  82, 116,  77,  69, 120,  57,  69,  86,
  122,  50,  74,  57, 104, 101,  88,  55, 120, 104, 119,  80,
   90,  85,  52, 114,  87, 107,  49, 111,  82,  72, 104,  90,
   89, 112,  81, 117,  86, 119,  89, 122,  50, 119,  58, 109,
  104,  95,  50, 105, 103, 118, 103,  81,  56, 113, 110,  75,
   86,  99,  80, 121,  98, 120, 117, 119,  90, 110, 117, 120,
   66,  68,  99, 119,  76,  56,  69, 119,  76,  89,  57, 102,
  116, 117, 116,  54, 114, 103, 100, 119,  72, 121,  78,  52,
  113,  70,  80,  55,  58,  49,  54,  51,  51,  53,  56,  50,
   50,  53,  55, 185,   1,  35, 249,   1,  32,  11,   1, 248,
   66, 184,  64, 115,  94, 197,   9, 199, 129, 184,  78, 216,
  186,  38, 131, 152, 225,  76, 115, 127, 129,  17, 219, 176,
   70, 193, 141, 100, 216,  54, 161,   7, 100,  54, 116,  28,
  252, 254, 157, 180, 153, 166, 171,  31, 103, 244, 156, 187,
  221, 179,  36, 220, 111,  94, 238, 170,  62, 158, 169, 124,
  165,  49, 196,  56, 121, 138,   2, 184, 216, 248, 214,  12,
    1, 161,   1, 240, 225,  49,  21, 229,   4, 197, 213,  23,
  201, 228,  93, 188,  38,  23,  82,  74, 244, 189,  94,  16,
  220, 227, 190, 171, 105,  34, 183, 193,  55, 221,  92, 161,
    1, 240, 225,  49,  21, 229,   4, 197, 213,  23, 201, 228,
   93, 188,  38,  23,  82,  74, 244, 189,  94,  16, 220, 227,
  190, 171, 105,  34, 183, 193,  55, 221,  92, 130,  78,  32,
  134,  17, 146,  73, 188, 176,   0, 131,   7, 161,  40, 131,
   81, 142, 216, 184, 124,  52,  57,  57,  57,  57,  56,  58,
  107, 104,  95,  88, 105,  74,  83,  66, 105,  54,  82, 116,
   77,  69, 120,  57,  69,  86, 122,  50,  74,  57, 104, 101,
   88,  55, 120, 104, 119,  80,  90,  85,  52, 114,  87, 107,
   49, 111,  82,  72, 104,  90,  89, 112,  81, 117,  86, 119,
   89, 122,  50, 119,  58, 109, 104,  95,  50, 109,  82,  81,
  121,  89,  89, 106,  81, 109,  83, 106, 116,  82, 109,  66,
   53, 101, 113,  89, 100, 106, 102,  84,  50, 106,  85,  76,
   50,  55, 121,  66,  90,  57,  65,  68,  97, 101,  87,  99,
   67,  80, 118,  80,  57,  49,  69, 110,  90, 102,  58,  49,
   54,  51,  51,  53,  56,  50,  50,  54,  55, 192,   0
])

test('Deserialize Generation message', t => {
    t.deepEqual(
        serializer.deserialize(data),
        message
    )
})