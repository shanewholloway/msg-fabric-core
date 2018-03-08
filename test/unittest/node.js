import FabricBaseHub from 'msg-fabric-core/esm/core-node'
import pi_direct from 'msg-fabric-core/esm/plugin-net-direct'
import pi_tcp from 'msg-fabric-core/esm/plugin-net-tcp'
import pi_tls from 'msg-fabric-core/esm/plugin-net-tls'
import pi_web from 'msg-fabric-core/esm/plugin-web'

const FabricHub = FabricBaseHub
  .plugins( pi_direct(), pi_tcp(), pi_tls(), pi_web() )

import { _init } from '../unit/_setup'
_init(FabricHub)

export * from './../unit/all'
export * from './../unit/all.node'
