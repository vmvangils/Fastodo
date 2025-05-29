import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qsqmjenvtegxirmatqny.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcW1qZW52dGVneGlybWF0cW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Mzc1NjcsImV4cCI6MjA2MzUxMzU2N30.-vQaR3Wg13pw_be1Y3c-6Y6S7-uvJmuJZ9Fcc-z7n3I";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
