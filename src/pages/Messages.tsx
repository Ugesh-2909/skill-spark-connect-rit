import { MainLayout } from "@/layouts/MainLayout";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Loader2 } from "lucide-react";
import { useMessages, Message } from "@/hooks/use-messages";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialUserId);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    conversations, 
    loading, 
    fetchMessages, 
    fetchConversations, 
    sendMessage 
  } = useMessages();
  
  // Fetch conversations when component mounts
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  // Fetch selected conversation
  useEffect(() => {
    const fetchSelectedConversation = async () => {
      if (selectedConversation && user) {
        await fetchMessages(selectedConversation);
        
        // Fetch user details
        const { data } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', selectedConversation)
          .single();
        
        setSelectedUser(data);
      }
    };
    
    fetchSelectedConversation();
  }, [selectedConversation, user]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    conversation => 
      conversation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;
    
    await sendMessage(selectedConversation, messageText);
    setMessageText("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-uprit-indigo" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Connect with others to start messaging
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div key={conversation.userId}>
                      <button
                        className={`w-full p-4 text-left flex items-center hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation.userId ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.userId)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.avatar_url} alt={conversation.full_name} />
                            <AvatarFallback>{conversation.full_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-uprit-indigo text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <p className="font-medium">{conversation.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(conversation.lastMessageTime).toLocaleDateString()}
                        </div>
                      </button>
                      <Separator />
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Message Thread */}
          <Card className="md:col-span-2">
            {selectedConversation && selectedUser ? (
              <>
                <CardHeader className="pb-2 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.full_name} />
                      <AvatarFallback>{selectedUser.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <CardTitle className="text-base">{selectedUser.full_name}</CardTitle>
                      <p className="text-xs text-gray-500">@{selectedUser.username}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100vh-320px)]">
                  <ScrollArea className="flex-1 p-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-uprit-indigo" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Start the conversation by sending a message
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === user?.id
                                  ? 'bg-uprit-indigo text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Type a message..." 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[calc(100vh-250px)]">
                <div className="text-center">
                  <p className="text-lg text-gray-500">Select a conversation</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
