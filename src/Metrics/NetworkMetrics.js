export default class NetworkMetrics {
    constructor(metrics, network) {
        this.metrics = metrics
        this.network = network
    }

    async dump() {
        return this.metrics.dump()
    }

    inc(metric, labels = {}, i = 1) {
        labels.networkId = this.network.networkId

        return this.metrics.inc(metric, labels, i)
    }

    dec(metric, labels = {}, i = 1) {
        labels.networkId = this.network.networkId

        return this.metrics.dec(metric, labels, i)
    }

    set(metric, labels = {}, i = 1) {
        labels.networkId = this.network.networkId

        return this.metrics.set(metric, labels, i)
    }

    observe(metric, labels = {}, val) {
        labels.networkId = this.network.networkId

        return this.metrics.observe(metric, labels, val)
    }
}
