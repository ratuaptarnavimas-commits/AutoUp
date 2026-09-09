import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

export default function PasswordRecoveryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsOpen(true);
        setStatus('');
      }
    });

    const openRecoveryFromUrl = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const queryParams = new URLSearchParams(window.location.search);
      const recoveryType = hashParams.get('type');
      const recoveryCode = queryParams.get('code');

      if (recoveryCode) {
        const { error } = await supabase.auth.exchangeCodeForSession(recoveryCode);
        if (error) {
          setStatus(`Atkūrimo nuoroda nebegalioja: ${error.message}`);
          return;
        }
      }

      if (recoveryType === 'recovery' || recoveryCode) {
        setIsOpen(true);
        setStatus('');
      }
    };

    openRecoveryFromUrl();

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setStatus('Slaptažodį turi sudaryti bent 6 simboliai.');
      return;
    }

    if (password !== confirmation) {
      setStatus('Slaptažodžiai nesutampa.');
      return;
    }

    setIsSaving(true);
    setStatus('');
    const { error } = await supabase.auth.updateUser({ password });
    setIsSaving(false);

    if (error) {
      setStatus(`Nepavyko pakeisti slaptažodžio: ${error.message}`);
      return;
    }

    setStatus('Slaptažodis sėkmingai pakeistas. Dabar galite prisijungti su nauju slaptažodžiu.');
    setPassword('');
    setConfirmation('');
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
    await supabase.auth.signOut();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-emerald-700/80 bg-emerald-950 p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-amber-500/15 p-3 text-amber-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Naujas slaptažodis</h1>
            <p className="mt-1 text-sm text-emerald-100/70">Sukurkite naują administratoriaus slaptažodį.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-emerald-50">
            Naujas slaptažodis
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-2.5 pr-11 text-white outline-none focus:border-amber-500"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-100/70 hover:text-white"
                aria-label={showPassword ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <label className="block text-sm font-semibold text-emerald-50">
            Pakartokite slaptažodį
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              autoComplete="new-password"
              required
            />
          </label>

          {status && (
            <p className={`text-sm ${status.startsWith('Slaptažodis sėkmingai') ? 'text-emerald-300' : 'text-red-300'}`}>
              {status}
            </p>
          )}

          {status.startsWith('Slaptažodis sėkmingai') ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus('');
              }}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-bold text-emerald-950 transition-colors hover:bg-amber-400"
            >
              Uždaryti ir grįžti į svetainę
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 font-bold text-emerald-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Išsaugoma…' : 'Išsaugoti naują slaptažodį'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
