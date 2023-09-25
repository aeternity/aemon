import stream from 'stream'

const LENGTH_SIZE = 2

// better names (?):
// FrameStream
// LengthPrefixStream

export default class EncodeFrameTransform extends stream.Transform {
    _transform(chunk, _encoding, callback) {
        const len = Buffer.alloc(LENGTH_SIZE)
        len.writeUInt16BE(chunk.length, 0)

        const frame = Buffer.concat([len, chunk])
        callback(null, frame)
    }
}
