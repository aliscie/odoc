export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'photo' : IDL.Vec(IDL.Nat8),
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const FileNode = IDL.Record({
    'id' : IDL.Text,
    'share_id' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Text),
    'parent' : IDL.Opt(IDL.Text),
  });
  const Share = IDL.Record({
    'share_contract_id' : IDL.Text,
    'accumulation' : IDL.Nat64,
    'conformed' : IDL.Bool,
    'share' : IDL.Nat64,
    'receiver' : IDL.Principal,
    'contractor' : IDL.Opt(IDL.Principal),
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const Contract = IDL.Variant({
    'PaymentContract' : IDL.Text,
    'SharesContract' : IDL.Text,
  });
  const Row = IDL.Record({
    'id' : IDL.Text,
    'contract' : IDL.Opt(Contract),
    'cells' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'requests' : IDL.Opt(Contract),
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
    'CanRead' : IDL.Null,
    'CanUpdate' : IDL.Null,
  });
  const ColumnPermission = IDL.Record({
    '_type' : PermissionType,
    'granted_to' : IDL.Vec(IDL.Principal),
  });
  const Trigger = IDL.Variant({ 'Timer' : IDL.Null, 'Update' : IDL.Null });
  const Execute = IDL.Variant({
    'TransferNft' : IDL.Null,
    'TransferToken' : IDL.Null,
    'TransferUsdt' : IDL.Null,
  });
  const Formula = IDL.Record({
    'trigger_target' : IDL.Text,
    'trigger' : Trigger,
    'operation' : Operation,
    'execute' : Execute,
  });
  const Column = IDL.Record({
    'id' : IDL.Text,
    '_type' : ColumnTypes,
    'field' : IDL.Text,
    'filters' : IDL.Vec(Filter),
    'permissions' : IDL.Vec(ColumnPermission),
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
  const Friend = IDL.Record({
    'friend_requests' : IDL.Vec(User),
    'friends' : IDL.Vec(User),
  });
  const PaymentContract = IDL.Record({
    'canceled' : IDL.Bool,
    'contract_id' : IDL.Text,
    'sender' : IDL.Principal,
    'released' : IDL.Bool,
    'confirmed' : IDL.Bool,
    'amount' : IDL.Nat64,
    'receiver' : IDL.Principal,
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
  const SharesContract = IDL.Record({
    'payment_options' : IDL.Vec(SharePaymentOption),
    'shares' : IDL.Vec(Share),
    'payments' : IDL.Vec(SharePayment),
    'contract_id' : IDL.Text,
    'shares_requests' : IDL.Vec(Share),
  });
  const StoredContract = IDL.Variant({
    'PaymentContract' : PaymentContract,
    'SharesContract' : SharesContract,
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
    'date' : IDL.Text,
    'from' : IDL.Text,
    'amount' : IDL.Nat64,
  });
  const Wallet = IDL.Record({
    'balance' : IDL.Nat64,
    'owner' : IDL.Text,
    'exchanges' : IDL.Vec(Exchange),
  });
  const InitialData = IDL.Record({
    'FilesContents' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, ContentNode))))
    ),
    'Contracts' : IDL.Vec(IDL.Tuple(IDL.Text, StoredContract)),
    'Files' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, FileNode))),
    'Friends' : IDL.Opt(Friend),
    'Profile' : User,
    'DiscoverUsers' : IDL.Vec(IDL.Tuple(IDL.Text, User)),
    'Wallet' : Wallet,
  });
  const Result_4 = IDL.Variant({ 'Ok' : InitialData, 'Err' : IDL.Text });
  const ContractNotification = IDL.Record({
    'contract_type' : IDL.Text,
    'contract_id' : IDL.Text,
  });
  const NoteContent = IDL.Variant({
    'ContractUpdate' : ContractNotification,
    'FriendRequest' : IDL.Record({}),
  });
  const Notification = IDL.Record({
    'id' : IDL.Text,
    'is_seen' : IDL.Bool,
    'content' : NoteContent,
    'sender' : IDL.Principal,
    'receiver' : IDL.Principal,
  });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Tuple(FileNode, IDL.Vec(IDL.Tuple(IDL.Text, ContentNode))),
    'Err' : IDL.Text,
  });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Null });
  const RegisterUser = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'photo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const ShareRequest = IDL.Record({
    'share_contract_id' : IDL.Text,
    'share' : IDL.Nat64,
    'receiver' : IDL.Principal,
    'contractor' : IDL.Opt(IDL.Principal),
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
  });
  const Result_7 = IDL.Variant({
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
    'accept_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'approve_request' : IDL.Func([IDL.Vec(IDL.Text), IDL.Text], [Result_1], []),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'cancel_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'conform' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'content_updates' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_2],
        [],
      ),
    'create_new_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [FileNode], []),
    'create_payment_contract' : IDL.Func([IDL.Text], [Result_1], []),
    'create_share_contract' : IDL.Func([IDL.Vec(Share)], [Result_2], []),
    'delete_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], []),
    'delete_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'deposit_usdt' : IDL.Func([IDL.Nat64], [Result_3], []),
    'get_all_files' : IDL.Func(
        [],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, FileNode)))],
        ['query'],
      ),
    'get_all_files_content' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, ContentNode)))
          ),
        ],
        ['query'],
      ),
    'get_all_users' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, User))],
        ['query'],
      ),
    'get_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], ['query']),
    'get_file_content' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, ContentNode)))],
        ['query'],
      ),
    'get_friends' : IDL.Func([], [IDL.Opt(Friend)], ['query']),
    'get_initial_data' : IDL.Func([], [Result_4], ['query']),
    'get_notifications' : IDL.Func([], [IDL.Vec(Notification)], ['query']),
    'get_shared_file' : IDL.Func([IDL.Text], [Result_5], []),
    'move_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_6], []),
    'multi_updates' : IDL.Func(
        [
          IDL.Vec(FileNode),
          IDL.Vec(
            IDL.Vec(
              IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, ContentNode)))
            )
          ),
          IDL.Vec(StoredContract),
          IDL.Vec(IDL.Text),
        ],
        [Result_2],
        [],
      ),
    'pay_for_share_contract' : IDL.Func([IDL.Text, IDL.Nat64], [Result_1], []),
    'register' : IDL.Func([RegisterUser], [Result], []),
    'release_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'rename_file' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'request_share_change' : IDL.Func(
        [IDL.Vec(ShareRequest), IDL.Text],
        [Result_1],
        [],
      ),
    'see_notifications' : IDL.Func([IDL.Text], [], []),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'share_file' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
    'update_shares' : IDL.Func([IDL.Vec(Share), IDL.Text], [Result_2], []),
    'update_user_profile' : IDL.Func([RegisterUser], [Result], []),
    'withdraw_usdt' : IDL.Func([IDL.Nat64], [Result_3], []),
    'ws_close' : IDL.Func([CanisterWsCloseArguments], [Result_1], []),
    'ws_get_messages' : IDL.Func(
        [CanisterWsGetMessagesArguments],
        [Result_7],
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
