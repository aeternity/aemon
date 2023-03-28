import stream from 'stream'

const LENGTH_SIZE = 2

//better names (?):
// FrameStream
// LengthPrefixStream

export default class EncodeFrameTransform extends stream.Transform {
    constructor(options) {
        super(options)
    }

    _transform(chunk, encoding, callback) {
        const len = Buffer.alloc(LENGTH_SIZE)
        len.writeUInt16BE(chunk.length, 0)

        const frame = Buffer.concat([len, chunk])
        // console.log('[Encoder] frame: ', frame)
        callback(null, frame)
    }
}
