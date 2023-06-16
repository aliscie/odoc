import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface FileNode {
  'id' : bigint,
  'content' : bigint,
  'name' : string,
  'children' : BigUint64Array | bigint[],
  'parent' : [] | [bigint],
}
export interface RegisterUser { 'name' : string, 'description' : string }
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export interface User { 'name' : string, 'description' : string }
export interface _SERVICE {
  'create_new_file' : ActorMethod<[string, [] | [bigint]], FileNode>,
  'delete_file' : ActorMethod<[bigint], [] | [FileNode]>,
  'get_all_files' : ActorMethod<[], [] | [Array<[bigint, FileNode]>]>,
  'get_file' : ActorMethod<[bigint], [] | [FileNode]>,
  'register' : ActorMethod<[RegisterUser], Result>,
  'rename_file' : ActorMethod<[bigint, string], boolean>,
}
