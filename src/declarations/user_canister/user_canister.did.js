export const idlFactory = ({ IDL }) => {
  const FileNode = IDL.Record({
    'id' : IDL.Nat64,
    'content' : IDL.Nat64,
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Nat64),
    'parent' : IDL.Opt(IDL.Nat64),
  });
  const RegisterUser = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const User = IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text });
  const Result = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  return IDL.Service({
    'create_new_file' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat64)],
        [FileNode],
        [],
      ),
    'delete_file' : IDL.Func([IDL.Nat64], [IDL.Opt(FileNode)], []),
    'get_all_files' : IDL.Func(
        [],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Nat64, FileNode)))],
        ['query'],
      ),
    'get_file' : IDL.Func([IDL.Nat64], [IDL.Opt(FileNode)], ['query']),
    'register' : IDL.Func([RegisterUser], [Result], []),
    'rename_file' : IDL.Func([IDL.Nat64, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
