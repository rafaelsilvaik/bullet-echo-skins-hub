
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CheckSquare, MessageCircle, User } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-game">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-rajdhani font-bold mb-4">
                <span className="gradient-text">Bullet Echo</span>
                <br />
                <span className="text-white">Checklist Skin</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8">
                Gerencie sua coleção de skins do jogo Bullet Echo e mantenha o controle de todas as suas aquisições
              </p>
              
              {user ? (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/heroes" className="bullet-button text-lg px-8 py-3">
                    Ver Heróis
                  </Link>
                  <Link to="/checklist" className="bullet-button-outline text-lg px-8 py-3">
                    Minha Coleção
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/login" className="bullet-button-outline text-lg px-8 py-3">
                    Login
                  </Link>
                  <Link to="/register" className="bullet-button text-lg px-8 py-3">
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-bullet-red/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-bullet-purple/5 blur-3xl"></div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-bullet-darkgray/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold text-center mb-12">
              <span className="gradient-text">Recursos</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-bullet-darkgray border border-gray-800 rounded-lg p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-bullet-red to-bullet-purple mb-4">
                  <CheckSquare className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-rajdhani font-bold text-white mb-2">Checklist de Skins</h3>
                <p className="text-gray-400">
                  Marque as skins que você já possui e mantenha um registro organizado da sua coleção.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-bullet-darkgray border border-gray-800 rounded-lg p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-bullet-red to-bullet-purple mb-4">
                  <User className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-rajdhani font-bold text-white mb-2">Perfil Personalizado</h3>
                <p className="text-gray-400">
                  Personalize seu perfil com nome de usuário, sindicato, troféus e informações sobre você.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-bullet-darkgray border border-gray-800 rounded-lg p-6 transition-transform hover:transform hover:scale-105 hover:shadow-lg">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-bullet-red to-bullet-purple mb-4">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-rajdhani font-bold text-white mb-2">Chat da Comunidade</h3>
                <p className="text-gray-400">
                  Converse com outros jogadores, compartilhe dicas e discuta estratégias no chat em tempo real.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-rajdhani font-bold mb-4">
              <span className="text-white">Pronto para gerenciar sua </span>
              <span className="gradient-text">coleção?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Registre-se agora e comece a organizar suas skins de Bullet Echo de forma eficiente e divertida.
            </p>
            
            {!user && (
              <Link to="/register" className="bullet-button text-lg px-8 py-3 inline-block">
                Começar Agora
              </Link>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
