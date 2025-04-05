
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as skinService from '../services/skinService';
import { useAuth } from './useAuth';

export const useSkins = () => {
  return useQuery({
    queryKey: ['skins'],
    queryFn: skinService.getAllSkins,
  });
};

export const useHeroSkins = (heroId: number) => {
  return useQuery({
    queryKey: ['skins', 'hero', heroId],
    queryFn: () => skinService.getSkinsByHeroId(heroId),
    enabled: !!heroId,
  });
};

export const useUserSkins = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['skins', 'user', user?.id],
    queryFn: () => (user ? skinService.getUserSkins(user.id) : Promise.resolve([])),
    enabled: !!user,
  });
};

export const useToggleUserSkin = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (skinId: number) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      return skinService.toggleUserSkin(user.id, skinId);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['skins', 'user', user.id] });
      }
    },
  });
};

export const useCreateSkin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skin: Parameters<typeof skinService.createSkin>[0]) => 
      skinService.createSkin(skin),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
      queryClient.invalidateQueries({ queryKey: ['skins', 'hero', variables.hero_id] });
    },
  });
};

export const useUpdateSkin = (skinId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (skin: Parameters<typeof skinService.updateSkin>[1]) => 
      skinService.updateSkin(skinId, skin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
    },
  });
};

export const useDeleteSkin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: skinService.deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] });
    },
  });
};
