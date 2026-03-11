"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Library, Search, Upload, AudioLines, Sparkles, Mic2, Flame, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Trending", href: "/trending", icon: Flame },
  { name: "For You", href: "/for-you", icon: Sparkles },
  { name: "Artists", href: "/artists", icon: Mic2 },
  { name: "Library", href: "/library", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-[220px] h-screen shrink-0 relative z-10" aria-label="Main navigation">
        <div className="flex flex-col h-full bg-white/[0.02] backdrop-blur-sm border-r border-white/[0.04]">
          <div className="flex items-center gap-2.5 px-5 pt-7 pb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <AudioLines size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent">
              Beatshelf
            </span>
          </div>

          {/* Quick search */}
          <form onSubmit={handleSearch} className="px-3 pb-4">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search music"
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-[12px] placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/30 transition-all"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-0.5 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-purple-500/15 text-purple-300 shadow-sm shadow-purple-500/10"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}>
                  <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mx-5 my-4 border-t border-white/[0.04]" />

          <div className="px-3 space-y-0.5">
            <Link href="/upload"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                pathname === "/upload"
                  ? "bg-orange-500/15 text-orange-300"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}>
              <Upload size={17} strokeWidth={1.8} />
              Upload
            </Link>
          </div>

          <div className="mt-auto px-3 pb-4">
            <Link href="/profile"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                pathname === "/profile"
                  ? "bg-purple-500/15 text-purple-300"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              )}>
              <User size={17} strokeWidth={1.8} />
              Profile
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-2xl border-t border-white/[0.04]" aria-label="Mobile navigation">
        <div className="flex items-center justify-around py-2.5">
          {[
            { name: "Home", href: "/", icon: Home },
            { name: "Search", href: "/search", icon: Search },
            { name: "For You", href: "/for-you", icon: Sparkles },
            { name: "Library", href: "/library", icon: Library },
            { name: "Profile", href: "/profile", icon: User },
          ].map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors",
                  active ? "text-purple-400" : "text-zinc-600"
                )}>
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
