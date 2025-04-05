
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const Chat = () => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Scroll para o final quando novas mensagens chegarem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Layout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-red-500" />
            <h1 className="text-2xl font-bold tracking-tight">Chat Global</h1>
          </div>
        </div>

        <Card className="border-red-800 bg-black/90 overflow-hidden h-[70vh] flex flex-col">
          <CardHeader className="p-4 border-b border-red-800">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-red-500" />
              <h2 className="text-lg font-medium">Chat em tempo real</h2>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Ainda não há mensagens</h3>
                <p className="text-muted-foreground">
                  Seja o primeiro a enviar uma mensagem no chat!
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = user.id === message.user_id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        } gap-3 max-w-[80%]`}
                      >
                        <Avatar className={isCurrentUser ? "ml-2" : "mr-2"}>
                          {message.user_profile?.avatar_url ? (
                            <AvatarImage src={message.user_profile.avatar_url} />
                          ) : (
                            <AvatarFallback className="bg-red-800">
                              {message.user_profile?.username
                                ? getInitials(message.user_profile.username)
                                : "??"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? "bg-red-800 text-white rounded-tr-none"
                                : "bg-gray-800 rounded-tl-none"
                            }`}
                          >
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-xs">
                                {message.user_profile?.username || "Usuário"}
                              </span>
                              <span className="text-xs ml-2 opacity-70">
                                {formatMessageDate(message.created_at)}
                              </span>
                            </div>
                            <p className="text-sm break-words">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 border-t border-red-800">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-black/50 border-red-800 focus-visible:ring-red-500"
                disabled={isSending}
              />
              <Button 
                type="submit" 
                disabled={isSending || !newMessage.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
