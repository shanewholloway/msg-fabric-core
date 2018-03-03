import { Hub, expect, newLog } from '../_setup'

export default function () ::
  let bin_len
  before @=> :: bin_len = Hub.create()._pkts_.bin_len

  it @ 'bin_len packPacket with binary body', @=>> ::
    const buf = 
      bin_len.packPacket @:
        id_route: '$route$'
        id_target: '$target$'
        body: new Uint8Array @# 1,2,3,4

    expect(buf.length).to.equal(25)
    expect @ Array.from(buf)
    .to.be.deep.equal @#
      25, 0, 36, 114, 111, 117, 116, 101, 36, 32, 36, 116, 97, 114, 103, 101, 116, 36, 9, 61, 9, 1, 2, 3, 4

  it @ 'bin_len unpackPacket with binary body', @=>> ::
    const pkt = bin_len.unpackPacket @ new Uint8Array @#
      25, 0, 36, 114, 111, 117, 116, 101, 36, 32, 36, 116, 97, 114, 103, 101, 116, 36, 9, 61, 9, 1, 2, 3, 4

    expect(pkt.id_route).to.be.equal('$route$')
    expect(pkt.id_target).to.be.equal('$target$')

    expect(pkt._hdr_.length).to.be.equal(2)
    expect(pkt._hdr_[0]).to.be.equal('$route$')
    expect(pkt._hdr_[1]).to.be.equal('$target$')

    expect @ Array.from @ pkt._body_
    .to.be.deep.equal @# 1,2,3,4
    expect @ Array.from @ pkt.buffer()
    .to.be.deep.equal @# 1,2,3,4

    expect(pkt._meta_).to.be.equal('')
    expect(pkt.meta()).to.be.equal(null)


  it @ 'bin_len packPacket with binary body and meta', @=>> ::
    const buf =
      bin_len.packPacket @:
        id_route: '$route$'
        id_target: '$target$'
        body: new Uint8Array @# 1,2,3,4
        meta: @{} kind: '$meta$'

    expect(buf.length).to.equal(42)
    expect @ Array.from(buf)
    .to.be.deep.equal @#
      42, 0, 36, 114, 111, 117, 116, 101, 36, 32, 36, 116, 97, 114, 103, 101, 116, 36, 9, 61, 123, 34, 107, 105, 110, 100, 34, 58, 34, 36, 109, 101, 116, 97, 36, 34, 125, 9, 1, 2, 3, 4


  it @ 'bin_len unpackPacket with binary body and meta', @=>> ::
    const pkt = bin_len.unpackPacket @ new Uint8Array @#
      42, 0, 36, 114, 111, 117, 116, 101, 36, 32, 36, 116, 97, 114, 103, 101, 116, 36, 9, 61, 123, 34, 107, 105, 110, 100, 34, 58, 34, 36, 109, 101, 116, 97, 36, 34, 125, 9, 1, 2, 3, 4

    expect(pkt.id_route).to.be.equal('$route$')
    expect(pkt.id_target).to.be.equal('$target$')

    expect(pkt._hdr_.length).to.be.equal(2)
    expect(pkt._hdr_[0]).to.be.equal('$route$')
    expect(pkt._hdr_[1]).to.be.equal('$target$')

    expect @ Array.from @ pkt._body_
    .to.be.deep.equal @# 1,2,3,4
    expect @ Array.from @ pkt.buffer()
    .to.be.deep.equal @# 1,2,3,4

    expect(pkt._meta_).to.be.equal @
      '{"kind":"$meta$"}'
    expect(pkt.meta()).to.be.deep.equal @:
      kind: "$meta$"