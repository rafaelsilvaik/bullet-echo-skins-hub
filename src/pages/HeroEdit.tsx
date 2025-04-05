
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHero, useUpdateHero, useCreateHero } from "@/hooks/useHeroes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import HeroForm from "@/components/heroes/HeroForm";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";

const HeroEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const isEditing = id !== "new";
  const heroId = isEditing ? parseInt(id || "0") : 0;

  const { data: hero, isLoading: heroLoading } = useHero(heroId);
  const updateHero = useUpdateHero(heroId);
  const createHero = useCreateHero();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Você não tem permissão para editar heróis.",
      });
      navigate("/heroes");
    }
  }, [authLoading, isAdmin, navigate, toast]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateHero.mutateAsync(data);
        toast({
          title: "Herói atualizado",
          description: "O herói foi atualizado com sucesso!",
        });
      } else {
        const result = await createHero.mutateAsync(data);
        toast({
          title: "Herói criado",
          description: "O novo herói foi criado com sucesso!",
        });
        navigate(`/hero/${result.id}`);
        return;
      }
      navigate(`/hero/${heroId}`);
    } catch (error) {
      console.error("Erro ao salvar herói:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o herói. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isEditing && heroLoading)) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/heroes")}
          className="mb-6 hover:bg-red-900/20"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para lista de heróis
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? "Editar Herói" : "Novo Herói"}
          </h1>
          
          <div className="bg-black/50 border border-red-800 rounded-lg p-6">
            <HeroForm
              defaultValues={hero || {}}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HeroEdit;
