export const idlFactory = ({ IDL }) => {
  const FileNode = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'children' : IDL.Vec(IDL.Nat64),
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
    'get_all_files' : IDL.Func([], [IDL.Opt(IDL.Vec(FileNode))], ['query']),
    'register' : IDL.Func([RegisterUser], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
