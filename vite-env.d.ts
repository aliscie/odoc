/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DFX_PORT: string;
    readonly VITE_INTERNET_IDENTITY: string;
    // Add more environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  