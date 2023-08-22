export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'create_canister' : IDL.Func([], [Result], []),
    'get_user_canister' : IDL.Func([], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
