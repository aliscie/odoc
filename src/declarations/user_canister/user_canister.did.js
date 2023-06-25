export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
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
  const Column = IDL.Record({
    '_type' : ColumnTypes,
    'field' : IDL.Text,
    'filters' : IDL.Vec(Filter),
    'permissions' : IDL.Vec(ColumnPermission),
    'editable' : IDL.Bool,
    'formula' : IDL.Opt(IDL.Text),
  });
  const Table = IDL.Record({
    'rows' : IDL.Vec(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'columns' : IDL.Vec(Column),
  });
  const ContentData = IDL.Variant({
    'Comment' : IDL.Text,
    'Image' : IDL.Vec(IDL.Nat64),
    'Table' : Table,
  });
  const ContentNode = IDL.Record({
    'id' : IDL.Nat64,
    '_type' : IDL.Text,
    'data' : IDL.Opt(ContentData),
    'text' : IDL.Text,
    'children' : IDL.Vec(IDL.Nat64),
    'parent' : IDL.Opt(IDL.Nat64),
  });
  const FileNode = IDL.Record({
    'id' : IDL.Nat64,
    'content' : IDL.Nat64,
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Nat64),
    'parent' : IDL.Opt(IDL.Nat64),
  });
  const Friend = IDL.Record({
    'friend_requests' : IDL.Vec(User),
    'friends' : IDL.Vec(User),
  });
  const InitialData = IDL.Record({
    'FilesContents' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Vec(IDL.Tuple(IDL.Nat64, ContentNode))))
    ),
    'Files' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Nat64, FileNode))),
    'Friends' : IDL.Opt(Friend),
    'Profile' : User,
    'DiscoverUsers' : IDL.Vec(IDL.Tuple(IDL.Text, User)),
  });
  const Result_2 = IDL.Variant({ 'Ok' : InitialData, 'Err' : IDL.Text });
  const RegisterUser = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'accept_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'cancel_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'content_updates' : IDL.Func(
        [IDL.Nat64, IDL.Opt(IDL.Nat64), IDL.Text],
        [Result_1],
        [],
      ),
    'create_agreement' : IDL.Func([IDL.Text], [IDL.Opt(ContentNode)], []),
    'create_new_file' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat64)],
        [FileNode],
        [],
      ),
    'delete_file' : IDL.Func([IDL.Nat64], [IDL.Opt(FileNode)], []),
    'get_all_contracts' : IDL.Func([], [IDL.Text], ['query']),
    'get_all_files' : IDL.Func(
        [],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Nat64, FileNode)))],
        ['query'],
      ),
    'get_all_files_content' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(IDL.Nat64, IDL.Vec(IDL.Tuple(IDL.Nat64, ContentNode)))
          ),
        ],
        ['query'],
      ),
    'get_all_users' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, User))],
        ['query'],
      ),
    'get_file' : IDL.Func([IDL.Nat64], [IDL.Opt(FileNode)], ['query']),
    'get_file_content' : IDL.Func(
        [IDL.Nat64],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Nat64, ContentNode)))],
        ['query'],
      ),
    'get_initial_data' : IDL.Func([], [Result_2], ['query']),
    'multi_files_content_updates' : IDL.Func(
        [
          IDL.Vec(
            IDL.Vec(
              IDL.Tuple(IDL.Nat64, IDL.Vec(IDL.Tuple(IDL.Nat64, ContentNode)))
            )
          ),
        ],
        [Result_1],
        [],
      ),
    'register' : IDL.Func([RegisterUser], [Result], []),
    'rename_file' : IDL.Func([IDL.Nat64, IDL.Text], [IDL.Bool], []),
    'send_friend_request' : IDL.Func([IDL.Text], [Result], []),
    'unfriend' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
