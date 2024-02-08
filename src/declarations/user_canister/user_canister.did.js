export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'photo' : IDL.Vec(IDL.Nat8),
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const PaymentStatus = IDL.Variant({
    'HeighConformed' : IDL.Null,
    'None' : IDL.Null,
    'RequestCancellation' : IDL.Null,
    'ApproveHeighConformed' : IDL.Null,
    'Released' : IDL.Null,
    'Objected' : IDL.Text,
    'Confirmed' : IDL.Null,
    'ConfirmedCancellation' : IDL.Null,
  });
  const CPayment = IDL.Record({
    'id' : IDL.Text,
    'status' : PaymentStatus,
    'date_created' : IDL.Float64,
    'date_released' : IDL.Float64,
    'contract_id' : IDL.Text,
    'sender' : IDL.Principal,
    'amount' : IDL.Float64,
    'receiver' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const ShareFilePermission = IDL.Variant({
    'CanComment' : IDL.Null,
    'None' : IDL.Null,
    'CanView' : IDL.Null,
    'CanUpdate' : IDL.Null,
  });
  const FileNode = IDL.Record({
    'id' : IDL.Text,
    'permission' : ShareFilePermission,
    'share_id' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Text),
    'author' : IDL.Text,
    'users_permissions' : IDL.Vec(
      IDL.Tuple(IDL.Principal, ShareFilePermission)
    ),
    'parent' : IDL.Opt(IDL.Text),
  });
  const Share = IDL.Record({
    'extra_cells' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'share_contract_id' : IDL.Text,
    'accumulation' : IDL.Nat64,
    'share' : IDL.Nat64,
    'confirmed' : IDL.Bool,
    'receiver' : IDL.Principal,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Float64, 'Err' : IDL.Text });
  const Contract = IDL.Variant({ 'SharesContract' : IDL.Text });
  const Row = IDL.Record({
    'id' : IDL.Text,
    'contract' : IDL.Opt(Contract),
    'cells' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
  });
  const ColumnTypes = IDL.Variant({
    'Tag' : IDL.Null,
    'Date' : IDL.Null,
    'File' : IDL.Null,
    'Text' : IDL.Null,
    'Person' : IDL.Null,
    'Category' : IDL.Null,
    'Number' : IDL.Null,
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
    '_type' : ColumnTypes,
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
    'data' : IDL.Opt(ContentData),
    'text' : IDL.Text,
    'children' : IDL.Vec(IDL.Text),
    'language' : IDL.Text,
    'parent' : IDL.Opt(IDL.Text),
  });
  const Message = IDL.Record({
    'id' : IDL.Text,
    'date' : IDL.Nat64,
    'sender' : IDL.Principal,
    'seen_by' : IDL.Vec(IDL.Principal),
    'message' : IDL.Text,
    'chat_id' : IDL.Text,
  });
  const CCell = IDL.Record({
    'id' : IDL.Text,
    'field' : IDL.Text,
    'value' : IDL.Text,
  });
  const CRow = IDL.Record({ 'id' : IDL.Text, 'cells' : IDL.Vec(CCell) });
  const CColumn = IDL.Record({
    'id' : IDL.Text,
    'field' : IDL.Text,
    'formula_string' : IDL.Text,
    'column_type' : ColumnTypes,
    'filters' : IDL.Vec(Filter),
    'permissions' : IDL.Vec(PermissionType),
    'headerName' : IDL.Text,
    'editable' : IDL.Bool,
    'deletable' : IDL.Bool,
  });
  const CContract = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'rows' : IDL.Vec(CRow),
    'columns' : IDL.Vec(CColumn),
  });
  const CustomContract = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'date_created' : IDL.Float64,
    'payments' : IDL.Vec(CPayment),
    'name' : IDL.Text,
    'formulas' : IDL.Vec(Formula),
    'contracts' : IDL.Vec(CContract),
    'date_updated' : IDL.Float64,
    'promises' : IDL.Vec(CPayment),
  });
  const SharePaymentOption = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'date' : IDL.Text,
    'description' : IDL.Text,
    'amount' : IDL.Nat64,
  });
  const SharePayment = IDL.Record({
    'sender' : IDL.Principal,
    'amount' : IDL.Nat64,
  });
  const ShareRequest = IDL.Record({
    'id' : IDL.Text,
    'requester' : IDL.Principal,
    'shares' : IDL.Vec(Share),
    'is_applied' : IDL.Bool,
    'name' : IDL.Text,
    'approvals' : IDL.Vec(IDL.Principal),
  });
  const SharesContract = IDL.Record({
    'payment_options' : IDL.Vec(SharePaymentOption),
    'shares' : IDL.Vec(Share),
    'payments' : IDL.Vec(SharePayment),
    'contract_id' : IDL.Text,
    'author' : IDL.Text,
    'shares_requests' : IDL.Vec(IDL.Tuple(IDL.Text, ShareRequest)),
  });
  const StoredContract = IDL.Variant({
    'CustomContract' : CustomContract,
    'SharesContract' : SharesContract,
  });
  const Result_4 = IDL.Variant({ 'Ok' : StoredContract, 'Err' : IDL.Text });
  const UserFE = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const PostUser = IDL.Record({
    'id' : IDL.Text,
    'creator' : UserFE,
    'date_created' : IDL.Nat64,
    'votes_up' : IDL.Vec(IDL.Principal),
    'tags' : IDL.Vec(IDL.Text),
    'content_tree' : IDL.Vec(ContentNode),
    'votes_down' : IDL.Vec(IDL.Principal),
  });
  const Friend = IDL.Record({ 'sender' : User, 'receiver' : User });
  const FriendSystem = IDL.Record({
    'friend_requests' : IDL.Vec(Friend),
    'friends' : IDL.Vec(Friend),
  });
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
    'exchanges' : IDL.Vec(Exchange),
    'debts' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64)),
  });
  const InitialData = IDL.Record({
    'FilesContents' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))
    ),
    'Contracts' : IDL.Vec(IDL.Tuple(IDL.Text, StoredContract)),
    'Files' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, FileNode))),
    'Friends' : IDL.Opt(FriendSystem),
    'Profile' : User,
    'DiscoverUsers' : IDL.Vec(IDL.Tuple(IDL.Text, User)),
    'Wallet' : Wallet,
  });
  const Result_5 = IDL.Variant({ 'Ok' : InitialData, 'Err' : IDL.Text });
  const FEChat = IDL.Record({
    'id' : IDL.Text,
    'creator' : UserFE,
    'members' : IDL.Vec(IDL.Principal),
    'messages' : IDL.Vec(Message),
    'name' : IDL.Text,
    'admins' : IDL.Vec(UserFE),
  });
  const ContractNotification = IDL.Record({
    'contract_type' : IDL.Text,
    'contract_id' : IDL.Text,
  });
  const PaymentAction = IDL.Variant({
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
    'FriendRequest' : IDL.Record({}),
    'AcceptFriendRequest' : IDL.Null,
    'ApproveShareRequest' : IDL.Text,
    'CPaymentContract' : IDL.Tuple(CPayment, PaymentAction),
    'Unfriend' : IDL.Null,
    'ShareRequestApplied' : SharesContract,
    'ShareRequestApproved' : SharesContract,
    'ConformShare' : IDL.Text,
    'SharePayment' : SharesContract,
    'ApplyShareRequest' : IDL.Text,
    'NewMessage' : Message,
    'RemovedFromChat' : IDL.Text,
  });
  const Notification = IDL.Record({
    'id' : IDL.Text,
    'is_seen' : IDL.Bool,
    'content' : NoteContent,
    'sender' : IDL.Principal,
    'receiver' : IDL.Principal,
  });
  const Post = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Text,
    'date_created' : IDL.Nat64,
    'votes_up' : IDL.Vec(IDL.Principal),
    'tags' : IDL.Vec(IDL.Text),
    'content_tree' : IDL.Vec(ContentNode),
    'votes_down' : IDL.Vec(IDL.Principal),
  });
  const Result_6 = IDL.Variant({ 'Ok' : Post, 'Err' : IDL.Text });
  const ShareFile = IDL.Record({ 'id' : IDL.Text, 'owner' : IDL.Principal });
  const Result_7 = IDL.Variant({ 'Ok' : ShareFile, 'Err' : IDL.Text });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Tuple(FileNode, IDL.Vec(ContentNode)),
    'Err' : IDL.Text,
  });
  const ActionType = IDL.Variant({
    'Share' : SharePayment,
    'Payment' : CPayment,
  });
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
  const UserHistory = IDL.Record({
    'id' : IDL.Principal,
    'actions_rate' : IDL.Float64,
    'rates_by_actions' : IDL.Vec(ActionRating),
    'total_debt' : IDL.Float64,
    'spent' : IDL.Float64,
    'rates_by_others' : IDL.Vec(Rating),
    'users_rate' : IDL.Float64,
    'users_interacted' : IDL.Float64,
    'received' : IDL.Float64,
  });
  const Result_9 = IDL.Variant({
    'Ok' : IDL.Tuple(User, UserHistory),
    'Err' : IDL.Text,
  });
  const Chat = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'members' : IDL.Vec(IDL.Principal),
    'messages' : IDL.Vec(Message),
    'name' : IDL.Text,
    'admins' : IDL.Vec(IDL.Principal),
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Null });
  const RegisterUser = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'photo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
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
  const Result_11 = IDL.Variant({
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
    'apply_request' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_1], []),
    'approve_heigh_conform' : IDL.Func([CPayment], [Result_1], []),
    'approve_request' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'confirmed_c_payment' : IDL.Func([CPayment], [Result_1], []),
    'confirmed_cancellation' : IDL.Func([CPayment], [Result_1], []),
    'conform_share' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_1], []),
    'content_updates' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_2],
        [],
      ),
    'counter' : IDL.Func([], [IDL.Nat64], ['query']),
    'create_new_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [FileNode], []),
    'create_share_contract' : IDL.Func([IDL.Vec(Share)], [Result_2], []),
    'delete_custom_contract' : IDL.Func([IDL.Text], [Result_1], []),
    'delete_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], []),
    'delete_post' : IDL.Func([IDL.Text], [Result_1], []),
    'deposit_usdt' : IDL.Func([IDL.Float64], [Result_3], []),
    'get_all_files' : IDL.Func(
        [],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, FileNode)))],
        ['query'],
      ),
    'get_all_files_content' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))],
        ['query'],
      ),
    'get_all_users' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, User))],
        ['query'],
      ),
    'get_chats_notifications' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'get_contract' : IDL.Func([IDL.Text, IDL.Text], [Result_4], ['query']),
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
    'get_friends' : IDL.Func([], [IDL.Opt(FriendSystem)], ['query']),
    'get_initial_data' : IDL.Func([], [Result_5], ['query']),
    'get_my_chats' : IDL.Func([], [IDL.Vec(FEChat)], ['query']),
    'get_notifications' : IDL.Func([], [IDL.Vec(Notification)], ['query']),
    'get_post' : IDL.Func([IDL.Text], [Result_6], ['query']),
    'get_posts' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(PostUser)],
        ['query'],
      ),
    'get_share_file' : IDL.Func([IDL.Text], [Result_7], ['query']),
    'get_shared_file' : IDL.Func([IDL.Text], [Result_8], []),
    'get_user' : IDL.Func([IDL.Text], [Result], ['query']),
    'get_user_profile' : IDL.Func([IDL.Principal], [Result_9], ['query']),
    'make_new_chat_room' : IDL.Func([Chat], [Result_2], []),
    'message_is_seen' : IDL.Func([Message], [Result_1], []),
    'move_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_10], []),
    'multi_updates' : IDL.Func(
        [
          IDL.Vec(FileNode),
          IDL.Vec(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))),
          IDL.Vec(StoredContract),
          IDL.Vec(IDL.Text),
        ],
        [Result_2],
        [],
      ),
    'object_on_cancel' : IDL.Func([CPayment, IDL.Text], [Result_1], []),
    'pay_for_share_contract' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text],
        [Result_1],
        [],
      ),
    'rate_user' : IDL.Func([IDL.Principal, Rating], [Result_1], []),
    'register' : IDL.Func([RegisterUser], [Result], []),
    'reject_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'rename_file' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'save_post' : IDL.Func([Post], [Result_1], []),
    'search_files_content' : IDL.Func(
        [IDL.Text, IDL.Bool],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(ContentNode)))],
        ['query'],
      ),
    'search_posts' : IDL.Func([IDL.Text], [IDL.Vec(PostUser)], ['query']),
    'see_notifications' : IDL.Func([IDL.Text], [], []),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'send_message' : IDL.Func(
        [IDL.Opt(IDL.Principal), Message],
        [Result_2],
        [],
      ),
    'share_file' : IDL.Func([ShareFileInput], [Result_7], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
    'update_chat' : IDL.Func([Chat], [Result_2], []),
    'update_user_profile' : IDL.Func([RegisterUser], [Result], []),
    'vote_down' : IDL.Func([IDL.Text], [Result_6], []),
    'vote_up' : IDL.Func([IDL.Text], [Result_6], []),
    'withdraw_usdt' : IDL.Func([IDL.Float64], [Result_3], []),
    'ws_close' : IDL.Func([CanisterWsCloseArguments], [Result_1], []),
    'ws_get_messages' : IDL.Func(
        [CanisterWsGetMessagesArguments],
        [Result_11],
        ['query'],
      ),
    'ws_message' : IDL.Func(
        [CanisterWsMessageArguments, IDL.Opt(AppMessage)],
        [Result_1],
        [],
      ),
    'ws_open' : IDL.Func([CanisterWsOpenArguments], [Result_1], []),
  });
};
export const init = ({ IDL }) => { return []; };
