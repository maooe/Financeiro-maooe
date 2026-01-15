
import { createClient } from '@supabase/supabase-js';

// No Vite, o 'define' no vite.config.ts substitui estas strings pelos valores reais
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn(
    "MAOOE Cloud: Chaves do Supabase não detectadas. " +
    "O sistema entrará em modo de persistência local (Offline)."
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
