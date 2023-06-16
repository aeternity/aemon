export default class SerializerError extends Error {
    constructor(code, data, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super('Serializer error', ...params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SerializerError)
        }

        this.code = code
        this.data = data
    }
}
