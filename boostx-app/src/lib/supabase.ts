import { createBrowserClient } from '@supabase/ssr';

// Create a single supabase client for interacting with your database
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// For simple legacy access if needed anywhere non-component
export const supabase = createClient();
