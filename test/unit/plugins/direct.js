import { Hub, expect, newLog } from '../_setup'
import { testChannelConnection } from './_chan_tests'

describe @ 'Plugin direct', @=> ::

  it @ 'hub.direct is a channel', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        return hub_b.direct @ hub_a

  it @ 'hub.direct is a channel (2)', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        return hub_a.direct @ hub_b.direct


  it @ 'hub.direct.connect is a channel', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        return hub_b.direct.connect @ hub_a

  it @ 'hub.direct.connect is a channel (2)', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        return hub_a.direct.connect @ hub_b.direct


  it @ 'hub.direct.connectDirectPair is a [channel, channel]', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        const pair = hub_b.direct.connectDirectPair @ hub_a
        expect(pair).to.be.an('array')
        expect(pair).to.have.lengthOf(2)
        expect(pair[0]).to.be.a('promise')
        expect(pair[1]).to.be.a('promise')
        return pair[1]

  it @ 'hub.direct.connectDirectPair is a [channel, channel] (2)', @=>> ::
    await testChannelConnection @:
      connect(hub_a, hub_b) ::
        const pair = hub_a.direct.connectDirectPair @ hub_b.direct
        expect(pair).to.be.an('array')
        expect(pair).to.have.lengthOf(2)
        expect(pair[0]).to.be.a('promise')
        expect(pair[1]).to.be.a('promise')
        return pair[1]
