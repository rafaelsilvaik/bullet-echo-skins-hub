import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

export type AuthCredentials = {
  email: string;
  password: string;
};

// Update UserProfile type to include the role field
export type UserProfile = {
  id: string;
  username: string;
  trophies: number;
  role: string;
  syndicate: string | null;
  about: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export const signUp = async ({ email, password }: AuthCredentials, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    // Cria o perfil do usuário após o registro
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: data.user.id,
          username,
          trophies: 0,
          role: 'user', // Default role is user
        },
      ]);

    if (profileError) throw profileError;
  }

  return data;
};

export const signIn = async ({ email, password }: AuthCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Não precisamos configurar o listener aqui, pois já está no AuthProvider
    // O Supabase já gerencia a persistência da sessão internamente

    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Não precisamos remover manualmente a sessão do localStorage
    // ou gerenciar listeners, o Supabase cuida disso internamente
    
    console.log('Logout realizado com sucesso');
    
    // Não redirecionamos diretamente aqui para permitir que o AuthProvider
    // gerencie o estado de autenticação e o redirecionamento
    // O redirecionamento será feito pelo componente que chamou esta função
    
    return true;
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('is_admin', { user_id: userId });
  
  if (error) throw error;
  return !!data;
};

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('id', userId);

  if (error) throw error;
  return data;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('username');
  
  if (error) throw error;
  return data || [];
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};
