
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, updateUserRole, UserProfile } from '../services/authService';
import Layout from '../components/layout/Layout';
import { toast } from 'sonner';
import { Check, X, Shield, User as UserIcon, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const Admin = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && !isAdmin) {
      toast.error('Você não tem permissão para acessar essa página');
      navigate('/');
      return;
    }

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Erro ao carregar usuários');
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          user.username.toLowerCase().includes(query) ||
          user.syndicate?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`Papel atualizado para ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar papel do usuário');
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Carregando...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Administração</h1>
        
        <div className="flex items-center mb-6">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando usuários...</div>
        ) : (
          <div className="bg-bullet-darkgray rounded-lg overflow-hidden border border-bullet-red/30">
            <Table>
              <TableHeader className="bg-bullet-black">
                <TableRow>
                  <TableHead>Nome de usuário</TableHead>
                  <TableHead>Sindicato</TableHead>
                  <TableHead>Troféus</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-bullet-gray flex items-center justify-center">
                            <UserIcon className="w-3 h-3" />
                          </div>
                        )}
                        {user.username}
                      </TableCell>
                      <TableCell>{user.syndicate || 'Nenhum'}</TableCell>
                      <TableCell>{user.trophies}</TableCell>
                      <TableCell>
                        <span 
                          className={
                            user.role === 'admin' 
                              ? 'text-bullet-red font-semibold flex items-center gap-1' 
                              : 'text-gray-400'
                          }
                        >
                          {user.role === 'admin' && <Shield className="w-3 h-3" />}
                          {user.role === 'admin' ? 'Admin' : 'Usuário'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRoleChange(user.id, 'user')}
                            >
                              <X className="h-4 w-4 mr-1" /> Remover Admin
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRoleChange(user.id, 'admin')}
                            >
                              <Check className="h-4 w-4 mr-1" /> Fazer Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
