
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

export type Skin = Database['public']['Tables']['skins']['Row'];
export type UserSkin = Database['public']['Tables']['user_skins']['Row'];

export const getAllSkins = async (): Promise<Skin[]> => {
  const { data, error } = await supabase
    .from('skins')
    .select('*')
    .order('hero_id, name');

  if (error) throw error;
  return data || [];
};

export const getSkinsByHeroId = async (heroId: number): Promise<Skin[]> => {
  const { data, error } = await supabase
    .from('skins')
    .select('*')
    .eq('hero_id', heroId)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getUserSkins = async (userId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('user_skins')
    .select('skin_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data ? data.map(item => item.skin_id) : [];
};

export const toggleUserSkin = async (userId: string, skinId: number): Promise<void> => {
  // Verificar se o usuário já possui a skin
  const { data: existingSkin, error: checkError } = await supabase
    .from('user_skins')
    .select('id')
    .eq('user_id', userId)
    .eq('skin_id', skinId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  if (existingSkin) {
    // Remover a skin se já existir
    const { error: removeError } = await supabase
      .from('user_skins')
      .delete()
      .eq('id', existingSkin.id);

    if (removeError) throw removeError;
  } else {
    // Adicionar a skin se não existir
    const { error: addError } = await supabase
      .from('user_skins')
      .insert([
        {
          user_id: userId,
          skin_id: skinId,
        },
      ]);

    if (addError) throw addError;
  }
};

export const createSkin = async (skin: Omit<Skin, 'id' | 'created_at'>): Promise<Skin> => {
  const { data, error } = await supabase
    .from('skins')
    .insert([skin])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSkin = async (id: number, skin: Partial<Omit<Skin, 'id' | 'created_at'>>): Promise<Skin> => {
  const { data, error } = await supabase
    .from('skins')
    .update(skin)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSkin = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('skins')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
