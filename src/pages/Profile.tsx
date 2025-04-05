
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/authService';
import Layout from '../components/layout/Layout';
import { toast } from 'sonner';
import { Shield, Edit2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';

const Profile = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    syndicate: '',
    about: '',
    avatar_url: '',
    trophies: 0
  });

  // Não precisamos mais deste redirecionamento manual
  // O componente ProtectedRoute já cuida disso para nós
  
  // Initialize form with profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        syndicate: userProfile.syndicate || '',
        about: userProfile.about || '',
        avatar_url: userProfile.avatar_url || '',
        trophies: userProfile.trophies || 0
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'trophies' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) return;
    
    try {
      setIsSubmitting(true);
      
      await updateUserProfile(user.id, {
        username: formData.username,
        syndicate: formData.syndicate || null,
        about: formData.about || null,
        avatar_url: formData.avatar_url || null,
        trophies: formData.trophies
      });
      
      toast.success('Perfil atualizado com sucesso');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !userProfile) {
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" /> Editar Perfil
              </Button>
            )}
          </div>
          
          <div className="bg-bullet-darkgray p-6 rounded-lg border border-bullet-red/30">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome de usuário</label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sindicato (opcional)</label>
                  <Input
                    name="syndicate"
                    value={formData.syndicate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">URL da Imagem de Perfil (opcional)</label>
                  <Input
                    name="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Troféus</label>
                  <Input
                    name="trophies"
                    type="number"
                    value={formData.trophies}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sobre mim (opcional)</label>
                  <Textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  {userProfile.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile.username} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-bullet-gray flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="ml-6">
                    <h2 className="text-xl font-bold flex items-center">
                      {userProfile.username}
                      {isAdmin && (
                        <span className="ml-2 text-bullet-red flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Admin
                        </span>
                      )}
                    </h2>
                    {userProfile.syndicate && (
                      <p className="text-gray-400">Sindicato: {userProfile.syndicate}</p>
                    )}
                    <p className="text-yellow-500 flex items-center mt-1">
                      🏆 {userProfile.trophies} troféus
                    </p>
                  </div>
                </div>
                
                {userProfile.about && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Sobre</h3>
                    <p className="text-gray-300">{userProfile.about}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
