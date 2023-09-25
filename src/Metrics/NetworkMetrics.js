export default class NetworkMetrics {
    constructor(metrics, network) {
        this.metrics = metrics
        this.network = network
    }

    async dump() {
        return this.metrics.dump()
    }

    inc(metric, labels = {}, i = 1) {
        const {networkId} = this.network

        return this.metrics.inc(metric, {...labels, networkId}, i)
    }

    dec(metric, labels = {}, i = 1) {
        const {networkId} = this.network

        return this.metrics.dec(metric, {...labels, networkId}, i)
    }

    set(metric, labels = {}, i = 1) {
        const {networkId} = this.network

        return this.metrics.set(metric, {...labels, networkId}, i)
    }

    observe(metric, labels = {}, val = 1) {
        const {networkId} = this.network

        return this.metrics.observe(metric, {...labels, networkId}, val)
    }
}
