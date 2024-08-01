import {useState, useEffect } from "react";
import { HttpAgent, Identity } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client";


const useIdentityAgent = (authClient: AuthClient | null) => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        if (authClient) {
          const authenticated = await authClient.isAuthenticated();
          if (authenticated) {
            const identity = authClient.getIdentity();
            console.log("Identity: ", identity);
            const principal = identity.getPrincipal().toString();
            console.log("Principal: ", principal);
            setIdentity(identity);
            setPrincipal(principal);
            const agent = new HttpAgent({
                identity,
                host: import.meta.env.VITE_DFX_NETWORK === "local" ? "http://localhost:4943" : "https://icp0.io",
              })
            console.log("Agent: ", agent);
            setAgent(agent);
          }
        }
      };
      fetchData();
    }, [authClient]);
  
    return { identity, agent, principal };
  };

  export default useIdentityAgent;