export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'photo' : IDL.Vec(IDL.Nat8),
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const FileNode = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Text),
    'parent' : IDL.Opt(IDL.Text),
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Contract = IDL.Variant({ 'PaymentContract' : IDL.Text });
  const Row = IDL.Variant({
    'Contract' : Contract,
    'NormalCell' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
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
    'parent' : IDL.Opt(IDL.Text),
  });
  const Payment = IDL.Record({
    'contract_id' : IDL.Text,
    'sender' : IDL.Principal,
    'released' : IDL.Bool,
    'confirmed' : IDL.Bool,
    'amount' : IDL.Nat64,
    'receiver' : IDL.Principal,
  });
  const StoredContract = IDL.Variant({ 'PaymentContract' : Payment });
  const Friend = IDL.Record({
    'friend_requests' : IDL.Vec(User),
    'friends' : IDL.Vec(User),
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
  });
  const Result_3 = IDL.Variant({ 'Ok' : InitialData, 'Err' : IDL.Text });
  const RegisterUser = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'photo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  return IDL.Service({
    'accept_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'content_updates' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result_1],
        [],
      ),
    'create_new_file' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [FileNode], []),
    'create_payment_contract' : IDL.Func([IDL.Text], [Result_2], []),
    'delete_file' : IDL.Func([IDL.Text], [IDL.Opt(FileNode)], []),
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
    'get_initial_data' : IDL.Func([], [Result_3], ['query']),
    'multi_files_content_updates' : IDL.Func(
        [
          IDL.Vec(
            IDL.Vec(
              IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, ContentNode)))
            )
          ),
        ],
        [Result_1],
        [],
      ),
    'register' : IDL.Func([RegisterUser], [Result], []),
    'rename_file' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'save_payment_contract' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Vec(IDL.Tuple(IDL.Text, ContentNode)),
          IDL.Vec(StoredContract),
        ],
        [Result_2],
        [],
      ),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
    'update_user_profile' : IDL.Func([RegisterUser], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
