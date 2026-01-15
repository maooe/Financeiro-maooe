/// <reference types="vite/client" />

/**
 * Declares the process.env variables injected by Vite's define configuration.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

/**
 * Extends ImportMeta to include the env property with the ImportMetaEnv type.
 * The ImportMetaEnv type is provided by the 'vite/client' reference above.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
