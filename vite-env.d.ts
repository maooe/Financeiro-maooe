
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
