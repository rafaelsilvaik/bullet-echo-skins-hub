
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { UserProfile, getUserProfile, checkIsAdmin } from '../services/authService';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  isAdmin: false,
  isLoading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const fetchUserProfile = async (userId: string) => {
      try {
        const profile = await getUserProfile(userId);
        if (!mounted) return;
        setUserProfile(profile);
        
        // Check if user is admin
        const adminStatus = await checkIsAdmin(userId);
        if (!mounted) return;
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        if (!mounted) return;
      }
    };

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        
        // Tentar recuperar a sessão do localStorage primeiro
        const storedSession = localStorage.getItem('supabase.auth.token');
        
        // Obter a sessão atual do Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual obtida:", !!currentSession);
        
        if (!mounted) return;
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchUserProfile(currentSession.user.id);
        } else if (storedSession && retryCount < maxRetries) {
          // Se não há sessão atual mas existe token armazenado, tentar reconectar
          retryCount++;
          console.log(`Tentativa ${retryCount} de reconexão...`);
          setTimeout(fetchSession, 1000); // Tentar novamente após 1 segundo
          return;
        } else {
          // Se não há sessão após tentativas, limpar os estados
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          localStorage.removeItem('supabase.auth.token');
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err);
        console.error('Erro na autenticação:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Carregar sessão atual
    fetchSession();

    // Setup auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession) => {
        console.log('Auth state changed:', event, !!newSession);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED' as AuthChangeEvent) {
          // Limpar todos os estados quando o usuário faz logout ou é deletado
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          localStorage.removeItem('supabase.auth.token');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
            // Armazenar o token atualizado
            localStorage.setItem('supabase.auth.token', JSON.stringify(newSession));
          }
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      data?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, userProfile, isAdmin, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Remove these redundant exports
// export function useAuth() {
//   return useContext(AuthContext);
// };
// export default useAuth;
