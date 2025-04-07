import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

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
export interface AddOwnerArgs { 'owner' : Principal }
export interface AddSwapArgs {
  'token0' : Principal,
  'token1' : Principal,
  'pool_canister' : Principal,
}
export interface Affiliate {
  'id' : string,
  'earnings' : Array<ReferralPayments>,
  'stats' : AffiliateStats,
  'users' : Array<ReferredUser>,
}
export interface AffiliateStats {
  'trusted_users' : bigint,
  'total_referrals' : bigint,
  'total_earnings' : number,
}
export interface AppMessage {
  'text' : string,
  'notification' : [] | [Notification],
  'timestamp' : bigint,
}
export interface Approve {
  'fee' : [] | [bigint],
  'from' : Index_Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Index_Account,
}
export interface Availability {
  'id' : string,
  'title' : [] | [string],
  'is_blocked' : boolean,
  'schedule_type' : ScheduleType,
  'time_slots' : Array<TimeSlot>,
}
export interface Burn {
  'from' : Index_Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'spender' : [] | [Index_Account],
}
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
export interface Calendar {
  'id' : string,
  'owner' : string,
  'googleIds' : Array<string>,
  'events' : Array<Event>,
  'availabilities' : Array<Availability>,
}
export interface CalendarActions {
  'delete_availabilities' : Array<string>,
  'delete_events' : Array<string>,
  'events' : Array<Event>,
  'availabilities' : Array<Availability>,
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
  'formats' : Array<string>,
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
  'creator' : string,
  'date_created' : number,
  'payments' : Array<CPayment>,
  'name' : string,
  'formulas' : Array<Formula>,
  'contracts' : Array<CContract>,
  'date_updated' : number,
  'promises' : Array<CPayment>,
}
export type Error = { 'OwnerAlreadyExists' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'SwapAlreadyExists' : null } |
  { 'InsufficientBalance' : { 'balance' : bigint } } |
  { 'InvalidPrincipal' : null } |
  { 'IcCdkError' : { 'message' : string } } |
  { 'OwnerNotFound' : null } |
  { 'SwapNotFound' : null } |
  { 'SwapTokenNotFound' : null } |
  { 'Forbidden' : null } |
  { 'AmountTooSmall' : null };
export interface Event {
  'id' : string,
  'title' : string,
  'description' : string,
  'created_by' : string,
  'end_time' : number,
  'recurrence' : [] | [RecurrenceRule],
  'start_time' : number,
  'attendees' : Array<string>,
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
export interface GetErrorLogsArgs {
  'start' : [] | [bigint],
  'length' : [] | [bigint],
}
export interface GetTransactions {
  'balance' : bigint,
  'transactions' : Array<TransactionWithId>,
  'oldest_tx_id' : [] | [bigint],
}
export interface Index_Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface InitialData {
  'FilesContents' : [] | [Array<[string, Array<ContentNode>]>],
  'Contracts' : Array<[string, StoredContract]>,
  'Files' : Array<FileNode>,
  'Friends' : Array<Friend>,
  'Profile' : User,
  'Wallet' : Wallet,
}
export interface Log {
  'level' : LogLevel,
  'message' : string,
  'timestamp' : bigint,
}
export type LogLevel = { 'Error' : null } |
  { 'Info' : null } |
  { 'Debug' : null };
export interface Message {
  'id' : string,
  'date' : bigint,
  'sender' : Principal,
  'seen_by' : Array<Principal>,
  'message' : string,
  'chat_id' : string,
}
export interface Mint {
  'to' : Index_Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type NoteContent = { 'CustomContract' : [string, CPayment] } |
  { 'ContractUpdate' : ContractNotification } |
  { 'FriendRequest' : FriendRequestNotification } |
  { 'AcceptFriendRequest' : null } |
  { 'ApproveShareRequest' : string } |
  { 'CPaymentContract' : [CPayment, PaymentAction] } |
  { 'Unfriend' : null } |
  { 'ReceivedDeposit' : string } |
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
export interface PayArgs {
  'token' : Principal,
  'memo' : bigint,
  'to_merchant' : Principal,
  'amount' : bigint,
}
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
  'is_comment' : boolean,
  'votes_down' : Array<Principal>,
  'children' : Array<string>,
  'parent' : string,
}
export interface PostUser {
  'id' : string,
  'creator' : UserFE,
  'date_created' : bigint,
  'votes_up' : Array<Principal>,
  'tags' : Array<string>,
  'content_tree' : Array<ContentNode>,
  'is_comment' : boolean,
  'votes_down' : Array<Principal>,
  'children' : Array<string>,
  'parent' : string,
}
export interface Rating {
  'id' : string,
  'date' : number,
  'user_id' : Principal,
  'comment' : string,
  'rating' : number,
}
export type RecurrenceFrequency = { 'Weekly' : null } |
  { 'Daily' : null } |
  { 'Monthly' : null } |
  { 'Yearly' : null };
export interface RecurrenceRule {
  'interval' : number,
  'count' : [] | [number],
  'until' : [] | [number],
  'frequency' : RecurrenceFrequency,
}
export interface ReferralPayments { 'date_created' : number, 'amount' : number }
export interface ReferredUser {
  'id' : string,
  'verified' : boolean,
  'payment_processed' : boolean,
  'trust_score' : number,
}
export interface RegisterUser {
  'name' : [] | [string],
  'description' : [] | [string],
  'email' : [] | [string],
  'photo' : [] | [Uint8Array | number[]],
}
export interface RemoveSwapArgs { 'token0' : Principal, 'token1' : Principal }
export type Result = { 'Ok' : User } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Post } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : ShareFile } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : [FileNode, Array<ContentNode>] } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : SNSStatus } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : UserProfile } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : null } |
  { 'Err' : null };
export type Result_16 = { 'Ok' : Calendar } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : CanisterOutputCertifiedMessages } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : Error };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : GetTransactions } |
  { 'Err' : Error };
export type Result_5 = { 'Ok' : WorkSpace } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Wallet } |
  { 'Err' : Error };
export type Result_7 = { 'Ok' : Affiliate } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : StoredContract } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : InitialData } |
  { 'Err' : string };
export interface Row {
  'id' : string,
  'contract' : [] | [Contract],
  'cells' : [] | [Array<[string, string]>],
}
export interface SNSStatus { 'number_users' : number, 'active_users' : number }
export type ScheduleType = {
    'DateRange' : { 'end_date' : number, 'start_date' : number }
  } |
  {
    'WeeklyRecurring' : {
      'days' : Uint32Array | number[],
      'valid_until' : [] | [number],
    }
  } |
  { 'SpecificDates' : Array<number> };
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
export interface TimeSlot { 'end_time' : bigint, 'start_time' : bigint }
export interface Transaction {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint],
  'approve' : [] | [Approve],
  'timestamp' : bigint,
  'transfer' : [] | [Transfer],
}
export interface TransactionWithId {
  'id' : bigint,
  'transaction' : Transaction,
}
export interface Transfer {
  'to' : Index_Account,
  'fee' : [] | [bigint],
  'from' : Index_Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'spender' : [] | [Index_Account],
}
export interface User {
  'id' : string,
  'name' : string,
  'description' : string,
  'email' : string,
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
  'add_google_calendar_id' : ActorMethod<[string, Array<string>], Result_1>,
  'add_owner' : ActorMethod<[AddOwnerArgs], Result_2>,
  'add_swap' : ActorMethod<[AddSwapArgs], Result_2>,
  'approve_high_promise' : ActorMethod<[CPayment], Result_3>,
  'cancel_friend_request' : ActorMethod<[string], Result>,
  'check_external_transactions' : ActorMethod<[bigint], Result_4>,
  'confirmed_c_payment' : ActorMethod<[CPayment], Result_3>,
  'confirmed_cancellation' : ActorMethod<[CPayment], Result_3>,
  'counter' : ActorMethod<[], bigint>,
  'create_new_file' : ActorMethod<[string, [] | [string]], FileNode>,
  'delete_chat' : ActorMethod<[string], Result_1>,
  'delete_custom_contract' : ActorMethod<[string], Result_3>,
  'delete_file' : ActorMethod<[string], [] | [FileNode]>,
  'delete_post' : ActorMethod<[string], Result_3>,
  'delete_work_space' : ActorMethod<[WorkSpace], Result_5>,
  'deposit_ckusdt' : ActorMethod<[], Result_6>,
  'get_affiliate_data' : ActorMethod<[string], Result_7>,
  'get_all_files' : ActorMethod<[], Array<FileNode>>,
  'get_all_files_content' : ActorMethod<
    [],
    Array<[string, Array<ContentNode>]>
  >,
  'get_calendar' : ActorMethod<[string], [] | [Calendar]>,
  'get_chats_notifications' : ActorMethod<[], Array<Message>>,
  'get_contract' : ActorMethod<[string, string], Result_8>,
  'get_emails' : ActorMethod<[], Array<string>>,
  'get_file' : ActorMethod<[string], [] | [FileNode]>,
  'get_file_content' : ActorMethod<[string], [] | [Array<ContentNode>]>,
  'get_filtered_posts' : ActorMethod<
    [[] | [Array<string>], [] | [string]],
    Array<PostUser>
  >,
  'get_friends' : ActorMethod<[], Array<Friend>>,
  'get_initial_data' : ActorMethod<[], Result_9>,
  'get_logs' : ActorMethod<[GetErrorLogsArgs], Array<Log>>,
  'get_more_files' : ActorMethod<
    [number],
    [Array<FileNode>, Array<[string, Array<ContentNode>]>]
  >,
  'get_my_calendar' : ActorMethod<[], Calendar>,
  'get_my_chats' : ActorMethod<[], Array<FEChat>>,
  'get_owners' : ActorMethod<[], Array<Principal>>,
  'get_post' : ActorMethod<[string], Result_10>,
  'get_posts' : ActorMethod<[bigint, bigint], Array<PostUser>>,
  'get_share_file' : ActorMethod<[string], Result_11>,
  'get_shared_file' : ActorMethod<[string], Result_12>,
  'get_sns_status' : ActorMethod<[], Result_13>,
  'get_swaps' : ActorMethod<[], Array<[Principal, Principal]>>,
  'get_user' : ActorMethod<[string], Result>,
  'get_user_notifications' : ActorMethod<[], Array<Notification>>,
  'get_user_profile' : ActorMethod<[Principal], Result_14>,
  'get_users' : ActorMethod<[], number>,
  'get_work_spaces' : ActorMethod<[], Array<WorkSpace>>,
  'internal_transaction' : ActorMethod<
    [number, string, ExchangeType],
    Result_3
  >,
  'load_more_events' : ActorMethod<[number], Array<Event>>,
  'make_new_chat_room' : ActorMethod<[Chat], Result_1>,
  'message_is_seen' : ActorMethod<[Message], Result_3>,
  'move_file' : ActorMethod<[string, [] | [string]], Result_15>,
  'multi_updates' : ActorMethod<
    [
      Array<FileNode>,
      Array<Array<[string, Array<ContentNode>]>>,
      Array<StoredContract>,
      Array<FileIndexing>,
    ],
    Result_1
  >,
  'object_on_cancel' : ActorMethod<[CPayment, string], Result_3>,
  'pay' : ActorMethod<[PayArgs], Result_2>,
  'rate_user' : ActorMethod<[Principal, Rating], Result_3>,
  'register' : ActorMethod<[string, RegisterUser], Result>,
  'reject_friend_request' : ActorMethod<[string], Result>,
  'remove_owner' : ActorMethod<[AddOwnerArgs], Result_2>,
  'remove_swap' : ActorMethod<[RemoveSwapArgs], Result_2>,
  'save_post' : ActorMethod<[Post], Result_3>,
  'save_work_space' : ActorMethod<[WorkSpace], Result_5>,
  'search_posts' : ActorMethod<[string], Array<PostUser>>,
  'see_notifications' : ActorMethod<[Array<string>], Result_1>,
  'send_friend_request' : ActorMethod<[string], Result>,
  'send_message' : ActorMethod<[[] | [Principal], Message], Result_1>,
  'share_file' : ActorMethod<[ShareFileInput], Result_11>,
  'unfriend' : ActorMethod<[string], Result>,
  'unvote' : ActorMethod<[string], Result_10>,
  'update_calendar' : ActorMethod<[string, CalendarActions], Result_16>,
  'update_chat' : ActorMethod<[Chat], Result_1>,
  'update_user_profile' : ActorMethod<[RegisterUser], Result>,
  'vote_down' : ActorMethod<[string], Result_10>,
  'vote_up' : ActorMethod<[string], Result_10>,
  'withdraw_ckusdt' : ActorMethod<[bigint, string], Result_6>,
  'ws_close' : ActorMethod<[CanisterWsCloseArguments], Result_3>,
  'ws_get_messages' : ActorMethod<[CanisterWsGetMessagesArguments], Result_17>,
  'ws_message' : ActorMethod<
    [CanisterWsMessageArguments, [] | [AppMessage]],
    Result_3
  >,
  'ws_open' : ActorMethod<[CanisterWsOpenArguments], Result_3>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
