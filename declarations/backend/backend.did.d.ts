import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface FileNode {
  'id' : bigint,
  'name' : string,
  'children' : BigUint64Array | bigint[],
}
export interface RegisterUser { 'name' : string, 'description' : string }
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export interface User { 'name' : string, 'description' : string }
export interface _SERVICE {
  'create_new_file' : ActorMethod<[string, [] | [bigint]], FileNode>,
  'get_all_files' : ActorMethod<[], [] | [Array<FileNode>]>,
  'register' : ActorMethod<[RegisterUser], Result>,
}
