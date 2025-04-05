
import { useParams, useNavigate } from "react-router-dom";
import { useHero, useDeleteHero } from "@/hooks/useHeroes";
import { getSkinsByHeroId } from "@/services/skinService";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Edit, Loader2, Target, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import SkinChecklist from "@/components/skins/SkinChecklist";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const HeroDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const heroId = id ? parseInt(id) : 0;
  const [activeTab, setActiveTab] = useState<"details" | "skins">("details");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: hero, isLoading: heroLoading } = useHero(heroId);
  const deleteHero = useDeleteHero();
  
  const { data: skins = [], isLoading: skinsLoading } = useQuery({
    queryKey: ["skins", heroId],
    queryFn: () => getSkinsByHeroId(heroId),
    enabled: !!heroId,
  });

  const handleDelete = async () => {
    try {
      await deleteHero.mutateAsync(heroId);
      toast({
        title: "Herói excluído",
        description: "O herói foi excluído com sucesso!",
      });
      navigate("/heroes");
    } catch (error) {
      console.error("Erro ao excluir herói:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o herói. Tente novamente.",
      });
    }
    setDeleteDialogOpen(false);
  };

  if (heroLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Herói não encontrado</h1>
        <Button onClick={() => navigate("/heroes")} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para lista de heróis
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/heroes")}
        className="mb-6 hover:bg-red-900/20"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar para lista de heróis
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card className="border-red-800 bg-black/80 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {hero.image_url ? (
                  <img 
                    src={hero.image_url} 
                    alt={hero.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <Target className="w-12 h-12 text-red-500" />
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="bg-black/60 border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hero/${hero.id}/edit`);
                        }}
                      >
                        <Edit className="w-4 h-4 text-red-400" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="bg-black/60 border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold">{hero.name}</h1>
                <p className="mt-4 text-gray-400">{hero.description}</p>

                <div className="mt-8 border-t border-red-900 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Criado em:</span>
                    <span className="text-sm">
                      {new Date(hero.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-400">Skins disponíveis:</span>
                    <Badge variant="secondary" className="bg-red-900 text-white">
                      {skins.length}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="border-b border-red-900 mb-6">
            <nav className="flex gap-4">
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-none border-b-2 ${
                  activeTab === "details" 
                    ? "border-red-500 text-red-500" 
                    : "border-transparent text-gray-400"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Detalhes
              </Button>
              <Button
                variant="ghost"
                className={`px-4 py-2 rounded-none border-b-2 ${
                  activeTab === "skins" 
                    ? "border-red-500 text-red-500" 
                    : "border-transparent text-gray-400"
                }`}
                onClick={() => setActiveTab("skins")}
              >
                Skins
              </Button>
            </nav>
          </div>
          
          {activeTab === "details" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Informações do Herói</h2>
              <p className="text-gray-400">
                {hero.description || "Nenhuma informação disponível."}
              </p>
            </div>
          )}
          
          {activeTab === "skins" && (
            <>
              {skinsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <SkinChecklist heroId={heroId} skins={skins} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-red-800">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o herói "{hero.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleDelete}
              disabled={deleteHero.isPending}
            >
              {deleteHero.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroDetail;
