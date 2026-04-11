import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';
import BASE_URL from '../api/config';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_URL = `${BASE_URL}/api/chats`;

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/unread-count`, config);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io(BASE_URL);
      setSocket(newSocket);

      newSocket.emit('addUser', user._id);
      fetchUnreadCount();

      newSocket.on('getMessage', (data) => {
        setMessages((prev) => [...prev, {
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        }]);
        
        // If not looking at the chat from this specific sender, increment unread
        setUnreadCount(prev => prev + 1);
      });

      return () => newSocket.close();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/conversations`, config);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const startConversation = async (receiverId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_URL}/conversation`, { receiverId }, config);
      setActiveConversation(data);
      fetchMessages(data._id);
      return data;
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_URL}/messages/${conversationId}`, config);
      setMessages(data);
      // After fetching (viewing) messages, refresh total unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (receiverId, text) => {
    if (!activeConversation) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_URL}/message`, {
        conversationId: activeConversation._id,
        receiverId,
        text
      }, config);

      socket.emit('sendMessage', {
        senderId: user._id,
        receiverId,
        text
      });

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      socket, 
      conversations, 
      fetchConversations, 
      activeConversation, 
      setActiveConversation,
      startConversation,
      messages,
      fetchMessages,
      sendMessage,
      unreadCount,
      setUnreadCount,
      fetchUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};
