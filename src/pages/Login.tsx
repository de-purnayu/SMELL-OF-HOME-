import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created! Check your email for a confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-brand-cream/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-brand-pink"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-brand-brown/60">
            {isSignUp ? 'Join the Smell of Home family' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg shadow-lg shadow-brand-brown/10 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              isSignUp ? (
                <>Create Account <UserPlus className="w-5 h-5" /></>
              ) : (
                <>Sign In <LogIn className="w-5 h-5" /></>
              )
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-brand-pink/30 text-center">
          <p className="text-brand-brown/60 mb-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-brand-soft-brown font-bold hover:underline"
          >
            {isSignUp ? 'Sign In Instead' : 'Create One Now'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
