
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/authService';
import { toast } from "sonner";
import { Menu, X, LogOut, User, CheckSquare, Settings, MessageCircle, Home } from 'lucide-react';
import TopNavigation from './TopNavigation';

const Header = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
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
    <header className="bg-bullet-black border-b border-bullet-red/30 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-bullet-red to-bullet-purple flex items-center justify-center animate-pulse-neon">
              <span className="text-white font-bold text-xl">BE</span>
            </div>
            <span className="text-2xl font-rajdhani font-bold gradient-text">Bullet Echo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <TopNavigation />
          </div>
          
          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-white hover:text-bullet-red transition-colors">
                  <div className="h-8 w-8 rounded-full bg-bullet-darkgray flex items-center justify-center border border-bullet-red/50">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.username} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className="font-medium">{userProfile?.username || 'Usuário'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bullet-button-outline flex items-center gap-1 py-1 px-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="bullet-button-outline">
                  Login
                </Link>
                <Link to="/register" className="bullet-button">
                  Registrar
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-bullet-red"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bullet-black border-t border-bullet-red/30 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Início</span>
            </Link>
            <Link 
              to="/heroes" 
              className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>Heróis</span>
            </Link>
            <Link 
              to="/checklist" 
              className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CheckSquare size={18} />
              <span>Checklist</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle size={18} />
              <span>Chat</span>
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md text-white hover:bg-bullet-darkgray transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Perfil</span>
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 px-3 rounded-md text-bullet-red hover:bg-bullet-darkgray transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link 
                  to="/login" 
                  className="bullet-button-outline w-full flex justify-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bullet-button w-full flex justify-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
