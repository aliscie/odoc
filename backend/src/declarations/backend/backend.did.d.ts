import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'get' : ActorMethod<[], bigint>,
  'set' : ActorMethod<[bigint], undefined>,
}
