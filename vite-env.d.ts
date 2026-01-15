// Fix: Removed 'vite/client' reference as it was not found in the environment and defined ImportMetaEnv manually.
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
 * Manually defined ImportMetaEnv since 'vite/client' types are missing.
 */
interface ImportMetaEnv {
  readonly [key: string]: string | boolean | undefined;
}

/**
 * Extends ImportMeta to include the env property with the ImportMetaEnv type.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
