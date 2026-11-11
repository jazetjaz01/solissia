import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";

// Client without cookies or session: reads public data only (published
// articles, authors, categories). Usable inside "use cache".
export const createPublicClient = () =>
  createClient(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
