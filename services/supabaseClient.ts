// services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Мы создадим этот файл позже

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env.local');
}

// Создаем и экспортируем клиент Supabase
// Тип `Database` позволит нам получать полную автодополняемость для таблиц
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);