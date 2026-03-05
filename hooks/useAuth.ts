"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("beatshelf_session");
    if (session) {
      setUser(JSON.parse(session));
    } else {
      router.replace("/welcome");
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("beatshelf_session");
    router.replace("/welcome");
  };

  return { user, loading, logout };
}
