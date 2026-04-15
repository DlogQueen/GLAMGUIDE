"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, User, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { tessiAI, TessiResponse } from "@/services/tessiAI";
import { ttsService } from "@/services/ttsService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function TessiChatFull() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey beautiful! I’m Tessi. Ask me anything about makeup, products, or your next look — I’ve got you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestions, isLoading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && isTTSEnabled) {
      ttsService.speak(last.content);
    }
  }, [messages, isTTSEnabled]);

  const toggleTTS = () => {
    const next = !isTTSEnabled;
    setIsTTSEnabled(next);
    ttsService.setEnabled(next);
    if (!next) ttsService.stop();
  };

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const content = text.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((p) => [...p, userMessage]);
    setInput("");
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response: TessiResponse = await tessiAI.chat(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, assistantMessage]);
      setSuggestions(response.suggestions || []);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "My brain glitched for a sec — try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => send(input);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold leading-none">Tessi</p>
              <p className="text-xs text-pink-300/80">AI Makeup Coach</p>
            </div>
          </div>
          <button
            onClick={toggleTTS}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title={isTTSEnabled ? "Mute Tessi" : "Unmute Tessi"}
          >
            {isTTSEnabled ? (
              <Volume2 className="w-5 h-5 text-white/70" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/50" />
            )}
          </button>
        </div>

        <div className="h-[60vh] sm:h-[64vh] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user" ? "bg-white/10" : "bg-gradient-to-br from-pink-500 to-fuchsia-500"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white/70" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-br-md"
                    : "bg-white/10 text-white/90 rounded-bl-md"
                )}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && !isLoading && (
          <div className="px-4 py-2 border-t border-white/10 flex gap-2 overflow-x-auto">
            {suggestions.map((s, i) => (
              <button
                key={`${s}-${i}`}
                onClick={() => send(s)}
                className="px-3 py-1.5 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 rounded-full text-xs text-white/70 hover:text-pink-200 transition-all whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Tessi…"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-pink-500/50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-white/30 mt-2 text-center">Makeup coach • Beta</p>
        </div>
      </div>
    </div>
  );
}

