
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const isPlaceholder = !supabaseUrl || supabaseUrl === '' || supabaseUrl.includes('placeholder') || !supabaseAnonKey || supabaseAnonKey === '';

if (isPlaceholder) {
  console.warn(
    "MAOOE Cloud: Chaves do Supabase não detectadas. Verifique as variáveis de ambiente no Vercel."
  );
}

// Inicializa o cliente apenas se tivermos chaves válidas, caso contrário usa strings vazias seguras para o build
export const supabase = createClient(
  isPlaceholder ? 'https://placeholder-project.supabase.co' : supabaseUrl, 
  isPlaceholder ? 'placeholder-key' : supabaseAnonKey
);
