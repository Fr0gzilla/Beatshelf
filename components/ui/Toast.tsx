"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { Check, X, Music, Heart, ListPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "info" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: number) => void;
};

let nextId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons: Record<ToastType, typeof Check> = {
  success: Check,
  info: Music,
  error: X,
};

const colors: Record<ToastType, string> = {
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  info: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  error: "bg-red-500/20 text-red-400 border-red-500/20",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg ${colors[toast.type]}`}
            >
              <Icon size={14} />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function toast(message: string, type: ToastType = "success") {
  useToastStore.getState().add(message, type);
}
