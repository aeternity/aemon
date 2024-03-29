export default class InMemoryMetrics {
    constructor() {
        this.prefix = 'aemon'
        this.data = {}
    }

    #initializeMetric(metric, labels) {
        const keys = Object.keys(labels)
        if (keys.length === 0) {
            if (!this.data.hasOwnProperty(metric)) {
                this.data[metric] = 0
            }

            return
        }

        if (!this.data.hasOwnProperty(metric)) {
            this.data[metric] = {}
        }

        for (const key of keys) {
            const val = labels[key]
            if (!this.data[metric].hasOwnProperty(key)) {
                this.data[metric][key] = {}
            }

            if (!this.data[metric][key].hasOwnProperty(val)) {
                this.data[metric][key][val] = 0
            }
        }
    }

    async dump() {
        return new Promise((resolve) => {
            resolve(this.data)
        })
    }

    inc(metric, labels = {}, i = 1) {
        this.#initializeMetric(metric, labels)

        const keys = Object.keys(labels)
        if (keys.length === 0) {
            this.data[metric] += i
        }

        for (const key of keys) {
            const val = labels[key]
            this.data[metric][key][val] += i
        }
    }

    dec(metric, labels = {}, i = 1) {
        this.#initializeMetric(metric, labels)

        const keys = Object.keys(labels)
        if (keys.length === 0) {
            this.data[metric] -= i
        }

        for (const key of keys) {
            const val = labels[key]
            this.data[metric][key][val] -= i
        }
    }

    set(metric, labels = {}, i = 1) {
        this.#initializeMetric(metric, labels)

        const keys = Object.keys(labels)
        if (keys.length === 0) {
            this.data[metric] = i
        }

        for (const key of keys) {
            const val = labels[key]
            this.data[metric][key][val] = i
        }
    }

    observe(metric, labels = {}, val = 1) {
        this.set(metric, labels, val)
    }
}
