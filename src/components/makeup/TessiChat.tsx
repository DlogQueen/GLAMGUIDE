'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot,
  User,
  Loader2,
  Wand2,
  Mic,
  MicOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tessiAI, TessiResponse } from '@/services/tessiAI';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ── Web Speech API types ──────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function TessiChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic welcome — different every session, knows if returning
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = user?.user_metadata?.name?.split(' ')?.[0] || null;
    const greeting = name ? `Hey ${name}!` : 'Hey beautiful!';

    const isReturning = typeof window !== 'undefined' &&
      localStorage.getItem('tessi_visited') === 'true';

    if (isReturning) {
      const returningMessages = [
        `${greeting} Welcome back! What are we working on today? 💄`,
        `${greeting} You're back — I love that! What look are we creating? ✨`,
        `${greeting} Good to see you again! Ready to glow? 💅`,
        `${greeting} Back for more beauty magic? Let's go! 🌟`,
      ];
      return returningMessages[Math.floor(Math.random() * returningMessages.length)];
    }

    if (hour < 12) {
      return `${greeting} Good morning! I'm Tessi, your AI beauty coach. Let's start the day glowing! ✨`;
    } else if (hour < 17) {
      return `${greeting} I'm Tessi, your personal AI makeup artist. Ask me anything about makeup, tutorials, or try a look in AR! 💄`;
    } else {
      return `${greeting} Evening glam time! I'm Tessi. What look are we creating tonight? 🌙`;
    }
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    // Check STT support
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    setSttSupported(supported);
    
    // Simple welcome message after mount
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Hey beautiful! I'm Tessi, your AI beauty coach. What can I help you with today? ✨",
      timestamp: new Date()
    }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // ── STT ──────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!sttSupported || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send if we got something
      setInput(prev => {
        if (prev.trim()) {
          setTimeout(() => handleSendText(prev.trim()), 100);
        }
        return prev;
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [sttSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ── Send ─────────────────────────────────────────────────────
  const handleSendText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response: TessiResponse = await tessiAI.chat(userMessage.content, user?.id);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(response.suggestions || []);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! My AI brain had a little hiccup. Try again in a sec! 💫",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => handleSendText(input);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center group animate-in fade-in zoom-in duration-300"
          style={{
            background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)",
            boxShadow: "0 0 20px rgba(255,0,127,0.4)",
          }}
        >
          <div className="absolute inset-0 rounded-full animate-pulse opacity-40"
            style={{ background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)" }} />
          <Bot className="w-7 h-7 text-white relative z-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ boxShadow: "0 0 40px rgba(255,0,127,0.15)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
            style={{ background: "rgba(255,0,127,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)" }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
              </div>
              <div>
                <h3 className="font-bold text-white font-display">Tessi</h3>
                <p className="text-xs text-[#FF69B4]">Your AI Beauty Coach</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", message.role === 'user' ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'user' ? "bg-white/10" : ""
                )}
                  style={message.role === 'assistant' ? {
                    background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)"
                  } : {}}>
                  {message.role === 'user'
                    ? <User className="w-4 h-4 text-white/60" />
                    : <Sparkles className="w-4 h-4 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  message.role === 'user'
                    ? "text-white rounded-br-md"
                    : "bg-white/8 text-white/90 rounded-bl-md"
                )}
                  style={message.role === 'user' ? {
                    background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)"
                  } : {}}>
                  {message.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)" }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex gap-1">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#FF007F", animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
              {suggestions.map((suggestion, i) => (
                <button key={i} onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-[#FF007F]/20 border border-white/10 hover:border-[#FF007F]/30 rounded-full text-xs text-white/70 hover:text-[#FF69B4] transition-all whitespace-nowrap flex items-center gap-1">
                  <Wand2 className="w-3 h-3" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-black/30">
            {/* STT listening indicator */}
            {isListening && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-1 rounded-full animate-pulse"
                      style={{
                        height: `${8 + i * 4}px`,
                        background: "#FF007F",
                        animationDelay: `${i * 100}ms`
                      }} />
                  ))}
                </div>
                <span className="text-xs text-[#FF007F] font-medium">Listening…</span>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening…" : "Ask Tessi about makeup…"}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#FF007F]/50 rounded-xl"
              />
              {/* Mic button */}
              {sttSupported && (
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={isListening ? {
                    background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)",
                    boxShadow: "0 0 16px rgba(255,0,127,0.5)",
                  } : {
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  title={isListening ? "Stop listening" : "Speak to Tessi"}
                >
                  {isListening
                    ? <MicOff className="w-4 h-4 text-white" />
                    : <Mic className="w-4 h-4 text-white/70" />}
                </button>
              )}
              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #FF007F 0%, #FF69B4 100%)",
                  boxShadow: input.trim() ? "0 0 12px rgba(255,0,127,0.4)" : "none",
                }}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                  : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
            <p className="text-[10px] text-white/20 mt-2 text-center">
              {sttSupported ? "Tap 🎤 to speak · " : ""}Powered by AI
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
