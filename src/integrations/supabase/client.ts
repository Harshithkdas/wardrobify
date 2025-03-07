
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgirfuukrphytsbcueme.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaXJmdXVrcnBoeXRzYmN1ZW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTAyMDYsImV4cCI6MjA1NjcyNjIwNn0.HsgQKwjpHggTHVRIHgRzD6V-cLhzM_QZwtURmtgRWMA";

// Export the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
