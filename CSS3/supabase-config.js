// ==========================================
// Vertex Systems AI - Supabase Configuration
// ==========================================

const SUPABASE_URL =
    "https://fkpjawyuyzgtjceymnal.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable__82IrF70sojq4WkLdfZNsg_Cb19N3GE";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );

console.log(
    "Vertex Systems AI connected to Supabase"
);