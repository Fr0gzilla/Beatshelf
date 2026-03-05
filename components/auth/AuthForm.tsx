"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AudioLines, Mail, Lock, ArrowRight, User, Sparkles } from "lucide-react";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Local auth: store users in localStorage
    const stored = JSON.parse(localStorage.getItem("beatshelf_users") || "[]");

    if (mode === "register") {
      if (stored.find((u: any) => u.email === email)) {
        setLoading(false);
        setError("An account with this email already exists.");
        return;
      }
      stored.push({ email, password, name: name || email.split("@")[0] });
      localStorage.setItem("beatshelf_users", JSON.stringify(stored));
    } else {
      const user = stored.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setLoading(false);
        setError("Invalid email or password.");
        return;
      }
    }

    localStorage.setItem("beatshelf_session", JSON.stringify({ email, name: name || email.split("@")[0] }));
    setLoading(false);
    router.push("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto px-6"
    >
      {/* Logo */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center shadow-xl shadow-purple-500/25">
          <AudioLines size={24} className="text-white" />
        </div>
        <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">
          Beatshelf
        </span>
      </motion.div>

      {/* Tab switcher */}
      <div className="relative flex bg-white/[0.04] rounded-2xl p-1 mb-8 border border-white/[0.06]">
        <motion.div
          className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-white/[0.08]"
          animate={{ left: mode === "login" ? "4px" : "50%", width: "calc(50% - 8px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); }}
            className={`relative z-10 flex-1 py-3 text-sm font-semibold text-center rounded-xl transition-colors ${
              mode === m ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {mode === "register" && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-4">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
          />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2.5 px-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20 mt-6"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Bottom decoration */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-10 text-zinc-700 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Sparkles size={12} />
        <span>Your personal beat sanctuary</span>
        <Sparkles size={12} />
      </motion.div>
    </motion.div>
  );
}
