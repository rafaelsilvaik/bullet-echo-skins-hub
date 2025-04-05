
// Just re-export the main supabase client to avoid duplication
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

// Re-export the supabase client to maintain backwards compatibility
export { supabase };

// Add a helper function to check if we're using real credentials
export const isUsingRealSupabaseCredentials = (): boolean => {
  return true; // Assumindo que estamos usando credenciais reais agora
};
