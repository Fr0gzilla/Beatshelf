"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search, ListMusic, Upload, Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Library", href: "/library", icon: Library },
  { name: "Queue", href: "/queue", icon: ListMusic },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] h-screen bg-[#0f0f11] border-r border-white/5 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Disc3 size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">Beatshelf</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 my-4 border-t border-white/5" />

        {/* Upload */}
        <div className="px-3">
          <Link
            href="/upload"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname === "/upload"
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Upload size={18} />
            Upload
          </Link>
        </div>

        {/* Bottom card */}
        <div className="mt-auto px-4 pb-5">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-1">Your music</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Upload your tracks and build your library.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-20 left-0 right-0 z-40 bg-[#0f0f11]/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                  active ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
