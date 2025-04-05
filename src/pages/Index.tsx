
import Layout from '../components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-bullet-red">Bem-vindo ao Bullet Echo Checklist</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl mb-8">
          Gerencie sua coleção de skins do jogo Bullet Echo e acompanhe seu progresso
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-bullet-darkgray p-6 rounded-lg border border-bullet-red/30 hover:border-bullet-red/70 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-bullet-red">Heróis</h2>
            <p className="text-gray-300 mb-4">Explore todos os heróis disponíveis no Bullet Echo e suas características.</p>
            <a href="/heroes" className="text-bullet-red hover:underline">Ver heróis →</a>
          </div>
          
          <div className="bg-bullet-darkgray p-6 rounded-lg border border-bullet-red/30 hover:border-bullet-red/70 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-bullet-red">Checklist</h2>
            <p className="text-gray-300 mb-4">Registre as skins que você já coletou e acompanhe seu progresso.</p>
            <a href="/checklist" className="text-bullet-red hover:underline">Ver checklist →</a>
          </div>
          
          <div className="bg-bullet-darkgray p-6 rounded-lg border border-bullet-red/30 hover:border-bullet-red/70 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-bullet-red">Chat</h2>
            <p className="text-gray-300 mb-4">Converse com outros jogadores sobre estratégias e compartilhe dicas.</p>
            <a href="/chat" className="text-bullet-red hover:underline">Ir para o chat →</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
