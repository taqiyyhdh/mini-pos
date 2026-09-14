"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { LoaderCircle, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch {
      setError("Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/50 border border-slate-100 sm:p-9">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Store size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Masuk MiniPOS
          </h1>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Silakan masuk untuk mengelola kasir dan transaksi.
          </p>
        </div>

        {/* Form Section */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="nama@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="Masukkan password" 
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading && <LoaderCircle size={18} className="animate-spin" />}
            {loading ? "Memproses..." : "Login"}
          </Button>
        </form>

      </div>
    </main>
  );
}