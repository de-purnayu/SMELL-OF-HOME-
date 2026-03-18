import { createClient } from "@supabase/supabase-js";

// These are public keys, safe for the frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qvoeypwdsckwwnvoktdy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Pm5YEfhrWwL7PaE3i8sMbA_OmdmSvgF";

export const supabase = createClient(supabaseUrl, supabaseKey);
