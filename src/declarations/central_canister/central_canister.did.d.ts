import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = { 'Ok' : string } |
  { 'Err' : string };
export interface _SERVICE {
  'create_canister' : ActorMethod<[], Result>,
  'get_user_canister' : ActorMethod<[], Result>,
}
