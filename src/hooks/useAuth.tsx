
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User, AuthChangeEvent, Subscription } from '@supabase/supabase-js';
import { UserProfile, getUserProfile, checkIsAdmin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: Subscription | null = null;
    
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
    
    // Função para lidar com mudanças de estado de autenticação
    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, !!session);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED' as AuthChangeEvent) {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user || null);
        setIsAuthenticated(true);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      }
    };

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        
        // Obter a sessão atual do Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual obtida:", !!currentSession);
        
        if (!mounted) return;
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          await fetchUserProfile(currentSession.user.id);
        } else {
          // Se não há sessão, limpar os estados
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err);
        console.error('Erro na autenticação:', err);
        setIsAuthenticated(false);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Carregar sessão atual
    fetchSession();

    // Setup auth state change listener
    const { data } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    // Verificar a sessão novamente quando o componente é montado
    // Isso garante que a sessão seja recuperada mesmo após atualizações de página
    fetchSession();
    
    // Verificar a sessão periodicamente para garantir que ela não expire
    const sessionCheckInterval = setInterval(() => {
      if (mounted) {
        console.log('Verificando sessão periodicamente...');
        fetchSession();
      }
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos
    
    // Guardar a referência da inscrição para limpeza
    authSubscription = data?.subscription || null;

    // Cleanup function
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      // Limpar o intervalo de verificação de sessão
      clearInterval(sessionCheckInterval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, userProfile, isAdmin, isLoading, error, isAuthenticated }}>
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
