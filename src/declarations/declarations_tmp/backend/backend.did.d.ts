import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Profile { 'name' : string, 'description' : string }
export interface _SERVICE {
  'get' : ActorMethod<[string], Profile>,
  'get_self' : ActorMethod<[], Profile>,
  'search' : ActorMethod<[string], [] | [Profile]>,
  'update' : ActorMethod<[Profile], undefined>,
}
