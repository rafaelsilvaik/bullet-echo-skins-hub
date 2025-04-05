
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as chatService from '../services/chatService';
import { useAuth } from './useAuth';
import { toast } from "sonner";

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<chatService.ChatMessage[]>([]);
  
  // Buscar mensagens recentes
  const { data: recentMessages, isLoading } = useQuery({
    queryKey: ['chat', 'messages'],
    queryFn: () => chatService.getRecentMessages(),
    meta: {
      onError: (error: Error) => {
        toast.error(`Erro ao carregar mensagens: ${error.message}`);
        console.error('Erro ao carregar mensagens:', error);
      },
    },
  });
  
  // Configurar mensagens iniciais quando os dados são carregados
  useEffect(() => {
    if (recentMessages) {
      setMessages([...recentMessages].reverse());
    }
  }, [recentMessages]);
  
  // Subscrever para novas mensagens
  useEffect(() => {
    const unsubscribe = chatService.subscribeToChatMessages((newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Função para enviar mensagem
  const sendMessage = async (content: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      await chatService.sendMessage(user.id, content);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
  };
};

export default useChat;
