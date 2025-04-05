import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type RequireAuthProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

/**
 * Componente que protege rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 * Opcionalmente verifica se o usuário é administrador
 */
const RequireAuth = ({ children, requireAdmin = false }: RequireAuthProps) => {
  const { user, isAdmin, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, mostra um indicador de carregamento
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated || !user) {
    // Salva a localização atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se requer admin e o usuário não é admin, redireciona para home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default RequireAuth;