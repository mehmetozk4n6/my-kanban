"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function HomePage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/board");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">
          <div className="splash-spinner" />
        </div>
      </div>
    );
  }

  if (user) return null; // Redirecting

  return <LoginScreen />;
}
