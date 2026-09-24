import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

const customSupabaseClient = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const getSupabaseClient = () => {
    if (!customSupabaseClient) {
        throw new Error('Trūksta Supabase URL arba Publishable/Anon rakto .env faile.');
    }

    return customSupabaseClient;
};

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
