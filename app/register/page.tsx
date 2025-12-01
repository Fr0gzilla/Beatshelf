"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center h-screen bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Register</h1>

      <input
        className="mb-4 p-3 bg-zinc-800 rounded w-80"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="mb-4 p-3 bg-zinc-800 rounded w-80"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={register}
        className="px-6 py-3 bg-white text-black rounded font-bold"
      >
        Register
      </button>
    </div>
  );
}
