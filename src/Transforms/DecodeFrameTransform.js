import stream from 'stream'

const LENGTH_SIZE = 2

export default class DecodeFrameTransform extends stream.Transform {

    constructor(options) {
        super({
            objectMode: true,
            // writableObjectMode: true
        })

        this.buffer = Buffer.alloc(0)
    }

    _transform(chunk, encoding, callback) {
        // console.log('[Decoder] chunk len: ', chunk.length)
        this.buffer = Buffer.concat([this.buffer, chunk])

        let frame = this.getFrame()
        while (frame !== null) {
            this.push(frame)
            frame = this.getFrame()
        }

        callback()
    }

    getFrame() {
        if (this.buffer.length < LENGTH_SIZE) {
            return null
        }

        const len = this.buffer.readUInt16BE()
        // console.log('[Decoder] data len: ', len)
        if (this.buffer.length >= LENGTH_SIZE + len) {
            const frame = this.buffer.subarray(LENGTH_SIZE, LENGTH_SIZE + len)
            this.buffer = this.buffer.subarray(LENGTH_SIZE + len)
            // console.log('[Decoder] data:', frame)
            return frame
        }

        return null
    }
}
