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
            }),
            errors_total: new Counter({
              name: prefix + '_errors_total',
              help: 'Errors by type',
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
              labelNames: ['direction', 'type'],
            }),
            peers_total: new Gauge({
              name: prefix + '_peers',
              help: 'Network peers shared with ping messages',
            }),
        }

        // collectDefaultMetrics({ prefix })
    }

    async dump() {
        return register.metrics()
    }

    inc(metric, labels = {}, i = 1) {
        // console.log('inc', metric, labels, i)
        this.metrics[metric].inc(labels, i)
    }

    dec(metric, labels = {}, i = 1) {
        this.metrics[metric].dec(labels, i)
    }
}
