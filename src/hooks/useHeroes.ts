
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as heroService from '../services/heroService';

export const useHeroes = () => {
  return useQuery({
    queryKey: ['heroes'],
    queryFn: heroService.getAllHeroes,
    retry: 1,
    meta: {
      errorMessage: 'Error loading heroes'
    }
  });
};

export const useHero = (heroId: number) => {
  return useQuery({
    queryKey: ['hero', heroId],
    queryFn: () => heroService.getHeroById(heroId),
    enabled: !!heroId,
  });
};

export const useCreateHero = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hero: Parameters<typeof heroService.createHero>[0]) => 
      heroService.createHero(hero),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });
};

export const useUpdateHero = (heroId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hero: Parameters<typeof heroService.updateHero>[1]) => 
      heroService.updateHero(heroId, hero),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
      queryClient.invalidateQueries({ queryKey: ['hero', heroId] });
    },
  });
};

export const useDeleteHero = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: heroService.deleteHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });
};
