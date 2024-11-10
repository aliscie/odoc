import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface ActionRating {
  'id' : string,
  'action_type' : ActionType,
  'date' : number,
  'received_promises' : number,
  'spent' : number,
  'rating' : number,
  'received' : number,
  'promises' : number,
}
export type ActionType = { 'Payment' : CPayment };
export interface AppMessage {
  'text' : string,
  'notification' : [] | [Notification],
  'timestamp' : bigint,
}
export type BlockTag = { 'Earliest' : null } |
  { 'Safe' : null } |
  { 'Finalized' : null } |
  { 'Latest' : null } |
  { 'Number' : bigint } |
  { 'Pending' : null };
export interface CCell { 'id' : string, 'field' : string, 'value' : string }
export interface CColumn {
  'id' : string,
  'field' : string,
  'formula_string' : string,
  'column_type' : string,
  'filters' : Array<Filter>,
  'permissions' : Array<PermissionType>,
  'name' : string,
  'editable' : boolean,
  'deletable' : boolean,
}
export interface CContract {
  'id' : string,
  'creator' : Principal,
  'date_created' : number,
  'name' : string,
  'rows' : Array<CRow>,
  'columns' : Array<CColumn>,
}
export interface CPayment {
  'id' : string,
  'status' : PaymentStatus,
  'date_created' : number,
  'date_released' : number,
  'cells' : Array<CCell>,
  'contract_id' : string,
  'sender' : Principal,
  'amount' : number,
  'receiver' : Principal,
}
export interface CRow { 'id' : string, 'cells' : Array<CCell> }
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
export interface Chat {
  'id' : string,
  'creator' : Principal,
  'members' : Array<Principal>,
  'messages' : Array<Message>,
  'name' : string,
  'workspaces' : Array<string>,
  'admins' : Array<Principal>,
}
export interface ClientKey {
  'client_principal' : Principal,
  'client_nonce' : bigint,
}
export interface Column {
  'id' : string,
  '_type' : string,
  'field' : string,
  'filters' : Array<Filter>,
  'permissions' : Array<PermissionType>,
  'dataValidator' : [] | [string],
  'editable' : boolean,
  'formula' : [] | [Formula],
}
export type ContentData = { 'Comment' : string } |
  { 'Image' : BigUint64Array | bigint[] } |
  { 'Table' : Table };
export interface ContentNode {
  'id' : string,
  '_type' : string,
  'value' : string,
  'data' : [] | [ContentData],
  'text' : string,
  'children' : Array<string>,
  'language' : string,
  'indent' : bigint,
  'listStart' : bigint,
  'parent' : [] | [string],
  'listStyleType' : string,
}
export type Contract = { 'SharesContract' : string };
export interface ContractNotification {
  'contract_type' : string,
  'contract_id' : string,
}
export type ContractPermissionType = { 'Add' : Principal } |
  { 'Edit' : Principal } |
  { 'View' : Principal } |
  { 'AnyOneView' : null } |
  { 'AnyOneEdite' : null } |
  { 'AnyOneAdd' : null };
export interface CustomContract {
  'id' : string,
  'permissions' : Array<ContractPermissionType>,
  'creator' : Principal,
  'date_created' : number,
  'payments' : Array<CPayment>,
  'name' : string,
  'formulas' : Array<Formula>,
  'contracts' : Array<CContract>,
  'date_updated' : number,
  'promises' : Array<CPayment>,
}
export interface Exchange {
  'to' : string,
  '_type' : ExchangeType,
  'date_created' : number,
  'from' : string,
  'amount' : number,
}
export type ExchangeType = { 'Withdraw' : null } |
  { 'Deposit' : null } |
  { 'LocalSend' : null } |
  { 'LocalReceive' : null };
export type Execute = { 'TransferNft' : null } |
  { 'TransferToken' : null } |
  { 'TransferUsdt' : CPayment };
export interface FEChat {
  'id' : string,
  'creator' : UserFE,
  'members' : Array<Principal>,
  'messages' : Array<Message>,
  'name' : string,
  'workspaces' : Array<string>,
  'admins' : Array<UserFE>,
}
export interface FileIndexing {
  'id' : string,
  'new_index' : bigint,
  'parent' : [] | [string],
}
export interface FileNode {
  'id' : string,
  'permission' : ShareFilePermission,
  'content_id' : [] | [string],
  'share_id' : [] | [string],
  'name' : string,
  'workspaces' : Array<string>,
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
export interface Formula { 'column_id' : string, 'execute' : Execute }
export interface Friend {
  'id' : string,
  'sender' : User,
  'confirmed' : boolean,
  'receiver' : User,
}
export interface FriendRequestNotification { 'friend' : Friend }
export interface InitialData {
  'FilesContents' : [] | [Array<[string, Array<ContentNode>]>],
  'Contracts' : Array<[string, StoredContract]>,
  'Files' : Array<FileNode>,
  'Friends' : Array<Friend>,
  'Profile' : User,
  'DiscoverUsers' : Array<[string, User]>,
  'Wallet' : Wallet,
}
export interface Message {
  'id' : string,
  'date' : bigint,
  'sender' : Principal,
  'seen_by' : Array<Principal>,
  'message' : string,
  'chat_id' : string,
}
export type NoteContent = { 'CustomContract' : [string, CPayment] } |
  { 'ContractUpdate' : ContractNotification } |
  { 'FriendRequest' : FriendRequestNotification } |
  { 'AcceptFriendRequest' : null } |
  { 'ApproveShareRequest' : string } |
  { 'CPaymentContract' : [CPayment, PaymentAction] } |
  { 'Unfriend' : null } |
  { 'ConformShare' : string } |
  { 'ApplyShareRequest' : string } |
  { 'NewMessage' : Message } |
  { 'RemovedFromChat' : string };
export interface Notification {
  'id' : string,
  'is_seen' : boolean,
  'content' : NoteContent,
  'time' : number,
  'sender' : Principal,
  'receiver' : Principal,
}
export type Operation = { 'Equal' : null } |
  { 'Contains' : null } |
  { 'Bigger' : null } |
  { 'BiggerOrEqual' : null };
export type PaymentAction = { 'RequestCancellation' : CPayment } |
  { 'Released' : null } |
  { 'Objected' : null } |
  { 'Accepted' : null } |
  { 'Update' : null } |
  { 'Cancelled' : null } |
  { 'Promise' : null };
export type PaymentStatus = { 'None' : null } |
  { 'RequestCancellation' : null } |
  { 'Released' : null } |
  { 'Objected' : string } |
  { 'Confirmed' : null } |
  { 'ConfirmedCancellation' : null } |
  { 'ApproveHighPromise' : null } |
  { 'HighPromise' : null };
export type PermissionType = { 'Edit' : Principal } |
  { 'View' : Principal } |
  { 'AnyOneView' : null } |
  { 'AnyOneEdite' : null };
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
  'creator' : UserFE,
  'date_created' : bigint,
  'votes_up' : Array<Principal>,
  'tags' : Array<string>,
  'content_tree' : Array<ContentNode>,
  'votes_down' : Array<Principal>,
}
export interface Rating {
  'id' : string,
  'date' : number,
  'user_id' : Principal,
  'comment' : string,
  'rating' : number,
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
export type Result_10 = { 'Ok' : UserProfile } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : CPayment } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : null } |
  { 'Err' : null };
export type Result_13 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : CanisterOutputCertifiedMessages } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : WorkSpace } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : number } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : StoredContract } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : InitialData } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Post } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : ShareFile } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : [FileNode, Array<ContentNode>] } |
  { 'Err' : string };
export interface Row {
  'id' : string,
  'contract' : [] | [Contract],
  'cells' : [] | [Array<[string, string]>],
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
export type StoredContract = { 'CustomContract' : CustomContract };
export interface Table { 'rows' : Array<Row>, 'columns' : Array<Column> }
export interface TransferArgs { 'to_account' : Account, 'amount' : bigint }
export interface User {
  'id' : string,
  'name' : string,
  'description' : string,
  'photo' : Uint8Array | number[],
}
export interface UserFE { 'id' : string, 'name' : string }
export interface UserProfile {
  'id' : Principal,
  'actions_rate' : number,
  'balance' : number,
  'rates_by_actions' : Array<ActionRating>,
  'name' : string,
  'description' : string,
  'total_debt' : number,
  'spent' : number,
  'rates_by_others' : Array<Rating>,
  'users_rate' : number,
  'users_interacted' : number,
  'photo' : Uint8Array | number[],
  'debts' : Array<string>,
  'received' : number,
}
export interface UserToken {
  'decimals' : [] | [number],
  'version' : [] | [bigint],
  'enabled' : [] | [boolean],
  'chain_id' : bigint,
  'contract_address' : string,
  'symbol' : [] | [string],
}
export interface Wallet {
  'balance' : number,
  'owner' : string,
  'total_debt' : number,
  'spent' : number,
  'exchanges' : Array<Exchange>,
  'debts' : Array<[string, number]>,
  'received' : number,
}
export interface WebsocketMessage {
  'sequence_num' : bigint,
  'content' : Uint8Array | number[],
  'client_key' : ClientKey,
  'timestamp' : bigint,
  'is_service_message' : boolean,
}
export interface WorkSpace {
  'id' : string,
  'files' : Array<string>,
  'creator' : Principal,
  'members' : Array<Principal>,
  'chats' : Array<string>,
  'name' : string,
  'admins' : Array<Principal>,
}
export interface _SERVICE {
  'accept_friend_request' : ActorMethod<[string], Result>,
  'approve_high_promise' : ActorMethod<[CPayment], Result_1>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'confirmed_c_payment' : ActorMethod<[CPayment], Result_1>,
  'confirmed_cancellation' : ActorMethod<[CPayment], Result_1>,
  'counter' : ActorMethod<[], bigint>,
  'create_new_file' : ActorMethod<[string, [] | [string]], FileNode>,
  'delete_chat' : ActorMethod<[string], Result_2>,
  'delete_custom_contract' : ActorMethod<[string], Result_1>,
  'delete_file' : ActorMethod<[string], [] | [FileNode]>,
  'delete_post' : ActorMethod<[string], Result_1>,
  'delete_work_space' : ActorMethod<[WorkSpace], Result_3>,
  'deposit_principal' : ActorMethod<[], string>,
  'deposit_usdt' : ActorMethod<[number], Result_4>,
  'ethereum_address' : ActorMethod<[[] | [Principal]], string>,
  'get_all_files' : ActorMethod<[], Array<FileNode>>,
  'get_all_files_content' : ActorMethod<
    [],
    Array<[string, Array<ContentNode>]>
  >,
  'get_balance' : ActorMethod<[[] | [string]], bigint>,
  'get_chats_notifications' : ActorMethod<[], Array<Message>>,
  'get_contract' : ActorMethod<[string, string], Result_5>,
  'get_file' : ActorMethod<[string], [] | [FileNode]>,
  'get_file_content' : ActorMethod<[string], [] | [Array<ContentNode>]>,
  'get_filtered_posts' : ActorMethod<
    [[] | [Array<string>], [] | [string]],
    Array<PostUser>
  >,
  'get_friends' : ActorMethod<[], Array<Friend>>,
  'get_initial_data' : ActorMethod<[], Result_6>,
  'get_more_files' : ActorMethod<
    [number],
    [Array<FileNode>, Array<[string, Array<ContentNode>]>]
  >,
  'get_my_chats' : ActorMethod<[], Array<FEChat>>,
  'get_post' : ActorMethod<[string], Result_7>,
  'get_posts' : ActorMethod<[bigint, bigint], Array<PostUser>>,
  'get_share_file' : ActorMethod<[string], Result_8>,
  'get_shared_file' : ActorMethod<[string], Result_9>,
  'get_user' : ActorMethod<[string], Result>,
  'get_user_notifications' : ActorMethod<[], Array<Notification>>,
  'get_user_profile' : ActorMethod<[Principal], Result_10>,
  'get_work_spaces' : ActorMethod<[], Array<WorkSpace>>,
  'internal_transaction' : ActorMethod<[number, string], Result_11>,
  'make_new_chat_room' : ActorMethod<[Chat], Result_2>,
  'message_is_seen' : ActorMethod<[Message], Result_1>,
  'move_file' : ActorMethod<[string, [] | [string]], Result_12>,
  'multi_updates' : ActorMethod<
    [
      Array<FileNode>,
      Array<Array<[string, Array<ContentNode>]>>,
      Array<StoredContract>,
      Array<FileIndexing>,
    ],
    Result_2
  >,
  'object_on_cancel' : ActorMethod<[CPayment, string], Result_1>,
  'rate_user' : ActorMethod<[Principal, Rating], Result_1>,
  'register' : ActorMethod<[RegisterUser], Result>,
  'reject_friend_request' : ActorMethod<[string], Result>,
  'save_post' : ActorMethod<[Post], Result_1>,
  'save_work_space' : ActorMethod<[WorkSpace], Result_3>,
  'search_files_content' : ActorMethod<
    [string, boolean],
    Array<[string, Array<ContentNode>]>
  >,
  'search_posts' : ActorMethod<[string], Array<PostUser>>,
  'see_notifications' : ActorMethod<[string], Result_2>,
  'send_eth' : ActorMethod<[string, number], string>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'send_message' : ActorMethod<[[] | [Principal], Message], Result_2>,
  'set_user_token' : ActorMethod<[UserToken], undefined>,
  'share_file' : ActorMethod<[ShareFileInput], Result_8>,
  'transaction_count' : ActorMethod<
    [[] | [Principal], [] | [BlockTag]],
    bigint
  >,
  'transfer' : ActorMethod<[TransferArgs], Result_13>,
  'unfriend' : ActorMethod<[string], Result>,
  'update_chat' : ActorMethod<[Chat], Result_2>,
  'update_user_profile' : ActorMethod<[RegisterUser], Result>,
  'vote_down' : ActorMethod<[string], Result_7>,
  'vote_up' : ActorMethod<[string], Result_7>,
  'withdraw_usdt' : ActorMethod<[number], Result_4>,
  'ws_close' : ActorMethod<[CanisterWsCloseArguments], Result_1>,
  'ws_get_messages' : ActorMethod<[CanisterWsGetMessagesArguments], Result_14>,
  'ws_message' : ActorMethod<
    [CanisterWsMessageArguments, [] | [AppMessage]],
    Result_1
  >,
  'ws_open' : ActorMethod<[CanisterWsOpenArguments], Result_1>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
