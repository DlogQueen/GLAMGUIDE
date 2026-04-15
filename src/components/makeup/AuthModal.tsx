"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export function AuthModal({ isOpen, onClose, redirectTo = "/dashboard" }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signIn, signUp, isAuthenticated } = useAuth();

  // Auto-close and redirect after successful auth
  useEffect(() => {
    if (isAuthenticated && isOpen && success) {
      const timer = setTimeout(() => {
        onClose();
        router.push(redirectTo);
        setTimeout(() => {
          setMode("login");
          setEmail("");
          setPassword("");
          setName("");
          setError("");
          setSuccess(false);
        }, 300);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isOpen, success, onClose, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden border-pink-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <h2 className="font-serif text-xl font-bold">
                      {mode === "login" ? "Welcome Back" : "Join Glam Guide"}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-pink-100">
                  {mode === "login"
                    ? "Sign in to access your profile"
                    : "Create an account to save your progress"}
                </p>
              </div>

              {/* Success State */}
              {success && (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Sparkles className="h-12 w-12 mx-auto text-pink-500 mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome, Gorgeous!</h3>
                  <p className="text-sm text-gray-500">Redirecting you now...</p>
                  <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 rounded-full animate-pulse" />
                </div>
              )}

              {/* Form */}
              {!success && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </>
                  )}
                </Button>

                {/* Toggle */}
                <div className="text-center text-sm">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-medium text-pink-600 hover:text-pink-700"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-medium text-pink-600 hover:text-pink-700"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
