
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

export type Hero = Database['public']['Tables']['heroes']['Row'];

export const getAllHeroes = async (): Promise<Hero[]> => {
  const { data, error } = await supabase
    .from('heroes')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching heroes:", error);
    throw error;
  }
  return data || [];
};

export const getHeroById = async (id: number): Promise<Hero | null> => {
  const { data, error } = await supabase
    .from('heroes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching hero by ID:", error);
    throw error;
  }
  return data;
};

export const createHero = async (hero: Omit<Hero, 'id' | 'created_at'>): Promise<Hero> => {
  const { data, error } = await supabase
    .from('heroes')
    .insert([hero])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateHero = async (id: number, hero: Partial<Omit<Hero, 'id' | 'created_at'>>): Promise<Hero> => {
  const { data, error } = await supabase
    .from('heroes')
    .update(hero)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteHero = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('heroes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
