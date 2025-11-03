import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jzcutwutrklbopfbooly.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Y3V0d3V0cmtsYm9wZmJvb2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjY4MTAsImV4cCI6MjA3NTI0MjgxMH0.U6n_leH0f26vmysLo3Mkw6f1pEI7ppqMPJCV3d9_OzM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
