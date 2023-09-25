import stream from 'stream'

const LENGTH_SIZE = 2

export default class DecodeFrameTransform extends stream.Transform {
    constructor(_options) {
        super({
            objectMode: true,
            // writableObjectMode: true
        })

        this.buffer = Buffer.alloc(0)
    }

    _transform(chunk, _encoding, callback) {
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
        if (this.buffer.length >= LENGTH_SIZE + len) {
            const frame = this.buffer.subarray(LENGTH_SIZE, LENGTH_SIZE + len)
            this.buffer = this.buffer.subarray(LENGTH_SIZE + len)
            return frame
        }

        return null
    }
}
