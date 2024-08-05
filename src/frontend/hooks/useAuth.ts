// import { useCallback, useEffect, useState } from "react";
// import { AuthClient } from "@dfinity/auth-client";


// interface AuthHooks {
//   isAuthenticating: boolean;
//   authClient: AuthClient | null;
//   isAuthenticated: boolean;
//   hasLoggedIn: boolean;
//   login: () => Promise<void>;
//   logout: () => void;
// }
  

// const useAuth = (): AuthHooks => {
//   const port = import.meta.env.VITE_DFX_PORT;
  
//   const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
//   const [authClient, setAuthClient] = useState<AuthClient | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);

//   const login = useCallback(async () => {
//     const alreadyAuthenticated = await authClient?.isAuthenticated()
//     console.log("alreadyAuthenticated: ", alreadyAuthenticated);

//     if (alreadyAuthenticated) {
//       setIsAuthenticated(true);
//       setHasLoggedIn(true);
//     } else {
//       setIsAuthenticating(true)

//       authClient?.login({
//         identityProvider: 
//           import.meta.env.VITE_DFX_NETWORK === "ic" ? "https://identity.ic0.app/#authorize" :
//           import.meta.env.VITE_DFX_NETWORK === "playground" ? "https://identity.ic0.app/#authorize" :
//           import.meta.env.VITE_DFX_NETWORK === "local" ? `http://${import.meta.env.VITE_INTERNET_IDENTITY}.localhost:${port}`:
//           undefined,
//         onSuccess: async () => {
//           setIsAuthenticating(false);
//           setIsAuthenticated(true);
//           setHasLoggedIn(true);
//         }
//       })
//     }

//   },[authClient]);

//   const logout = () => {
//     setIsAuthenticated(false);
//     authClient?.logout({ returnTo: "/" });
//   };


//   useEffect(() => {
//     if (authClient == null) {
//       setIsAuthenticating(true);

//       AuthClient.create().then(async (client) => {
//         await client?.isAuthenticated();
//         setIsAuthenticating(false);
//         setAuthClient(client);
//       });
//     }
//   }, [authClient]);

//   useEffect(() => {
//     if (authClient && login != null) {
//       (async () => {
//         const authenticated = await authClient?.isAuthenticated();
//         if (authenticated) {
//           setIsAuthenticated(true);
//         }
//       })();
//     }
//   },[]);

//   return {
//     authClient,
//     isAuthenticated,
//     hasLoggedIn,
//     isAuthenticating,
//     login,
//     logout,
//   };
// };

// export default useAuth;
