import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Search, Send, User as UserIcon, Phone, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const { conversations, fetchConversations, activeConversation, setActiveConversation, messages, fetchMessages, sendMessage } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const receiver = activeConversation.participants.find(p => p._id !== user._id);
    sendMessage(receiver._id, inputText);
    setInputText('');
  };

  return (
    <div className="pt-32 pb-10 px-6 h-screen max-w-7xl mx-auto flex gap-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-white rounded-[2.5rem] card-shadow border border-slate-50 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find(p => p._id !== user._id);
            return (
              <button 
                key={conv._id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                  activeConversation?._id === conv._id ? 'bg-primary/5 border-primary/10 border' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center font-bold text-slate-500">
                  {otherUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-slate-900">{otherUser?.name || 'Unknown User'}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {conv.lastMessage?.text || 'No messages yet'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeConversation ? (
        <div className="flex-1 bg-white rounded-[2.5rem] card-shadow border border-slate-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                {activeConversation.participants.find(p => p._id !== user?._id)?.name?.charAt(0) || 'U'}
              </div>
              <div className="font-bold">
                {activeConversation.participants.find(p => p._id !== user?._id)?.name || 'Unknown User'}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-xl"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((msg, i) => {
              const isOwn = (msg.sender?._id || msg.sender) === user._id;
              return (
                <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl ${
                    isOwn ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-50 flex gap-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[2.5rem] card-shadow border border-slate-50 flex flex-col items-center justify-center text-slate-400">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10" />
          </div>
          <p className="text-xl font-medium">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

const MessageSquare = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default ChatPage;
