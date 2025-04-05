
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { isUsingRealSupabaseCredentials } from '../services/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from '../services/authService';

const Login = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  useEffect(() => {
    if (user || isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, navigate, location]);

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
      <LoginForm 
        formData={formData}
        setFormData={setFormData}
        handleSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);

          try {
            await signIn(formData);
            toast.success('Login realizado com sucesso!');
            
            // Redirecionar para a página anterior ou para a home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
          } catch (error) {
            console.error('Erro no login:', error);
            toast.error(error.message || 'Falha no login. Verifique suas credenciais.');
          } finally {
            setIsLoading(false);
          }
        }}
        isLoading={isLoading}
      />
    </AuthLayout>
  );
};

export default Login;
