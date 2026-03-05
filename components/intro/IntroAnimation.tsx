"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioLines } from "lucide-react";

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"bars" | "logo" | "explode">("bars");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 1800);
    const t2 = setTimeout(() => setPhase("explode"), 3600);
    const t3 = setTimeout(() => onComplete(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "explode" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border border-purple-500/20"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: [0, 600 + i * 200],
                height: [0, 600 + i * 200],
                opacity: [0, 0.3, 0],
              }}
              transition={{ duration: 3, delay: 0.3 + i * 0.4, ease: "easeOut" }}
            />
          ))}

          {/* Background particles */}
          {[
            { x: -320, y: -280, s: 2.1, del: 1.6 }, { x: 250, y: -350, s: 1.5, del: 1.8 },
            { x: 380, y: 120, s: 2.8, del: 2.0 }, { x: -180, y: 300, s: 1.3, del: 1.7 },
            { x: -400, y: -50, s: 2.4, del: 2.3 }, { x: 150, y: 380, s: 1.8, del: 1.5 },
            { x: 300, y: -200, s: 2.6, del: 2.1 }, { x: -280, y: 180, s: 1.2, del: 1.9 },
            { x: -100, y: -380, s: 2.0, del: 2.4 }, { x: 350, y: 250, s: 1.7, del: 1.6 },
            { x: -350, y: -150, s: 2.3, del: 2.2 }, { x: 200, y: -100, s: 1.4, del: 1.8 },
            { x: 100, y: 300, s: 2.7, del: 2.0 }, { x: -250, y: -300, s: 1.6, del: 1.7 },
            { x: 400, y: -50, s: 2.2, del: 2.3 }, { x: -150, y: 250, s: 1.9, del: 1.5 },
            { x: 280, y: 180, s: 2.5, del: 2.1 }, { x: -380, y: 80, s: 1.1, del: 1.9 },
            { x: 50, y: -350, s: 2.9, del: 2.4 }, { x: -200, y: 350, s: 1.3, del: 1.6 },
          ].map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? "#a855f7" : "#f97316",
              }}
              initial={{
                x: 0, y: 0, opacity: 0, scale: 0,
              }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, 1, 0],
                scale: [0, p.s, 0],
              }}
              transition={{
                duration: 2.5,
                delay: p.del,
                ease: "easeOut",
              }}
            />
          ))}

          {/* EQ Bars Phase */}
          <motion.div
            className="flex items-end gap-[6px] h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "bars" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { d: 0, h1: 72, h2: 58 }, { d: 0.1, h1: 65, h2: 70 }, { d: 0.2, h1: 78, h2: 55 },
              { d: 0.15, h1: 68, h2: 75 }, { d: 0.25, h1: 74, h2: 60 }, { d: 0.3, h1: 62, h2: 68 },
              { d: 0.05, h1: 70, h2: 72 }, { d: 0.35, h1: 76, h2: 52 }, { d: 0.12, h1: 66, h2: 78 },
              { d: 0.22, h1: 80, h2: 56 },
            ].map((bar, i) => (
              <motion.div
                key={i}
                className="w-[6px] rounded-full"
                style={{
                  background: `linear-gradient(to top, #a855f7, #f97316)`,
                }}
                initial={{ height: 4 }}
                animate={{ height: [4, bar.h1, 8, bar.h2, 4] }}
                transition={{
                  duration: 1.2,
                  delay: bar.d,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Logo Phase */}
          <motion.div
            className="absolute flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: phase === "logo" ? 1 : 0,
              scale: phase === "logo" ? 1 : 0.5,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow behind logo */}
            <motion.div
              className="absolute w-40 h-40 bg-purple-500/30 rounded-full blur-[60px]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center shadow-2xl shadow-purple-500/40"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AudioLines size={40} className="text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === "logo" ? 1 : 0, y: phase === "logo" ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Beatshelf
            </motion.h1>

            <motion.p
              className="text-zinc-500 text-sm tracking-widest uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === "logo" ? 1 : 0, y: phase === "logo" ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Feel the rhythm
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
