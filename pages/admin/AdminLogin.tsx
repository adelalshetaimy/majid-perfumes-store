import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-bronze-500" size={32} />
      </div>
    );
  }

  if (session) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login failed', error);
      setStatus('error');
      setErrorMsg('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4">
      <div className="card-lux w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bronze-500 text-cream-50">
            <Lock size={28} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-bronze-700">لوحة التحكم</h1>
          <p className="mt-2 text-sm text-bronze-500">سجل دخول لإدارة المتجر</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label-lux">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-lux pr-11"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="label-lux">كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-lux pr-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{errorMsg}</div>
          )}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> جاري الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
