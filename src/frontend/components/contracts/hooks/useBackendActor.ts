import {useState, useEffect} from "react";
import { Actor, ActorMethod, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { canisterId, idlFactory } from "../../../../declarations/backend";

const useBackend = (agent: HttpAgent | null) => {
    const [backendActor, setBackendActor] = useState<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null>(null);
  
    useEffect(() => {
      const createBackendActor = async () => {
        if (agent) {
          const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId
          });
          setBackendActor(actor);
        }
      };
      createBackendActor();
    }, [agent]);
  
  return backendActor;
};

export default useBackend;