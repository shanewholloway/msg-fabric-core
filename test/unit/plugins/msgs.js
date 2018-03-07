import { Hub, expect, sleep, newLog } from '../_setup'

import test_msgs_small from './msgs_small'
import test_msgs_large from './msgs_large'
import test_msgs_multipart from './msgs_multipart'
import test_msgs_streaming from './msgs_streaming'
import test_msgs_extensions from './msgs_extensions'


describe @ 'Plugin msgs', @=> ::
  describe @ 'address details', () => test_msgs_address_details(setup_msgs_test)
  describe @ `small sends`, () => test_msgs_small(setup_msgs_test)
  describe @ `large sends`, () => test_msgs_large(setup_msgs_test)
  describe @ `multipart`, () => test_msgs_multipart(setup_msgs_test)
  describe @ `streaming`, () => test_msgs_streaming(setup_msgs_test)
  describe @ `extensions`, test_msgs_extensions



function test_msgs_address_details(setup_msgs_test) ::
  let ns
  beforeEach @=>> :: ns = await setup_msgs_test()

  it @ 'client address details', @=>> ::
    expect @ ns.client.toJSON()
    .to.deep.equal @: '\u03E0': '$cr$ $client$'
    .to.deep.equal @: 'Ϡ': '$cr$ $client$'

    expect @ JSON.stringify @ ns.client
    .to.deep.equal @ '{"\u03E0":"$cr$ $client$"}'
    .to.deep.equal @ '{"Ϡ":"$cr$ $client$"}'

  for const variant of ['c_anon', 'c_from', 'c_reply', 'c_reply_anon'] ::
    it @ `${variant} address details`, @=>> ::

      expect @ ns[variant].toJSON()
      .to.deep.equal @: '\u03E0': '$unit$ $src$'
      .to.deep.equal @: 'Ϡ': '$unit$ $src$'

      expect @ JSON.stringify @ ns[variant]
      .to.deep.equal @ '{"\u03E0":"$unit$ $src$"}'
      .to.deep.equal @ '{"Ϡ":"$unit$ $src$"}'


  it @ 'source address details', @=>> ::
    expect(ns.src.toJSON())
    .to.deep.equal @: '\u03E0': '$unit$ $src$'
    .to.deep.equal @: 'Ϡ': '$unit$ $src$'

    expect(JSON.stringify(ns.src))
    .to.deep.equal @ '{"\u03E0":"$unit$ $src$"}'
    .to.deep.equal @ '{"Ϡ":"$unit$ $src$"}'

  it @ 'src target logs messages ', @=>> ::
    expect(ns.log.calls).to.be.empty

    const ts = new Date()
    await ns.hub.send @: id_route: '$unit$', id_target: '$src$', body: {ts}

    await ns.log.expectOneLogOf @
      '_recv_ json', [], {}, @{} ts: ts.toJSON()


async function setup_msgs_test() ::
  const log = newLog()
  const hub = Hub.create('$unit$')
  hub.other = hub.createLocalRoute(undefined, '$cr$')


  let _token_counter = 1000
  const pi_msgs = hub.msgs.createMsgsPlugin @:
    newToken() :: return ( ++ _token_counter )+''

  const src_addr = @{}
    id_route: hub.local.id_route
    id_target: '$src$'

  const client_addr = @{}
    id_route: hub.other.id_route
    id_target: '$client$'

  const client = pi_msgs.as(client_addr)

  const c_anon = client.anon(src_addr)
  const c_from = client.to(src_addr)
  const c_reply = client.reply(src_addr, 'test_token')
  const c_reply_anon = client.reply_anon(src_addr, 'test_token')

  const src = pi_msgs.as(src_addr)

  hub.local.registerTarget @ '$src$', pkt => ::
    const rpkt = src._recv_pkt_ @ pkt
    if null != rpkt ::
      log @ `_recv_ ${rpkt.pkt_kind}`
        rpkt._hdr_ ? rpkt._hdr_.slice(2) : null
        Object.assign({}, rpkt.op)
        rpkt.is_pkt_json ? rpkt.json() : '--not-json--'

    else log @ `_recv_ null`, pkt._hdr_.slice(0,3)

  return @{} log, hub, src, client
    c_anon, c_from, c_reply, c_reply_anon

