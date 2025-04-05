
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { isUsingRealSupabaseCredentials } from '../services/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Criar Conta"
      subtitle="Registre-se para gerenciar sua coleção de skins"
      alternateLink={{
        text: "Já tem uma conta?",
        route: "/login",
        label: "Faça login"
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
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
