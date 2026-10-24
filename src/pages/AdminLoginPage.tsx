import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { clientStore } from '../lib/client-store';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your admin email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Try server-side authentication
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('frankman_admin_token', data.token);
          localStorage.setItem('frankman_admin_user', JSON.stringify(data.user));
          onLoginSuccess(data.token, data.user);
          return;
        }
      }

      // 2. Client-store fallback (handles offline, static previews, or Vercel static deployments)
      const fallbackResult = clientStore.verifyAdmin(cleanEmail, cleanPassword);
      if (fallbackResult.success && fallbackResult.token && fallbackResult.user) {
        localStorage.setItem('frankman_admin_token', fallbackResult.token);
        localStorage.setItem('frankman_admin_user', JSON.stringify(fallbackResult.user));
        onLoginSuccess(fallbackResult.token, fallbackResult.user);
        return;
      }

      // If both fail, report clear error
      setError('Invalid admin credentials. Please check your email and password.');
    } catch {
      // Network failure or offline fallback
      const fallbackResult = clientStore.verifyAdmin(cleanEmail, cleanPassword);
      if (fallbackResult.success && fallbackResult.token && fallbackResult.user) {
        localStorage.setItem('frankman_admin_token', fallbackResult.token);
        localStorage.setItem('frankman_admin_user', JSON.stringify(fallbackResult.user));
        onLoginSuccess(fallbackResult.token, fallbackResult.user);
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-12 bg-[#FAF8F5]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE5DC] p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF8EE] border border-[#EBD8B8] text-[#B58235] flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-7 h-7 text-[#B58235]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235] block">
            Frankman Showroom
          </span>
          <h1 className="font-heading text-2xl font-bold text-stone-900 tracking-tight">
            Showroom Admin Portal
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
            Authorized management for showroom inventory, customer orders, and store settings.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-[#EAE5DC] rounded-xl pl-10 pr-3.5 py-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] transition-colors min-h-[46px] placeholder:text-stone-400"
                placeholder="Enter authorized admin email"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-[#EAE5DC] rounded-xl pl-10 pr-3.5 py-3 focus:outline-none focus:border-[#B58235] focus:ring-1 focus:ring-[#B58235] transition-colors min-h-[46px] placeholder:text-stone-400"
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#B58235] hover:bg-[#9E6F2B] disabled:bg-stone-300 text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all min-h-[48px] cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
          >
            &larr; Return to Public Showroom
          </button>
        </div>
      </div>
    </div>
  );
};
