import {Counter, Gauge, collectDefaultMetrics, register} from 'prom-client'

export default class PrometheusMetrics {
    constructor(prefix = 'aemon') {
        this.metrics = {
            connections_total: new Counter({
              name: prefix + '_connections_total',
              help: 'Noise connections by state',
              labelNames: ['status'],
            }),
            connections: new Gauge({
              name: prefix + '_connections',
              help: 'Currently open noise connections',
              labelNames: ['status'],
            }),
            connection_errors_total: new Counter({
              name: prefix + '_connection_errors_total',
              help: 'Connection errors by type',
              labelNames: ['code'],
            }),
            messages_total: new Counter({
              name: prefix + '_messages_total',
              help: 'P2P messages by type',
              labelNames: ['direction', 'type'],
            }),
            responses_total: new Counter({
              name: prefix + '_responses_total',
              help: 'P2P message responses by message type',
              labelNames: ['direction', 'type', 'errorReason'],
            }),
            peers: new Gauge({
              name: prefix + '_peers',
              help: 'Network peers',
            }),
            peer_info: new Gauge({
                name: prefix + '_peer_info',
                help: 'Number of reported peers and additional info',
                labelNames: ['host', 'port', 'publicKey', 'version', 'revision', 'vendor', 'os', 'networkId']
            }),
            peer_verified: new Gauge({
                name: prefix + '_peer_verified',
                help: 'Number of reported verified peers for a given peer',
                labelNames: ['publicKey']
            }),
            peer_unverified: new Gauge({
                name: prefix + '_peer_unverified',
                help: 'Number of reported unverified peers for a given peer',
                labelNames: ['publicKey']
            }),
        }

        // collectDefaultMetrics({ prefix })
    }

    async dump() {
        return register.metrics()
    }

    inc(metric, labels = {}, i = 1) {
        this.metrics[metric].inc(labels, i)
    }

    dec(metric, labels = {}, i = 1) {
        this.metrics[metric].dec(labels, i)
    }

    set(metric, labels = {}, i = 1) {
        this.metrics[metric].set(labels, i)
    }
}
