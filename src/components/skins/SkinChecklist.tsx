
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSkins, toggleUserSkin, Skin } from "@/services/skinService";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SkinChecklistProps {
  heroId: number;
  skins: Skin[];
}

const SkinChecklist = ({ heroId, skins }: SkinChecklistProps) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userSkins = [], isLoading: loadingUserSkins } = useQuery({
    queryKey: ["userSkins", user?.id],
    queryFn: () => user ? getUserSkins(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const toggleSkinMutation = useMutation({
    mutationFn: ({ userId, skinId }: { userId: string; skinId: number }) =>
      toggleUserSkin(userId, skinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkins", user?.id] });
      toast({
        title: "Coleção atualizada",
        description: "Sua lista de skins foi atualizada com sucesso!",
      });
    },
  });

  const toggleSkin = (skinId: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para marcar skins.",
      });
      return;
    }

    toggleSkinMutation.mutate({
      userId: user.id,
      skinId,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "comum":
      case "common":
        return "bg-gray-500";
      case "raro":
      case "rare":
        return "bg-blue-500";
      case "épico":
      case "epic":
        return "bg-purple-500";
      case "lendário":
      case "legendary":
        return "bg-yellow-500";
      case "mítico":
      case "mythic":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loadingUserSkins) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Skins ({skins.length})</h2>
        {isAdmin && (
          <Button 
            onClick={() => navigate(`/hero/${heroId}/skin/new`)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Skin
          </Button>
        )}
      </div>

      {skins.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">Nenhuma skin disponível</h3>
          <p className="text-muted-foreground">
            Este herói ainda não possui skins cadastradas.
          </p>
          {isAdmin && (
            <Button 
              onClick={() => navigate(`/hero/${heroId}/skin/new`)}
              className="bg-red-600 hover:bg-red-700 mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Skin
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skins.map((skin) => {
            const hasSkin = userSkins.includes(skin.id);
            
            return (
              <Card 
                key={skin.id}
                className={`border-red-800 bg-black/80 transition-all ${
                  hasSkin ? "border-green-500 shadow-lg shadow-green-500/20" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {skin.image_url ? (
                      <img 
                        src={skin.image_url} 
                        alt={skin.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <span className="text-gray-400">{skin.name}</span>
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-2 right-2 ${getRarityColor(skin.rarity)}`}
                    >
                      {skin.rarity}
                    </Badge>
                    {hasSkin && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500">
                          <Check className="w-3 h-3 mr-1" /> Adquirida
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{skin.name}</h3>
                      <Button
                        size="sm"
                        variant={hasSkin ? "outline" : "default"}
                        className={`ml-2 ${
                          hasSkin 
                            ? "border-green-500 text-green-500 hover:bg-green-500/20" 
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        onClick={() => toggleSkin(skin.id)}
                        disabled={toggleSkinMutation.isPending}
                      >
                        {toggleSkinMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : hasSkin ? (
                          "Remover"
                        ) : (
                          "Adquirir"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkinChecklist;
