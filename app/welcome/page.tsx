"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IntroAnimation } from "@/components/intro/IntroAnimation";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  // If already logged in, skip to home
  useEffect(() => {
    const session = localStorage.getItem("beatshelf_session");
    if (session) {
      router.replace("/");
    }
  }, [router]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/[0.08] rounded-full blur-[150px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/[0.06] rounded-full blur-[150px]"
          animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-pink-500/[0.04] rounded-full blur-[120px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating music notes / dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[
          { left: 15, top: 20, dur: 3.2, del: 0.5 },
          { left: 82, top: 35, dur: 4.1, del: 1.2 },
          { left: 45, top: 75, dur: 3.8, del: 0.3 },
          { left: 28, top: 50, dur: 4.5, del: 2.1 },
          { left: 68, top: 15, dur: 3.5, del: 1.8 },
          { left: 90, top: 60, dur: 4.0, del: 0.8 },
          { left: 35, top: 85, dur: 3.3, del: 2.5 },
          { left: 55, top: 30, dur: 4.3, del: 1.0 },
          { left: 75, top: 70, dur: 3.7, del: 0.1 },
          { left: 20, top: 40, dur: 4.2, del: 1.5 },
          { left: 60, top: 55, dur: 3.9, del: 2.8 },
          { left: 40, top: 10, dur: 4.4, del: 0.6 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#f97316" : "#ec4899",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.dur,
              delay: p.del,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Intro animation overlay */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Auth form (visible after intro) */}
      {!showIntro && (
        <div className="relative z-10 w-full py-10">
          <AuthForm />
        </div>
      )}
    </div>
  );
}
