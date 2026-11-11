import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

// Supabase client for Client Components ("use client").
export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);
