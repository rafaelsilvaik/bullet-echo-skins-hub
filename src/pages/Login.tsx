
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { isUsingRealSupabaseCredentials } from '../services/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Login"
      subtitle="Entre na sua conta para gerenciar sua coleção de skins"
      alternateLink={{
        text: "Não tem uma conta?",
        route: "/register",
        label: "Registre-se"
      }}
    >
      {!isUsingRealSupabaseCredentials() && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este app está usando credenciais de teste do Supabase. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para conectar ao seu projeto real.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
