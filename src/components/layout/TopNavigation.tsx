
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home,
  User,
  CheckSquare,
  MessageCircle,
  Settings
} from 'lucide-react';

const TopNavigation = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto">
      <Link 
        to="/" 
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
          isActive('/') 
            ? 'bg-bullet-red/20 text-bullet-red' 
            : 'text-white hover:bg-bullet-darkgray/80 hover:text-bullet-red transition-colors'
        }`}
      >
        <Home size={16} />
        <span>Início</span>
      </Link>
      
      <Link 
        to="/heroes" 
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
          isActive('/heroes') 
            ? 'bg-bullet-red/20 text-bullet-red' 
            : 'text-white hover:bg-bullet-darkgray/80 hover:text-bullet-red transition-colors'
        }`}
      >
        <User size={16} />
        <span>Heróis</span>
      </Link>
      
      <Link 
        to="/checklist" 
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
          isActive('/checklist') 
            ? 'bg-bullet-red/20 text-bullet-red' 
            : 'text-white hover:bg-bullet-darkgray/80 hover:text-bullet-red transition-colors'
        }`}
      >
        <CheckSquare size={16} />
        <span>Checklist</span>
      </Link>
      
      <Link 
        to="/chat" 
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
          isActive('/chat') 
            ? 'bg-bullet-red/20 text-bullet-red' 
            : 'text-white hover:bg-bullet-darkgray/80 hover:text-bullet-red transition-colors'
        }`}
      >
        <MessageCircle size={16} />
        <span>Chat</span>
      </Link>
      
      {isAdmin && (
        <Link 
          to="/admin" 
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
            isActive('/admin') 
              ? 'bg-bullet-red/20 text-bullet-red' 
              : 'text-white hover:bg-bullet-darkgray/80 hover:text-bullet-red transition-colors'
          }`}
        >
          <Settings size={16} />
          <span>Admin</span>
        </Link>
      )}
    </div>
  );
};

export default TopNavigation;
