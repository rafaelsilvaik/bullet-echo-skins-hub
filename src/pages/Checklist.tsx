
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getAllSkins, getUserSkins, Skin } from "@/services/skinService";
import { getAllHeroes } from "@/services/heroService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const Checklist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "collected" | "missing">("all");

  const { data: heroes = [], isLoading: loadingHeroes } = useQuery({
    queryKey: ["heroes"],
    queryFn: getAllHeroes,
  });

  const { data: skins = [], isLoading: loadingSkins } = useQuery({
    queryKey: ["skins"],
    queryFn: getAllSkins,
  });

  const { data: userSkins = [], isLoading: loadingUserSkins } = useQuery({
    queryKey: ["userSkins", user?.id],
    queryFn: () => (user ? getUserSkins(user.id) : Promise.resolve([])),
    enabled: !!user,
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loadingHeroes || loadingSkins || loadingUserSkins) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando...</span>
        </div>
      </Layout>
    );
  }

  // Agrupar skins por herói
  const skinsByHero = skins.reduce<Record<number, Skin[]>>((acc, skin) => {
    if (!acc[skin.hero_id]) {
      acc[skin.hero_id] = [];
    }
    acc[skin.hero_id].push(skin);
    return acc;
  }, {});

  const heroesWithSkinCounts = heroes.map((hero) => {
    const heroSkins = skinsByHero[hero.id] || [];
    const collectedSkins = heroSkins.filter((skin) => userSkins.includes(skin.id));
    return {
      ...hero,
      totalSkins: heroSkins.length,
      collectedSkins: collectedSkins.length,
    };
  });

  // Filtrar e pesquisar heróis
  const filteredHeroes = heroesWithSkinCounts
    .filter((hero) => {
      if (filter === "all") return true;
      if (filter === "collected") return hero.collectedSkins > 0;
      if (filter === "missing") return hero.collectedSkins < hero.totalSkins;
      return true;
    })
    .filter((hero) =>
      hero.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calcular totais
  const totalSkins = skins.length;
  const collectedSkins = userSkins.length;
  const collectionPercentage = Math.round(
    (collectedSkins / (totalSkins || 1)) * 100
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="w-6 h-6 mr-2 text-red-500" />
            <h1 className="text-2xl font-bold tracking-tight">Meu Checklist</h1>
          </div>
        </div>

        <div className="bg-black/80 border border-red-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-red-900 rounded-md bg-black/50">
              <h3 className="text-lg font-medium mb-2">Total de Skins</h3>
              <div className="text-3xl font-bold text-white">{totalSkins}</div>
            </div>
            <div className="p-4 border border-red-900 rounded-md bg-black/50">
              <h3 className="text-lg font-medium mb-2">Skins Coletadas</h3>
              <div className="text-3xl font-bold text-green-500">{collectedSkins}</div>
            </div>
            <div className="p-4 border border-red-900 rounded-md bg-black/50">
              <h3 className="text-lg font-medium mb-2">Progresso</h3>
              <div className="text-3xl font-bold text-red-500">{collectionPercentage}%</div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{ width: `${collectionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar herói..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/80 border-red-800 focus-visible:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Todos
            </Button>
            <Button
              variant={filter === "collected" ? "default" : "outline"}
              onClick={() => setFilter("collected")}
              className={filter === "collected" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Coletados
            </Button>
            <Button
              variant={filter === "missing" ? "default" : "outline"}
              onClick={() => setFilter("missing")}
              className={filter === "missing" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Incompletos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeroes.map((hero) => (
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
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
                        hero.collectedSkins === hero.totalSkins && hero.totalSkins > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {hero.collectedSkins}/{hero.totalSkins}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        hero.collectedSkins === hero.totalSkins && hero.totalSkins > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          hero.totalSkins > 0
                            ? (hero.collectedSkins / hero.totalSkins) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHeroes.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">Nenhum herói encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros de busca
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checklist;
