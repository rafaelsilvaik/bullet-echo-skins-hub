
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  User, 
  CheckSquare, 
  MessageCircle, 
  Settings,
  LogOut
} from 'lucide-react';
import { signOut } from '../../services/authService';
import { toast } from "sonner";

const Sidebar = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Desconectado com sucesso");
      // Redirecionar para a página inicial após o logout
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error("Erro ao desconectar");
    }
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-bullet-black border-r border-bullet-red/30 fixed left-0 top-0 pt-20">
      <div className="flex flex-col gap-2 p-4">
        <Link 
          to="/" 
          className={`flex items-center gap-3 py-2 px-3 rounded-md ${
            isActive('/') 
              ? 'bg-bullet-red/20 text-bullet-red' 
              : 'text-white hover:bg-bullet-darkgray transition-colors'
          }`}
        >
          <Home size={20} />
          <span>Início</span>
        </Link>
        
        <Link 
          to="/heroes" 
          className={`flex items-center gap-3 py-2 px-3 rounded-md ${
            isActive('/heroes') 
              ? 'bg-bullet-red/20 text-bullet-red' 
              : 'text-white hover:bg-bullet-darkgray transition-colors'
          }`}
        >
          <User size={20} />
          <span>Heróis</span>
        </Link>
        
        <Link 
          to="/checklist" 
          className={`flex items-center gap-3 py-2 px-3 rounded-md ${
            isActive('/checklist') 
              ? 'bg-bullet-red/20 text-bullet-red' 
              : 'text-white hover:bg-bullet-darkgray transition-colors'
          }`}
        >
          <CheckSquare size={20} />
          <span>Checklist</span>
        </Link>
        
        <Link 
          to="/chat" 
          className={`flex items-center gap-3 py-2 px-3 rounded-md ${
            isActive('/chat') 
              ? 'bg-bullet-red/20 text-bullet-red' 
              : 'text-white hover:bg-bullet-darkgray transition-colors'
          }`}
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </Link>
        
        {isAdmin && (
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 py-2 px-3 rounded-md ${
              isActive('/admin') 
                ? 'bg-bullet-red/20 text-bullet-red' 
                : 'text-white hover:bg-bullet-darkgray transition-colors'
            }`}
          >
            <Settings size={20} />
            <span>Admin</span>
          </Link>
        )}
      </div>
      
      {user && (
        <div className="mt-auto border-t border-bullet-red/30 p-4">
          <Link 
            to="/profile" 
            className={`flex items-center gap-2 mb-2 py-2 px-3 rounded-md ${
              isActive('/profile') 
                ? 'bg-bullet-red/20 text-bullet-red' 
                : 'text-white hover:bg-bullet-darkgray transition-colors'
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-bullet-darkgray flex items-center justify-center border border-bullet-red/50 overflow-hidden">
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userProfile?.username || 'Usuário'}</span>
              <span className="text-xs text-gray-400">{userProfile?.syndicate || 'Sem sindicato'}</span>
            </div>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-md text-red-400 hover:bg-bullet-darkgray transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
