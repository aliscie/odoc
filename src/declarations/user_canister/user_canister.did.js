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
  const Payment = IDL.Record({
    'canceled' : IDL.Bool,
    'contract_id' : IDL.Text,
    'sender' : IDL.Principal,
    'released' : IDL.Bool,
    'confirmed' : IDL.Bool,
    'amount' : IDL.Nat64,
    'receiver' : IDL.Principal,
  });
  const Share = IDL.Record({
    'contract_id' : IDL.Text,
    'share' : IDL.Nat64,
    'receiver' : IDL.Principal,
  });
  const SharesContract = IDL.Record({
    'shares' : IDL.Vec(Share),
    'payments' : IDL.Vec(Payment),
  });
  const StoredContract = IDL.Variant({
    'PaymentContract' : Payment,
    'SharesContract' : SharesContract,
  });
  const Friend = IDL.Record({
    'friend_requests' : IDL.Vec(User),
    'friends' : IDL.Vec(User),
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
  return IDL.Service({
    'accept_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'accept_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'cancel_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'content_updates' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_2],
        [],
      ),
    'counter' : IDL.Func([], [IDL.Nat32], ['query']),
    'create_new_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [FileNode], []),
    'create_payment_contract' : IDL.Func([IDL.Text], [Result_1], []),
    'cycles_used' : IDL.Func([], [IDL.Nat64], []),
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
    'get_initial_data' : IDL.Func([], [Result_4], ['query']),
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
    'register' : IDL.Func([RegisterUser], [Result], []),
    'release_payment' : IDL.Func([IDL.Text], [Result_1], []),
    'rename_file' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'share_file' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'start_with_interval_secs' : IDL.Func([IDL.Nat64], [], []),
    'stop' : IDL.Func([], [], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
    'update_user_profile' : IDL.Func([RegisterUser], [Result], []),
    'withdraw_usdt' : IDL.Func([IDL.Nat64], [Result_3], []),
  });
};
export const init = ({ IDL }) => { return []; };
