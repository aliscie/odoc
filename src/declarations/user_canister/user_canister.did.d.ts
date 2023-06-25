import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Column {
  '_type' : ColumnTypes,
  'field' : string,
  'filters' : Array<Filter>,
  'permissions' : Array<ColumnPermission>,
  'editable' : boolean,
  'formula' : [] | [string],
}
export interface ColumnPermission {
  '_type' : PermissionType,
  'granted_to' : Array<Principal>,
}
export type ColumnTypes = { 'Tag' : null } |
  { 'Date' : null } |
  { 'File' : null } |
  { 'Text' : null } |
  { 'Person' : null } |
  { 'Category' : null } |
  { 'Number' : null };
export type ContentData = { 'Comment' : string } |
  { 'Image' : BigUint64Array | bigint[] } |
  { 'Table' : Table };
export interface ContentNode {
  'id' : bigint,
  '_type' : string,
  'data' : [] | [ContentData],
  'text' : string,
  'children' : BigUint64Array | bigint[],
  'parent' : [] | [bigint],
}
export interface FileNode {
  'id' : bigint,
  'content' : bigint,
  'name' : string,
  'children' : BigUint64Array | bigint[],
  'parent' : [] | [bigint],
}
export interface Filter {
  'name' : string,
  'operations' : Array<Operation>,
  'formula' : [] | [string],
}
export interface Friend {
  'friend_requests' : Array<User>,
  'friends' : Array<User>,
}
export interface InitialData {
  'FilesContents' : [] | [Array<[bigint, Array<[bigint, ContentNode]>]>],
  'Files' : [] | [Array<[bigint, FileNode]>],
  'Friends' : [] | [Friend],
  'Profile' : User,
  'DiscoverUsers' : Array<[string, User]>,
}
export type Operation = { 'Equal' : null } |
  { 'Contains' : null } |
  { 'Bigger' : null } |
  { 'BiggerOrEqual' : null };
export type PermissionType = { 'CanRead' : null } |
  { 'CanUpdate' : null };
export interface RegisterUser { 'name' : string, 'description' : string }
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : InitialData } |
  { 'Err' : string };
export interface Table {
  'rows' : Array<Array<[string, string]>>,
  'columns' : Array<Column>,
}
export interface User { 'id' : string, 'name' : string, 'description' : string }
export interface _SERVICE {
  'accept_friend_request' : ActorMethod<[string], Result>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'content_updates' : ActorMethod<[bigint, [] | [bigint], string], Result_1>,
  'create_agreement' : ActorMethod<[string], [] | [ContentNode]>,
  'create_new_file' : ActorMethod<[string, [] | [bigint]], FileNode>,
  'delete_file' : ActorMethod<[bigint], [] | [FileNode]>,
  'get_all_contracts' : ActorMethod<[], string>,
  'get_all_files' : ActorMethod<[], [] | [Array<[bigint, FileNode]>]>,
  'get_all_files_content' : ActorMethod<
    [],
    Array<[bigint, Array<[bigint, ContentNode]>]>
  >,
  'get_all_users' : ActorMethod<[], Array<[string, User]>>,
  'get_file' : ActorMethod<[bigint], [] | [FileNode]>,
  'get_file_content' : ActorMethod<
    [bigint],
    [] | [Array<[bigint, ContentNode]>]
  >,
  'get_initial_data' : ActorMethod<[], Result_2>,
  'multi_files_content_updates' : ActorMethod<
    [Array<Array<[bigint, Array<[bigint, ContentNode]>]>>],
    Result_1
  >,
  'register' : ActorMethod<[RegisterUser], Result>,
  'rename_file' : ActorMethod<[bigint, string], boolean>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'unfriend' : ActorMethod<[string], Result>,
}
