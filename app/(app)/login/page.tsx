"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { AudioLines } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { alert(error.message); return; }
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-purple-600/15 to-transparent rounded-full blur-[100px] -translate-y-1/2" />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <AudioLines size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">Beatshelf</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Welcome back</h1>

        <div className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all" />
        </div>

        <button type="button" onClick={login} disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-zinc-600 mt-6">
          No account?{" "}
          <Link href="/register" className="text-purple-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
