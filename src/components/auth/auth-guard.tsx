"use client"

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({children}: {children: React.ReactNode}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-hscreen place-items-center bg-slate-50">
        <div className="rounded-2xk bg-white px-6 py-4 text-sm font-semibold text-slate-600 sahdow-sm">
          Memeriksa sesi
        </div>
      </div>
    )
  }
  return children;
}