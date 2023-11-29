import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppMessage {
  'text' : string,
  'notification' : [] | [Notification],
  'timestamp' : bigint,
}
export interface CanisterOutputCertifiedMessages {
  'messages' : Array<CanisterOutputMessage>,
  'cert' : Uint8Array | number[],
  'tree' : Uint8Array | number[],
}
export interface CanisterOutputMessage {
  'key' : string,
  'content' : Uint8Array | number[],
  'client_key' : ClientKey,
}
export interface CanisterWsCloseArguments { 'client_key' : ClientKey }
export interface CanisterWsGetMessagesArguments { 'nonce' : bigint }
export interface CanisterWsMessageArguments { 'msg' : WebsocketMessage }
export interface CanisterWsOpenArguments {
  'gateway_principal' : Principal,
  'client_nonce' : bigint,
}
export interface ClientKey {
  'client_principal' : Principal,
  'client_nonce' : bigint,
}
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
export interface ContractNotification {
  'contract_type' : string,
  'contract_id' : string,
}
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
export type NoteContent = { 'ContractUpdate' : ContractNotification } |
  { 'FriendRequest' : {} };
export interface Notification {
  'id' : string,
  'is_seen' : boolean,
  'content' : NoteContent,
  'sender' : Principal,
  'receiver' : Principal,
}
export type Operation = { 'Equal' : null } |
  { 'Contains' : null } |
  { 'Bigger' : null } |
  { 'BiggerOrEqual' : null };
export interface PaymentContract {
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
export type Result_7 = { 'Ok' : CanisterOutputCertifiedMessages } |
  { 'Err' : string };
export interface Row {
  'id' : string,
  'contract' : [] | [Contract],
  'cells' : [] | [Array<[string, string]>],
  'requests' : [] | [Contract],
}
export interface Share {
  'share_contract_id' : string,
  'accumulation' : bigint,
  'conformed' : boolean,
  'share' : bigint,
  'receiver' : Principal,
  'contractor' : [] | [Principal],
}
export interface SharePayment { 'sender' : Principal, 'amount' : bigint }
export interface ShareRequest {
  'share_contract_id' : string,
  'share' : bigint,
  'receiver' : Principal,
  'contractor' : [] | [Principal],
}
export interface SharesContract {
  'shares' : Array<Share>,
  'payments' : Array<SharePayment>,
  'contract_id' : string,
  'shares_requests' : Array<Share>,
}
export type StoredContract = { 'PaymentContract' : PaymentContract } |
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
export interface WebsocketMessage {
  'sequence_num' : bigint,
  'content' : Uint8Array | number[],
  'client_key' : ClientKey,
  'timestamp' : bigint,
  'is_service_message' : boolean,
}
export interface _SERVICE {
  'accept_friend_request' : ActorMethod<[string], Result>,
  'accept_payment' : ActorMethod<[string], Result_1>,
  'approve_request' : ActorMethod<[Array<string>, string], Result_1>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'cancel_payment' : ActorMethod<[string], Result_1>,
  'conform' : ActorMethod<[string, string], Result_1>,
  'content_updates' : ActorMethod<[string, [] | [string], string], Result_2>,
  'create_new_file' : ActorMethod<[string, [] | [string]], FileNode>,
  'create_payment_contract' : ActorMethod<[string], Result_1>,
  'create_share_contract' : ActorMethod<[Array<Share>], Result_2>,
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
  'get_friends' : ActorMethod<[], [] | [Friend]>,
  'get_initial_data' : ActorMethod<[], Result_4>,
  'get_notifications' : ActorMethod<[], Array<Notification>>,
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
  'pay' : ActorMethod<[string, bigint], Result_1>,
  'register' : ActorMethod<[RegisterUser], Result>,
  'release_payment' : ActorMethod<[string], Result_1>,
  'rename_file' : ActorMethod<[string, string], boolean>,
  'request_share_change' : ActorMethod<[Array<ShareRequest>, string], Result_1>,
  'see_notifications' : ActorMethod<[string], undefined>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'share_file' : ActorMethod<[string, string], Result_2>,
  'unfriend' : ActorMethod<[string], Result>,
  'update_shares' : ActorMethod<[Array<Share>, string], Result_2>,
  'update_user_profile' : ActorMethod<[RegisterUser], Result>,
  'withdraw_usdt' : ActorMethod<[bigint], Result_3>,
  'ws_close' : ActorMethod<[CanisterWsCloseArguments], Result_1>,
  'ws_get_messages' : ActorMethod<[CanisterWsGetMessagesArguments], Result_7>,
  'ws_message' : ActorMethod<
    [CanisterWsMessageArguments, [] | [AppMessage]],
    Result_1
  >,
  'ws_open' : ActorMethod<[CanisterWsOpenArguments], Result_1>,
}
