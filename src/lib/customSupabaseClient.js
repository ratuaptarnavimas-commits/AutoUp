import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqkrukzlpmuqnyzptofw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxa3J1a3pscG11cW55enB0b2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjA4MjEsImV4cCI6MjA4NjYzNjgyMX0.VTQNtrXnJ7XjpLLEnMFh-zbtirl7_3pFxcziz-DO8U0';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
