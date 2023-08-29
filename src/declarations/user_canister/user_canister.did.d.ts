import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Column {
  'id' : string,
  '_type' : ColumnTypes,
  'field' : string,
  'filters' : Array<Filter>,
  'permissions' : Array<ColumnPermission>,
  'dataValidator' : [] | [string],
  'editable' : boolean,
  'formula' : [] | [Formula],
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
  'id' : string,
  '_type' : string,
  'data' : [] | [ContentData],
  'text' : string,
  'children' : Array<string>,
  'language' : string,
  'parent' : [] | [string],
}
export type Contract = { 'PaymentContract' : string } |
  { 'SharesContract' : string };
export interface Exchange {
  'to' : string,
  '_type' : ExchangeType,
  'date' : string,
  'from' : string,
  'amount' : bigint,
}
export type ExchangeType = { 'Withdraw' : null } |
  { 'Deposit' : null } |
  { 'LocalSend' : null } |
  { 'LocalReceive' : null };
export type Execute = { 'TransferNft' : null } |
  { 'TransferToken' : null } |
  { 'TransferUsdt' : null };
export interface FileNode {
  'id' : string,
  'share_id' : [] | [string],
  'name' : string,
  'children' : Array<string>,
  'parent' : [] | [string],
}
export interface Filter {
  'name' : string,
  'operations' : Array<Operation>,
  'formula' : [] | [string],
}
export interface Formula {
  'trigger_target' : string,
  'trigger' : Trigger,
  'operation' : Operation,
  'execute' : Execute,
}
export interface Friend {
  'friend_requests' : Array<User>,
  'friends' : Array<User>,
}
export interface InitialData {
  'FilesContents' : [] | [Array<[string, Array<[string, ContentNode]>]>],
  'Contracts' : Array<[string, StoredContract]>,
  'Files' : [] | [Array<[string, FileNode]>],
  'Friends' : [] | [Friend],
  'Profile' : User,
  'DiscoverUsers' : Array<[string, User]>,
  'Wallet' : Wallet,
}
export type Operation = { 'Equal' : null } |
  { 'Contains' : null } |
  { 'Bigger' : null } |
  { 'BiggerOrEqual' : null };
export interface Payment {
  'canceled' : boolean,
  'contract_id' : string,
  'sender' : Principal,
  'released' : boolean,
  'confirmed' : boolean,
  'amount' : bigint,
  'receiver' : Principal,
}
export type PermissionType = { 'CanRead' : null } |
  { 'CanUpdate' : null };
export interface RegisterUser {
  'name' : [] | [string],
  'description' : [] | [string],
  'photo' : [] | [Uint8Array | number[]],
}
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : InitialData } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : [FileNode, Array<[string, ContentNode]>] } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : null } |
  { 'Err' : null };
export interface Row {
  'id' : string,
  'contract' : [] | [Contract],
  'cells' : [] | [Array<[string, string]>],
  'requests' : [] | [Contract],
}
export interface Share {
  'contract_id' : string,
  'share' : bigint,
  'receiver' : Principal,
}
export interface SharesContract {
  'shares' : Array<Share>,
  'payments' : Array<Payment>,
}
export type StoredContract = { 'PaymentContract' : Payment } |
  { 'SharesContract' : SharesContract };
export interface Table { 'rows' : Array<Row>, 'columns' : Array<Column> }
export type Trigger = { 'Timer' : null } |
  { 'Update' : null };
export interface User {
  'id' : string,
  'name' : string,
  'description' : string,
  'photo' : Uint8Array | number[],
}
export interface Wallet {
  'balance' : bigint,
  'owner' : string,
  'exchanges' : Array<Exchange>,
}
export interface _SERVICE {
  'accept_friend_request' : ActorMethod<[string], Result>,
  'accept_payment' : ActorMethod<[string], Result_1>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'cancel_payment' : ActorMethod<[string], Result_1>,
  'content_updates' : ActorMethod<[string, [] | [string], string], Result_2>,
  'create_new_file' : ActorMethod<[string, [] | [string]], FileNode>,
  'create_payment_contract' : ActorMethod<[string], Result_1>,
  'delete_file' : ActorMethod<[string], [] | [FileNode]>,
  'delete_payment' : ActorMethod<[string], Result_1>,
  'deposit_usdt' : ActorMethod<[bigint], Result_3>,
  'get_all_files' : ActorMethod<[], [] | [Array<[string, FileNode]>]>,
  'get_all_files_content' : ActorMethod<
    [],
    Array<[string, Array<[string, ContentNode]>]>
  >,
  'get_all_users' : ActorMethod<[], Array<[string, User]>>,
  'get_file' : ActorMethod<[string], [] | [FileNode]>,
  'get_file_content' : ActorMethod<
    [string],
    [] | [Array<[string, ContentNode]>]
  >,
  'get_initial_data' : ActorMethod<[], Result_4>,
  'get_shared_file' : ActorMethod<[string], Result_5>,
  'move_file' : ActorMethod<[string, [] | [string]], Result_6>,
  'multi_updates' : ActorMethod<
    [
      Array<FileNode>,
      Array<Array<[string, Array<[string, ContentNode]>]>>,
      Array<StoredContract>,
      Array<string>,
    ],
    Result_2
  >,
  'register' : ActorMethod<[RegisterUser], Result>,
  'release_payment' : ActorMethod<[string], Result_1>,
  'rename_file' : ActorMethod<[string, string], boolean>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'share_file' : ActorMethod<[string, string], Result_2>,
  'unfriend' : ActorMethod<[string], Result>,
  'update_user_profile' : ActorMethod<[RegisterUser], Result>,
  'withdraw_usdt' : ActorMethod<[bigint], Result_3>,
}
