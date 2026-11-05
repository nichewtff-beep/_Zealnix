import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { ZealnixLogo } from '../ZealnixLogo';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
  onReturnToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onReturnToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      // Store token in localStorage for cross-context authorization headers
      if (data.token) {
        try {
          localStorage.setItem('zealnix_admin_token', data.token);
        } catch (e) {
          console.warn('Could not store admin token in localStorage:', e);
        }
      }

      // Store in memory / state via callback
      onLoginSuccess(data.user);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Network error occurred while connecting to the authorization server.');
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@zealnix.com');
    setPassword('ZealnixAdmin#2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#EAE4DC] flex flex-col justify-between selection:bg-[#D5C3AA] selection:text-[#261C14] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(60,42,33,0.35)_0%,rgba(38,28,20,0.15)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      </div>

      {/* Top Bar with Return to Store */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex items-center justify-between">
        <button
          onClick={onReturnToStore}
          className="group inline-flex items-center gap-2 text-xs font-grotesk font-bold uppercase tracking-[1px] text-[#D5C3AA] hover:text-[#EAE4DC] transition-colors cursor-pointer py-1.5 px-3 border border-[#D5C3AA]/30 hover:border-[#D5C3AA]"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>RETURN TO STORE</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-grotesk text-[#8C8D88] tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-[#D5C3AA]" />
          <span>SERVER AUTHORIZED AREA</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 sm:py-12 my-auto">
        <div className="bg-[#141414] border-2 border-[#D5C3AA]/30 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <ZealnixLogo size="md" />
            </div>
            <h1 className="font-anton text-2xl sm:text-3xl uppercase tracking-wider text-[#EAE4DC]">
              ADMIN PORTAL
            </h1>
            <p className="font-inter text-xs text-[#8C8D88] mt-2 leading-relaxed">
              Restricted management console. All sign-in attempts are logged and rate-limited.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-inter flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 font-grotesk">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-[1px] text-[#D5C3AA] mb-2"
              >
                ADMIN USERNAME OR EMAIL
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zealnix.com"
                  className="w-full bg-[#0B0B0B] text-[#EAE4DC] placeholder-[#555] px-4 py-3 pl-10 border border-[#3E403D] focus:border-[#D5C3AA] focus:ring-1 focus:ring-[#D5C3AA] outline-none text-sm transition-colors"
                />
                <Mail className="w-4 h-4 text-[#8C8D88] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-[1px] text-[#D5C3AA] mb-2"
              >
                SECURE PASSWORD
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#0B0B0B] text-[#EAE4DC] placeholder-[#555] px-4 py-3 pl-10 pr-10 border border-[#3E403D] focus:border-[#D5C3AA] focus:ring-1 focus:ring-[#D5C3AA] outline-none text-sm transition-colors"
                />
                <Lock className="w-4 h-4 text-[#8C8D88] absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8C8D88] hover:text-[#EAE4DC] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#D5C3AA] hover:bg-[#C5B095] text-[#261C14] font-grotesk font-bold text-xs uppercase tracking-[1.5px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>SIGN IN TO PORTAL →</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info for Easy Evaluation */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs font-inter text-[#8C8D88] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA]">
                DEFAULT ADMIN CREDENTIALS:
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[11px] font-grotesk font-bold uppercase tracking-wider text-[#D5C3AA] hover:underline cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <div className="bg-[#0B0B0B] p-2.5 border border-white/10 font-mono text-[11px] text-[#EAE4DC] flex flex-col gap-1">
              <div>Email: <span className="text-[#D5C3AA]">admin@zealnix.com</span></div>
              <div>Pass: <span className="text-[#D5C3AA]">ZealnixAdmin#2026!</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 py-6 text-center text-xs font-grotesk text-[#555]">
        © {new Date().getFullYear()} ZEALNIX INC. SECURE ACCESS LAYER.
      </footer>
    </div>
  );
};
