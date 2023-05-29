#!/usr/bin/env node

import yargs from 'yargs'
import ScanCommand from '../src/Commands/ScanCommand.js'

process.on('SIGINT', () => process.exit())

yargs(process.argv.slice(2))
    .env('AEMON')
    .config('config')
    .default('config', './etc/aemon/default.json')
    .option('network-id', {
        alias: 'n',
        type: 'string',
        description: 'Network ID (used in prologue)',
        require: true,
    })
    .option('genesis-hash', {
        alias: 'g',
        type: 'string',
        description: 'Genesis hash (used in prologue)',
        require: true,
    })
    .option('peer', {
        // alias: 'b',
        type: 'array',
        description: 'Peers to initially connect to',
    })
    .option('source-address', {
        alias: 's',
        type: 'string',
        description: 'Listen address for incomming connections',
        default: 'localhost',
    })
    .option('source-port', {
        alias: 'p',
        type: 'int',
        description: 'Listen port for incomming connections',
        default: 3015
    })
    .option('external-port', {
        alias: 'd',
        type: 'int',
        description: 'External (internet-facing) port for incomming connections',
        default: 3015,
    })
    .option('public-key', {
        type: 'string',
        description: 'Noise protocol public key',
        require: true,
    })
    .option('private-key', {
        type: 'string',
        description: 'Noise protocol private key',
        require: true,
    })
    .option('metrics-port', {
        type: 'int',
        description: 'Prometheus exporter port',
        default: 3000,
    })
    .option('enable-metrics', {
        type: 'boolean',
        description: 'Enable metrics server',
        default: false,
    })
    .option('enable-server', {
        type: 'boolean',
        description: 'Enable server listener',
        default: false,
    })
    .option('enable-client', {
        type: 'boolean',
        description: 'Enable client crawler',
        default: true,
    })
    .command(ScanCommand)
    .help()
    .parse()
