
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroes } from "@/hooks/useHeroes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const Heroes = () => {
  const { data: heroes, isLoading, error } = useHeroes();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar heróis",
        description: "Não foi possível carregar a lista de heróis."
      });
      console.error("Heroes loading error:", error);
    }
  }, [error, toast]);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="w-6 h-6 mr-2 text-red-500" />
            <h1 className="text-2xl font-bold tracking-tight">Heróis</h1>
          </div>
          {user && (
            <Button onClick={() => navigate("/hero/new")} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Herói
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : heroes && heroes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero) => (
              <Card 
                key={hero.id} 
                className="overflow-hidden cursor-pointer border-red-800 bg-black/80 transition-all hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
                onClick={() => navigate(`/hero/${hero.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {hero.image_url ? (
                      <img 
                        src={hero.image_url} 
                        alt={hero.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <span className="text-gray-400">{hero.name}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{hero.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400 line-clamp-2">{hero.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">Nenhum herói encontrado</h3>
            <p className="text-muted-foreground mb-6">Comece adicionando o primeiro herói para seu checklist!</p>
            <Button onClick={() => navigate("/hero/new")} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Herói
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Heroes;
