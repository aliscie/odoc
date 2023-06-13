export const idlFactory = ({ IDL }) => {
  const Profile = IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text });
  return IDL.Service({
    'get' : IDL.Func([IDL.Text], [Profile], ['query']),
    'get_self' : IDL.Func([], [Profile], ['query']),
    'search' : IDL.Func([IDL.Text], [IDL.Opt(Profile)], ['query']),
    'update' : IDL.Func([Profile], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
