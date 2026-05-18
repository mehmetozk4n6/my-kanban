"use client";

import { useState } from "react";
import { useAuthContext } from "./AuthProvider";

export function LoginScreen() {
  const { signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch {
      setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="9" rx="2" fill="currentColor" opacity="0.9" />
              <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
              <rect x="12" y="3" width="9" height="5" rx="2" fill="currentColor" opacity="0.7" />
              <rect x="12" y="10" width="9" height="11" rx="2" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <h1 className="login-brand">MyKanban</h1>
        </div>

        {/* Headline */}
        <div className="login-headline">
          <h2>Haftanı planla,</h2>
          <h2 className="login-headline-accent">işlerini takip et.</h2>
          <p className="login-subtitle">
            Kişisel haftalık Kanban board&apos;unla verimliliğini artır.
          </p>
        </div>

        {/* Features */}
        <ul className="login-features">
          {[
            { icon: "📅", text: "7 günlük haftalık görünüm" },
            { icon: "🎯", text: "Öncelik yönetimi & etiketler" },
            { icon: "⚡", text: "Gerçek zamanlı senkronizasyon" },
          ].map((f) => (
            <li key={f.text} className="login-feature-item">
              <span className="login-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Sign in button */}
        <button
          id="google-signin-btn"
          onClick={handleSignIn}
          disabled={loading}
          className="google-signin-btn"
        >
          {loading ? (
            <span className="google-signin-spinner" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? "Giriş yapılıyor..." : "Google ile devam et"}
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-disclaimer">
          Verileriniz yalnızca sizin hesabınıza bağlıdır.
        </p>
      </div>

      {/* Background decoration */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
