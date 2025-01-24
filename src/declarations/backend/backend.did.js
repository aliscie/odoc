export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'email' : IDL.Text,
    'photo' : IDL.Vec(IDL.Nat8),
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const AddOwnerArgs = IDL.Record({ 'owner' : IDL.Principal });
  const Error = IDL.Variant({
    'OwnerAlreadyExists' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'SwapAlreadyExists' : IDL.Null,
    'InsufficientBalance' : IDL.Record({ 'balance' : IDL.Nat }),
    'InvalidPrincipal' : IDL.Null,
    'IcCdkError' : IDL.Record({ 'message' : IDL.Text }),
    'OwnerNotFound' : IDL.Null,
    'SwapNotFound' : IDL.Null,
    'SwapTokenNotFound' : IDL.Null,
    'Forbidden' : IDL.Null,
    'AmountTooSmall' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : Error });
  const AddSwapArgs = IDL.Record({
    'token0' : IDL.Principal,
    'token1' : IDL.Principal,
    'pool_canister' : IDL.Principal,
  });
  const PaymentStatus = IDL.Variant({
    'None' : IDL.Null,
    'RequestCancellation' : IDL.Null,
    'Released' : IDL.Null,
    'Objected' : IDL.Text,
    'Confirmed' : IDL.Null,
    'ConfirmedCancellation' : IDL.Null,
    'ApproveHighPromise' : IDL.Null,
    'HighPromise' : IDL.Null,
  });
  const CCell = IDL.Record({
    'id' : IDL.Text,
    'field' : IDL.Text,
    'value' : IDL.Text,
  });
  const CPayment = IDL.Record({
    'id' : IDL.Text,
    'status' : PaymentStatus,
    'date_created' : IDL.Float64,
    'date_released' : IDL.Float64,
    'cells' : IDL.Vec(CCell),
    'contract_id' : IDL.Text,
    'sender' : IDL.Principal,
    'amount' : IDL.Float64,
    'receiver' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Index_Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Burn = IDL.Record({
    'from' : Index_Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'spender' : IDL.Opt(Index_Account),
  });
  const Mint = IDL.Record({
    'to' : Index_Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
  });
  const Approve = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Index_Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'expected_allowance' : IDL.Opt(IDL.Nat),
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Index_Account,
  });
  const Transfer = IDL.Record({
    'to' : Index_Account,
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Index_Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'spender' : IDL.Opt(Index_Account),
  });
  const Transaction = IDL.Record({
    'burn' : IDL.Opt(Burn),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint),
    'approve' : IDL.Opt(Approve),
    'timestamp' : IDL.Nat64,
    'transfer' : IDL.Opt(Transfer),
  });
  const TransactionWithId = IDL.Record({
    'id' : IDL.Nat,
    'transaction' : Transaction,
  });
  const GetTransactions = IDL.Record({
    'balance' : IDL.Nat,
    'transactions' : IDL.Vec(TransactionWithId),
    'oldest_tx_id' : IDL.Opt(IDL.Nat),
  });
  const Result_3 = IDL.Variant({ 'Ok' : GetTransactions, 'Err' : Error });
  const ShareFilePermission = IDL.Variant({
    'CanComment' : IDL.Null,
    'None' : IDL.Null,
    'CanView' : IDL.Null,
    'CanUpdate' : IDL.Null,
  });
  const FileNode = IDL.Record({
    'id' : IDL.Text,
    'permission' : ShareFilePermission,
    'content_id' : IDL.Opt(IDL.Text),
    'share_id' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'workspaces' : IDL.Vec(IDL.Text),
    'children' : IDL.Vec(IDL.Text),
    'author' : IDL.Text,
    'users_permissions' : IDL.Vec(
      IDL.Tuple(IDL.Principal, ShareFilePermission)
    ),
    'parent' : IDL.Opt(IDL.Text),
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const WorkSpace = IDL.Record({
    'id' : IDL.Text,
    'files' : IDL.Vec(IDL.Text),
    'creator' : IDL.Principal,
    'members' : IDL.Vec(IDL.Principal),
    'chats' : IDL.Vec(IDL.Text),
    'name' : IDL.Text,
    'admins' : IDL.Vec(IDL.Principal),
  });
  const Result_5 = IDL.Variant({ 'Ok' : WorkSpace, 'Err' : IDL.Text });
  const ExchangeType = IDL.Variant({
    'Withdraw' : IDL.Null,
    'Deposit' : IDL.Null,
    'LocalSend' : IDL.Null,
    'LocalReceive' : IDL.Null,
  });
  const Exchange = IDL.Record({
    'to' : IDL.Text,
    '_type' : ExchangeType,
    'date_created' : IDL.Float64,
    'from' : IDL.Text,
    'amount' : IDL.Float64,
  });
  const Wallet = IDL.Record({
    'balance' : IDL.Float64,
    'owner' : IDL.Text,
    'total_debt' : IDL.Float64,
    'spent' : IDL.Float64,
    'exchanges' : IDL.Vec(Exchange),
    'debts' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
    'received' : IDL.Float64,
  });
  const Result_6 = IDL.Variant({ 'Ok' : Wallet, 'Err' : Error });
  const ReferralPayments = IDL.Record({
    'date_created' : IDL.Float64,
    'amount' : IDL.Float64,
  });
  const AffiliateStats = IDL.Record({
    'trusted_users' : IDL.Nat64,
    'total_referrals' : IDL.Nat64,
    'total_earnings' : IDL.Float64,
  });
  const ReferredUser = IDL.Record({
    'id' : IDL.Text,
    'verified' : IDL.Bool,
    'payment_processed' : IDL.Bool,
    'trust_score' : IDL.Float64,
  });
  const Affiliate = IDL.Record({
    'id' : IDL.Text,
    'earnings' : IDL.Vec(ReferralPayments),
    'stats' : AffiliateStats,
    'users' : IDL.Vec(ReferredUser),
  });
  const Result_7 = IDL.Variant({ 'Ok' : Affiliate, 'Err' : IDL.Text });
  const Contract = IDL.Variant({ 'SharesContract' : IDL.Text });
  const Row = IDL.Record({
    'id' : IDL.Text,
    'contract' : IDL.Opt(Contract),
    'cells' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
  });
  const Operation = IDL.Variant({
    'Equal' : IDL.Null,
    'Contains' : IDL.Null,
    'Bigger' : IDL.Null,
    'BiggerOrEqual' : IDL.Null,
  });
  const Filter = IDL.Record({
    'name' : IDL.Text,
    'operations' : IDL.Vec(Operation),
    'formula' : IDL.Opt(IDL.Text),
  });
  const PermissionType = IDL.Variant({
    'Edit' : IDL.Principal,
    'View' : IDL.Principal,
    'AnyOneView' : IDL.Null,
    'AnyOneEdite' : IDL.Null,
  });
  const Execute = IDL.Variant({
    'TransferNft' : IDL.Null,
    'TransferToken' : IDL.Null,
    'TransferUsdt' : CPayment,
  });
  const Formula = IDL.Record({ 'column_id' : IDL.Text, 'execute' : Execute });
  const Column = IDL.Record({
    'id' : IDL.Text,
    '_type' : IDL.Text,
    'field' : IDL.Text,
    'filters' : IDL.Vec(Filter),
    'permissions' : IDL.Vec(PermissionType),
    'dataValidator' : IDL.Opt(IDL.Text),
    'editable' : IDL.Bool,
    'formula' : IDL.Opt(Formula),
  });
  const Table = IDL.Record({
    'rows' : IDL.Vec(Row),
    'columns' : IDL.Vec(Column),
  });
  const ContentData = IDL.Variant({
    'Comment' : IDL.Text,
    'Image' : IDL.Vec(IDL.Nat64),
    'Table' : Table,
  });
  const ContentNode = IDL.Record({
    'id' : IDL.Text,
    '_type' : IDL.Text,
    'value' : IDL.Text,
    'data' : IDL.Opt(ContentData),
    'text' : IDL.Text,
    'children' : IDL.Vec(IDL.Text),
    'language' : IDL.Text,
    'indent' : IDL.Nat64,
    'listStart' : IDL.Nat64,
    'formats' : IDL.Vec(IDL.Text),
    'parent' : IDL.Opt(IDL.Text),
    'listStyleType' : IDL.Text,
  });
  const Message = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Nat64,
    'sender' : IDL.Principal,
    'seen_by' : IDL.Vec(IDL.Principal),
    'message' : IDL.Text,
    'chat_id' : IDL.Text,
  });
  const ContractPermissionType = IDL.Variant({
    'Add' : IDL.Principal,
    'Edit' : IDL.Principal,
    'View' : IDL.Principal,
    'AnyOneView' : IDL.Null,
    'AnyOneEdite' : IDL.Null,
    'AnyOneAdd' : IDL.Null,
  });
  const CRow = IDL.Record({ 'id' : IDL.Text, 'cells' : IDL.Vec(CCell) });
  const CColumn = IDL.Record({
    'id' : IDL.Text,
    'field' : IDL.Text,
    'formula_string' : IDL.Text,
    'column_type' : IDL.Text,
    'filters' : IDL.Vec(Filter),
    'permissions' : IDL.Vec(PermissionType),
    'name' : IDL.Text,
    'editable' : IDL.Bool,
    'deletable' : IDL.Bool,
  });
  const CContract = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'date_created' : IDL.Float64,
    'name' : IDL.Text,
    'rows' : IDL.Vec(CRow),
    'columns' : IDL.Vec(CColumn),
  });
  const CustomContract = IDL.Record({
    'id' : IDL.Text,
    'permissions' : IDL.Vec(ContractPermissionType),
    'creator' : IDL.Text,
    'date_created' : IDL.Float64,
    'payments' : IDL.Vec(CPayment),
    'name' : IDL.Text,
    'formulas' : IDL.Vec(Formula),
    'contracts' : IDL.Vec(CContract),
    'date_updated' : IDL.Float64,
    'promises' : IDL.Vec(CPayment),
  });
  const StoredContract = IDL.Variant({ 'CustomContract' : CustomContract });
  const Result_8 = IDL.Variant({ 'Ok' : StoredContract, 'Err' : IDL.Text });
  const UserFE = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const PostUser = IDL.Record({
    'id' : IDL.Text,
    'creator' : UserFE,
    'date_created' : IDL.Nat64,
    'votes_up' : IDL.Vec(IDL.Principal),
    'tags' : IDL.Vec(IDL.Text),
    'content_tree' : IDL.Vec(ContentNode),
    'is_comment' : IDL.Bool,
    'votes_down' : IDL.Vec(IDL.Principal),
    'children' : IDL.Vec(IDL.Text),
    'parent' : IDL.Text,
  });
  const Friend = IDL.Record({
    'id' : IDL.Text,
    'sender' : User,
    'confirmed' : IDL.Bool,
    'receiver' : User,
  });
  const InitialData = IDL.Record({
    'FilesContents' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))
    ),
    'Contracts' : IDL.Vec(IDL.Tuple(IDL.Text, StoredContract)),
    'Files' : IDL.Vec(FileNode),
    'Friends' : IDL.Vec(Friend),
    'Profile' : User,
    'DiscoverUsers' : IDL.Vec(IDL.Tuple(IDL.Text, User)),
    'Wallet' : Wallet,
  });
  const Result_9 = IDL.Variant({ 'Ok' : InitialData, 'Err' : IDL.Text });
  const GetErrorLogsArgs = IDL.Record({
    'start' : IDL.Opt(IDL.Nat64),
    'length' : IDL.Opt(IDL.Nat64),
  });
  const LogLevel = IDL.Variant({
    'Error' : IDL.Null,
    'Info' : IDL.Null,
    'Debug' : IDL.Null,
  });
  const Log = IDL.Record({
    'level' : LogLevel,
    'message' : IDL.Text,
    'timestamp' : IDL.Nat64,
  });
  const FEChat = IDL.Record({
    'id' : IDL.Text,
    'creator' : UserFE,
    'members' : IDL.Vec(IDL.Principal),
    'messages' : IDL.Vec(Message),
    'name' : IDL.Text,
    'workspaces' : IDL.Vec(IDL.Text),
    'admins' : IDL.Vec(UserFE),
  });
  const Post = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Text,
    'date_created' : IDL.Nat64,
    'votes_up' : IDL.Vec(IDL.Principal),
    'tags' : IDL.Vec(IDL.Text),
    'content_tree' : IDL.Vec(ContentNode),
    'is_comment' : IDL.Bool,
    'votes_down' : IDL.Vec(IDL.Principal),
    'children' : IDL.Vec(IDL.Text),
    'parent' : IDL.Text,
  });
  const Result_10 = IDL.Variant({ 'Ok' : Post, 'Err' : IDL.Text });
  const ShareFile = IDL.Record({ 'id' : IDL.Text, 'owner' : IDL.Principal });
  const Result_11 = IDL.Variant({ 'Ok' : ShareFile, 'Err' : IDL.Text });
  const Result_12 = IDL.Variant({
    'Ok' : IDL.Tuple(FileNode, IDL.Vec(ContentNode)),
    'Err' : IDL.Text,
  });
  const SNSStatus = IDL.Record({
    'number_users' : IDL.Float64,
    'active_users' : IDL.Float64,
  });
  const Result_13 = IDL.Variant({ 'Ok' : SNSStatus, 'Err' : IDL.Text });
  const ContractNotification = IDL.Record({
    'contract_type' : IDL.Text,
    'contract_id' : IDL.Text,
  });
  const FriendRequestNotification = IDL.Record({ 'friend' : Friend });
  const PaymentAction = IDL.Variant({
    'RequestCancellation' : CPayment,
    'Released' : IDL.Null,
    'Objected' : IDL.Null,
    'Accepted' : IDL.Null,
    'Update' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Promise' : IDL.Null,
  });
  const NoteContent = IDL.Variant({
    'CustomContract' : IDL.Tuple(IDL.Text, CPayment),
    'ContractUpdate' : ContractNotification,
    'FriendRequest' : FriendRequestNotification,
    'AcceptFriendRequest' : IDL.Null,
    'ApproveShareRequest' : IDL.Text,
    'CPaymentContract' : IDL.Tuple(CPayment, PaymentAction),
    'Unfriend' : IDL.Null,
    'ReceivedDeposit' : IDL.Text,
    'ApplyShareRequest' : IDL.Text,
    'NewMessage' : Message,
    'RemovedFromChat' : IDL.Text,
  });
  const Notification = IDL.Record({
    'id' : IDL.Text,
    'is_seen' : IDL.Bool,
    'content' : NoteContent,
    'time' : IDL.Float64,
    'sender' : IDL.Principal,
    'receiver' : IDL.Principal,
  });
  const ActionType = IDL.Variant({ 'Payment' : CPayment });
  const ActionRating = IDL.Record({
    'id' : IDL.Text,
    'action_type' : ActionType,
    'date' : IDL.Float64,
    'received_promises' : IDL.Float64,
    'spent' : IDL.Float64,
    'rating' : IDL.Float64,
    'received' : IDL.Float64,
    'promises' : IDL.Float64,
  });
  const Rating = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Float64,
    'user_id' : IDL.Principal,
    'comment' : IDL.Text,
    'rating' : IDL.Float64,
  });
  const UserProfile = IDL.Record({
    'id' : IDL.Principal,
    'actions_rate' : IDL.Float64,
    'balance' : IDL.Float64,
    'rates_by_actions' : IDL.Vec(ActionRating),
    'name' : IDL.Text,
    'description' : IDL.Text,
    'total_debt' : IDL.Float64,
    'spent' : IDL.Float64,
    'rates_by_others' : IDL.Vec(Rating),
    'users_rate' : IDL.Float64,
    'users_interacted' : IDL.Float64,
    'photo' : IDL.Vec(IDL.Nat8),
    'debts' : IDL.Vec(IDL.Text),
    'received' : IDL.Float64,
  });
  const Result_14 = IDL.Variant({ 'Ok' : UserProfile, 'Err' : IDL.Text });
  const Chat = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'members' : IDL.Vec(IDL.Principal),
    'messages' : IDL.Vec(Message),
    'name' : IDL.Text,
    'workspaces' : IDL.Vec(IDL.Text),
    'admins' : IDL.Vec(IDL.Principal),
  });
  const Result_15 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Null });
  const FileIndexing = IDL.Record({
    'id' : IDL.Text,
    'new_index' : IDL.Nat64,
    'parent' : IDL.Opt(IDL.Text),
  });
  const PayArgs = IDL.Record({
    'token' : IDL.Principal,
    'memo' : IDL.Nat64,
    'to_merchant' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const RegisterUser = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'photo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const RemoveSwapArgs = IDL.Record({
    'token0' : IDL.Principal,
    'token1' : IDL.Principal,
  });
  const ShareFileInput = IDL.Record({
    'id' : IDL.Text,
    'permission' : ShareFilePermission,
    'owner' : IDL.Principal,
    'users_permissions' : IDL.Vec(
      IDL.Tuple(IDL.Principal, ShareFilePermission)
    ),
  });
  const ClientKey = IDL.Record({
    'client_principal' : IDL.Principal,
    'client_nonce' : IDL.Nat64,
  });
  const CanisterWsCloseArguments = IDL.Record({ 'client_key' : ClientKey });
  const CanisterWsGetMessagesArguments = IDL.Record({ 'nonce' : IDL.Nat64 });
  const CanisterOutputMessage = IDL.Record({
    'key' : IDL.Text,
    'content' : IDL.Vec(IDL.Nat8),
    'client_key' : ClientKey,
  });
  const CanisterOutputCertifiedMessages = IDL.Record({
    'messages' : IDL.Vec(CanisterOutputMessage),
    'cert' : IDL.Vec(IDL.Nat8),
    'tree' : IDL.Vec(IDL.Nat8),
    'is_end_of_queue' : IDL.Bool,
  });
  const Result_16 = IDL.Variant({
    'Ok' : CanisterOutputCertifiedMessages,
    'Err' : IDL.Text,
  });
  const WebsocketMessage = IDL.Record({
    'sequence_num' : IDL.Nat64,
    'content' : IDL.Vec(IDL.Nat8),
    'client_key' : ClientKey,
    'timestamp' : IDL.Nat64,
    'is_service_message' : IDL.Bool,
  });
  const CanisterWsMessageArguments = IDL.Record({ 'msg' : WebsocketMessage });
  const AppMessage = IDL.Record({
    'text' : IDL.Text,
    'notification' : IDL.Opt(Notification),
    'timestamp' : IDL.Nat64,
  });
  const CanisterWsOpenArguments = IDL.Record({
    'gateway_principal' : IDL.Principal,
    'client_nonce' : IDL.Nat64,
  });
  return IDL.Service({
    'accept_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'add_owner' : IDL.Func([AddOwnerArgs], [Result_1], []),
    'add_swap' : IDL.Func([AddSwapArgs], [Result_1], []),
    'approve_high_promise' : IDL.Func([CPayment], [Result_2], []),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'check_external_transactions' : IDL.Func([IDL.Nat], [Result_3], []),
    'confirmed_c_payment' : IDL.Func([CPayment], [Result_2], []),
    'confirmed_cancellation' : IDL.Func([CPayment], [Result_2], []),
    'counter' : IDL.Func([], [IDL.Nat64], ['query']),
    'create_new_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [FileNode], []),
    'delete_chat' : IDL.Func([IDL.Text], [Result_4], []),
    'delete_custom_contract' : IDL.Func([IDL.Text], [Result_2], []),
    'delete_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], []),
    'delete_post' : IDL.Func([IDL.Text], [Result_2], []),
    'delete_work_space' : IDL.Func([WorkSpace], [Result_5], []),
    'deposit_ckusdt' : IDL.Func([], [Result_6], []),
    'get_affiliate_data' : IDL.Func([IDL.Text], [Result_7], []),
    'get_all_files' : IDL.Func([], [IDL.Vec(FileNode)], ['query']),
    'get_all_files_content' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))],
        ['query'],
      ),
    'get_chats_notifications' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'get_contract' : IDL.Func([IDL.Text, IDL.Text], [Result_8], ['query']),
    'get_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], ['query']),
    'get_file_content' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(ContentNode))],
        ['query'],
      ),
    'get_filtered_posts' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Text)), IDL.Opt(IDL.Text)],
        [IDL.Vec(PostUser)],
        ['query'],
      ),
    'get_friends' : IDL.Func([], [IDL.Vec(Friend)], ['query']),
    'get_initial_data' : IDL.Func([], [Result_9], ['query']),
    'get_logs' : IDL.Func([GetErrorLogsArgs], [IDL.Vec(Log)], ['query']),
    'get_more_files' : IDL.Func(
        [IDL.Float32],
        [IDL.Vec(FileNode), IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))],
        ['query'],
      ),
    'get_my_chats' : IDL.Func([], [IDL.Vec(FEChat)], ['query']),
    'get_owners' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'get_post' : IDL.Func([IDL.Text], [Result_10], ['query']),
    'get_posts' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(PostUser)],
        ['query'],
      ),
    'get_share_file' : IDL.Func([IDL.Text], [Result_11], ['query']),
    'get_shared_file' : IDL.Func([IDL.Text], [Result_12], []),
    'get_sns_status' : IDL.Func([], [Result_13], ['query']),
    'get_swaps' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal))],
        ['query'],
      ),
    'get_user' : IDL.Func([IDL.Text], [Result], ['query']),
    'get_user_notifications' : IDL.Func([], [IDL.Vec(Notification)], ['query']),
    'get_user_profile' : IDL.Func([IDL.Principal], [Result_14], ['query']),
    'get_users' : IDL.Func([], [IDL.Float64], ['query']),
    'get_work_spaces' : IDL.Func([], [IDL.Vec(WorkSpace)], ['query']),
    'internal_transaction' : IDL.Func(
        [IDL.Float64, IDL.Text, ExchangeType],
        [Result_2],
        [],
      ),
    'make_new_chat_room' : IDL.Func([Chat], [Result_4], []),
    'message_is_seen' : IDL.Func([Message], [Result_2], []),
    'move_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_15], []),
    'multi_updates' : IDL.Func(
        [
          IDL.Vec(FileNode),
          IDL.Vec(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))),
          IDL.Vec(StoredContract),
          IDL.Vec(FileIndexing),
        ],
        [Result_4],
        [],
      ),
    'object_on_cancel' : IDL.Func([CPayment, IDL.Text], [Result_2], []),
    'pay' : IDL.Func([PayArgs], [Result_1], []),
    'rate_user' : IDL.Func([IDL.Principal, Rating], [Result_2], []),
    'register' : IDL.Func([IDL.Text, RegisterUser], [Result], []),
    'reject_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'remove_owner' : IDL.Func([AddOwnerArgs], [Result_1], []),
    'remove_swap' : IDL.Func([RemoveSwapArgs], [Result_1], []),
    'save_post' : IDL.Func([Post], [Result_2], []),
    'save_work_space' : IDL.Func([WorkSpace], [Result_5], []),
    'search_posts' : IDL.Func([IDL.Text], [IDL.Vec(PostUser)], ['query']),
    'see_notifications' : IDL.Func([IDL.Text], [Result_4], []),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'send_message' : IDL.Func(
        [IDL.Opt(IDL.Principal), Message],
        [Result_4],
        [],
      ),
    'share_file' : IDL.Func([ShareFileInput], [Result_11], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
    'unvote' : IDL.Func([IDL.Text], [Result_10], []),
    'update_chat' : IDL.Func([Chat], [Result_4], []),
    'update_user_profile' : IDL.Func([RegisterUser], [Result], []),
    'vote_down' : IDL.Func([IDL.Text], [Result_10], []),
    'vote_up' : IDL.Func([IDL.Text], [Result_10], []),
    'withdraw_ckusdt' : IDL.Func([IDL.Nat64, IDL.Text], [Result_6], []),
    'ws_close' : IDL.Func([CanisterWsCloseArguments], [Result_2], []),
    'ws_get_messages' : IDL.Func(
        [CanisterWsGetMessagesArguments],
        [Result_16],
        ['query'],
      ),
    'ws_message' : IDL.Func(
        [CanisterWsMessageArguments, IDL.Opt(AppMessage)],
        [Result_2],
        [],
      ),
    'ws_open' : IDL.Func([CanisterWsOpenArguments], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
