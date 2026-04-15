'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot,
  User,
  Loader2,
  Wand2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tessiAI, TessiResponse } from '@/services/tessiAI';
import { ttsService } from '@/services/ttsService';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function TessiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey beautiful! ✨ I'm Tessi, your personal AI beauty coach. Ask me anything about makeup, tutorials, or try a look in AR!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatch - must be first useEffect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Speak welcome message when chat opens
  useEffect(() => {
    if (isOpen && isTTSEnabled && messages.length === 1) {
      ttsService.speak(messages[0].content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Speak AI responses when they arrive
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && isTTSEnabled) {
      ttsService.speak(lastMessage.content);
    }
  }, [messages, isTTSEnabled]);

  // Toggle TTS
  const toggleTTS = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    ttsService.setEnabled(newState);
    if (!newState) {
      ttsService.stop();
    }
  };

  // Return null after all hooks for hydration safety
  if (!isMounted) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: TessiResponse = await tessiAI.chat(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! My AI brain had a little hiccup. Try again in a sec! 💫",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-send after a brief delay
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: suggestion,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);
      
      tessiAI.chat(suggestion).then(response => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setSuggestions(response.suggestions || []);
        setIsLoading(false);
      });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-110 transition-all flex items-center justify-center group animate-in fade-in zoom-in duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 animate-pulse opacity-50 group-hover:opacity-70" />
          <Bot className="w-7 h-7 text-white relative z-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl shadow-pink-500/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Tessi</h3>
                  <p className="text-xs text-pink-400">Your AI Beauty Coach</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTTS}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title={isTTSEnabled ? "Mute Tessi" : "Unmute Tessi"}
                >
                  {isTTSEnabled ? (
                    <Volume2 className="w-5 h-5 text-white/60" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-white/40" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user' 
                      ? "bg-white/10" 
                      : "bg-gradient-to-br from-pink-500 to-fuchsia-500"
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white/60" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    message.role === 'user'
                      ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-br-md"
                      : "bg-white/10 text-white/90 rounded-bl-md"
                  )}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !isLoading && (
              <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 rounded-full text-xs text-white/70 hover:text-pink-300 transition-all whitespace-nowrap flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Tessi about makeup..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-pink-500/50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Powered by AI • Free tier via OpenRouter
              </p>
            </div>
          </motion.div>
      )}
    </>
  );
}
