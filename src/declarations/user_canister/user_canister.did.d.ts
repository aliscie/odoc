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
  'is_end_of_queue' : boolean,
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
  'date_created' : bigint,
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
  'permission' : ShareFilePermission,
  'share_id' : [] | [string],
  'name' : string,
  'children' : Array<string>,
  'author' : string,
  'users_permissions' : Array<[Principal, ShareFilePermission]>,
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
export interface Friend { 'sender' : User, 'receiver' : User }
export interface FriendSystem {
  'friend_requests' : Array<Friend>,
  'friends' : Array<Friend>,
}
export interface InitialData {
  'FilesContents' : [] | [Array<[string, Array<ContentNode>]>],
  'Contracts' : Array<[string, StoredContract]>,
  'Files' : [] | [Array<[string, FileNode]>],
  'Friends' : [] | [FriendSystem],
  'Profile' : User,
  'DiscoverUsers' : Array<[string, User]>,
  'Wallet' : Wallet,
}
export type NoteContent = { 'ContractUpdate' : ContractNotification } |
  { 'FriendRequest' : {} } |
  { 'AcceptFriendRequest' : null } |
  { 'ApproveShareRequest' : string } |
  { 'Unfriend' : null } |
  { 'PaymentCancelled' : string } |
  { 'PaymentReleased' : string } |
  { 'ShareRequestApplied' : SharesContract } |
  { 'ShareRequestApproved' : SharesContract } |
  { 'ConformShare' : string } |
  { 'SharePayment' : SharesContract } |
  { 'AcceptPayment' : string } |
  { 'ApplyShareRequest' : string };
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
  'extra_cells' : Array<[string, string]>,
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
export interface Post {
  'id' : string,
  'creator' : string,
  'date_created' : bigint,
  'votes_up' : Array<Principal>,
  'tags' : Array<string>,
  'content_tree' : Array<ContentNode>,
  'votes_down' : Array<Principal>,
}
export interface PostUser {
  'id' : string,
  'creator' : UserPost,
  'date_created' : bigint,
  'votes_up' : Array<Principal>,
  'tags' : Array<string>,
  'content_tree' : Array<ContentNode>,
  'votes_down' : Array<Principal>,
}
export interface RegisterUser {
  'name' : [] | [string],
  'description' : [] | [string],
  'photo' : [] | [Uint8Array | number[]],
}
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : CanisterOutputCertifiedMessages } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : StoredContract } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : InitialData } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Post } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : ShareFile } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : [FileNode, Array<ContentNode>] } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : null } |
  { 'Err' : null };
export interface Row {
  'id' : string,
  'contract' : [] | [Contract],
  'cells' : [] | [Array<[string, string]>],
}
export interface Share {
  'extra_cells' : Array<[string, string]>,
  'share_contract_id' : string,
  'accumulation' : bigint,
  'share' : bigint,
  'confirmed' : boolean,
  'receiver' : Principal,
}
export interface ShareFile { 'id' : string, 'owner' : Principal }
export interface ShareFileInput {
  'id' : string,
  'permission' : ShareFilePermission,
  'owner' : Principal,
  'users_permissions' : Array<[Principal, ShareFilePermission]>,
}
export type ShareFilePermission = { 'CanComment' : null } |
  { 'None' : null } |
  { 'CanView' : null } |
  { 'CanUpdate' : null };
export interface SharePayment { 'sender' : Principal, 'amount' : bigint }
export interface SharePaymentOption {
  'id' : string,
  'title' : string,
  'date' : string,
  'description' : string,
  'amount' : bigint,
}
export interface ShareRequest {
  'id' : string,
  'requester' : Principal,
  'shares' : Array<Share>,
  'is_applied' : boolean,
  'name' : string,
  'approvals' : Array<Principal>,
}
export interface SharesContract {
  'payment_options' : Array<SharePaymentOption>,
  'shares' : Array<Share>,
  'payments' : Array<SharePayment>,
  'contract_id' : string,
  'author' : string,
  'shares_requests' : Array<[string, ShareRequest]>,
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
export interface UserPost { 'id' : string, 'name' : string }
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
  'apply_request' : ActorMethod<[string, string, string], Result_1>,
  'approve_request' : ActorMethod<[string, string, string], Result_1>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'cancel_payment' : ActorMethod<[string], Result_1>,
  'conform_share' : ActorMethod<[string, string, string], Result_1>,
  'content_updates' : ActorMethod<[string, [] | [string], string], Result_2>,
  'counter' : ActorMethod<[], bigint>,
  'create_new_file' : ActorMethod<[string, [] | [string]], FileNode>,
  'create_payment_contract' : ActorMethod<[string], Result_1>,
  'create_share_contract' : ActorMethod<[Array<Share>], Result_2>,
  'delete_file' : ActorMethod<[string], [] | [FileNode]>,
  'delete_payment' : ActorMethod<[string], Result_1>,
  'delete_post' : ActorMethod<[string], Result_1>,
  'deposit_usdt' : ActorMethod<[bigint], Result_3>,
  'get_all_files' : ActorMethod<[], [] | [Array<[string, FileNode]>]>,
  'get_all_files_content' : ActorMethod<
    [],
    Array<[string, Array<ContentNode>]>
  >,
  'get_all_users' : ActorMethod<[], Array<[string, User]>>,
  'get_contract' : ActorMethod<[string, string], Result_4>,
  'get_file' : ActorMethod<[string], [] | [FileNode]>,
  'get_file_content' : ActorMethod<[string], [] | [Array<ContentNode>]>,
  'get_filtered_posts' : ActorMethod<
    [[] | [Array<string>], [] | [string]],
    Array<PostUser>
  >,
  'get_friends' : ActorMethod<[], [] | [FriendSystem]>,
  'get_initial_data' : ActorMethod<[], Result_5>,
  'get_notifications' : ActorMethod<[], Array<Notification>>,
  'get_post' : ActorMethod<[string], Result_6>,
  'get_posts' : ActorMethod<[bigint, bigint], Array<PostUser>>,
  'get_share_file' : ActorMethod<[string], Result_7>,
  'get_shared_file' : ActorMethod<[string], Result_8>,
  'get_user' : ActorMethod<[string], Result>,
  'move_file' : ActorMethod<[string, [] | [string]], Result_9>,
  'multi_updates' : ActorMethod<
    [
      Array<FileNode>,
      Array<Array<[string, Array<ContentNode>]>>,
      Array<StoredContract>,
      Array<string>,
    ],
    Result_2
  >,
  'pay_for_share_contract' : ActorMethod<[string, bigint, string], Result_1>,
  'register' : ActorMethod<[RegisterUser], Result>,
  'reject_friend_request' : ActorMethod<[string], Result>,
  'release_payment' : ActorMethod<[string], Result_1>,
  'rename_file' : ActorMethod<[string, string], boolean>,
  'save_post' : ActorMethod<[Post], Result_1>,
  'search_files_content' : ActorMethod<
    [string, boolean],
    Array<[string, Array<ContentNode>]>
  >,
  'search_posts' : ActorMethod<[string], Array<PostUser>>,
  'see_notifications' : ActorMethod<[string], undefined>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'share_file' : ActorMethod<[ShareFileInput], Result_7>,
  'unfriend' : ActorMethod<[string], Result>,
  'update_user_profile' : ActorMethod<[RegisterUser], Result>,
  'vote_down' : ActorMethod<[string], Result_6>,
  'vote_up' : ActorMethod<[string], Result_6>,
  'withdraw_usdt' : ActorMethod<[bigint], Result_3>,
  'ws_close' : ActorMethod<[CanisterWsCloseArguments], Result_1>,
  'ws_get_messages' : ActorMethod<[CanisterWsGetMessagesArguments], Result_10>,
  'ws_message' : ActorMethod<
    [CanisterWsMessageArguments, [] | [AppMessage]],
    Result_1
  >,
  'ws_open' : ActorMethod<[CanisterWsOpenArguments], Result_1>,
}
