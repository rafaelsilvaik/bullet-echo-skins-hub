import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, não faz nada (poderia mostrar um spinner aqui)
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

export default ProtectedRoute;