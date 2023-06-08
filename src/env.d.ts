/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_CANISTER_ID: string;
  readonly VITE_DFX_NETWORK: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
