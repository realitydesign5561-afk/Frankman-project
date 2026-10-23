import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('admin@frankman.ng');
  const [password, setPassword] = useState('FrankmanAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        localStorage.setItem('frankman_admin_token', data.token);
        localStorage.setItem('frankman_admin_user', JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#1C1917] text-white flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Showroom Admin Portal
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to manage inventory, customer orders, and store settings.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-[#FAF9F5] border border-stone-200 rounded-lg text-[11px] text-stone-600 space-y-1">
          <p className="font-semibold text-stone-800">Default Demo Credentials:</p>
          <p>Email: <code className="font-mono text-stone-900">admin@frankman.ng</code></p>
          <p>Password: <code className="font-mono text-stone-900">FrankmanAdmin2026!</code></p>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-stone-500 hover:text-stone-900 underline"
          >
            &larr; Back to Public Showroom
          </button>
        </div>
      </div>
    </div>
  );
};
