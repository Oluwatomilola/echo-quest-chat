import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Send, Users, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  display_name?: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  room_id: string;
  username?: string;
  display_name?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRooms();
      createDefaultRoom();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createDefaultRoom = async () => {
    if (!user) return;
    
    // Check if general room exists
    const { data: existingRooms } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('name', 'general');

    if (!existingRooms || existingRooms.length === 0) {
      // Create default room
      await supabase
        .from('chat_rooms')
        .insert({
          name: 'general',
          description: 'General discussion for all users',
          created_by: user.id,
        });
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please complete your profile setup.",
        variant: "destructive",
      });
      navigate('/profile');
    } else if (!data) {
      navigate('/profile');
    } else {
      setProfile(data);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat rooms",
        variant: "destructive",
      });
    } else {
      setRooms(data || []);
      if (data && data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!selectedRoom) return;

    const { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', selectedRoom)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
      return;
    }

    // Fetch profiles for all unique user IDs
    const userIds = [...new Set(messagesData?.map(m => m.user_id) || [])];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, username, display_name')
      .in('user_id', userIds);

    // Map messages with profile data
    const messagesWithProfiles = messagesData?.map(message => ({
      ...message,
      username: profilesData?.find(p => p.user_id === message.user_id)?.username,
      display_name: profilesData?.find(p => p.user_id === message.user_id)?.display_name,
    })) || [];

    setMessages(messagesWithProfiles);
  };

  const subscribeToMessages = () => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${selectedRoom}`
        },
        async (payload) => {
          const { data: messageData } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (messageData) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('user_id', messageData.user_id)
              .single();

            const newMessage = {
              ...messageData,
              username: profileData?.username,
              display_name: profileData?.display_name,
            };

            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        room_id: selectedRoom,
        user_id: user.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-card/50 to-card border-r border-border/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DeChat
            </h1>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          {profile && (
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {profile.display_name || profile.username}
            </p>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4" />
            <span className="font-medium">Chat Rooms</span>
          </div>
          <div className="space-y-2">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom === room.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  selectedRoom === room.id 
                    ? 'bg-gradient-to-r from-primary to-accent' 
                    : 'hover:bg-accent/10'
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                #{room.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-card/50 to-card backdrop-blur-sm">
              <h2 className="font-semibold">
                #{rooms.find(r => r.id === selectedRoom)?.name}
              </h2>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.user_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.user_id !== user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          {(message.username || 'A').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${
                      message.user_id === user?.id ? 'order-first' : ''
                    }`}>
                      {message.user_id !== user?.id && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.display_name || message.username || 'Anonymous'}
                        </div>
                      )}
                      <div className={`rounded-lg px-3 py-2 ${
                        message.user_id === user?.id
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-card border border-border/50'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                    {message.user_id === user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          {profile?.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-r from-card/50 to-card backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-background/50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Welcome to DeChat</h3>
              <p>Select a chat room to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;