import test from 'ava'
import NoiseWasmSession from '../src/NoiseWasmSession.js'

test('Basic Handshake', t => {
    const [iPrv, _iPub] = NoiseWasmSession.createKeyPair()
    const [rPrv, rPub] = NoiseWasmSession.createKeyPair()
    const initiator = new NoiseWasmSession(NoiseWasmSession.ROLE_INITIATOR, null, iPrv, rPub)
    const responder = new NoiseWasmSession(NoiseWasmSession.ROLE_RESPONDER, null, rPrv)

    let data = null

    t.is(initiator.isHandshaking(), true)
    t.is(responder.isHandshaking(), true)

    data = initiator.handshake()
    t.is(initiator.isHandshaking(), true)

    data = responder.handshake(data)
    t.is(responder.isHandshaking(), true)

    data = initiator.handshake(data)
    t.is(initiator.isHandshaking(), false)

    responder.handshake(data)
    t.is(responder.isHandshaking(), false)
})
