"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: Library },
  { name: "Search", href: "/search", icon: Search },
  { name: "Queue", href: "/queue", icon: ListMusic },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 h-full bg-zinc-950 border-r border-zinc-800 p-4">
      <h1 className="text-2xl font-bold mb-8 text-white">Beatshelf</h1>

      <nav className="flex flex-col gap-2 text-zinc-300">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition",
                active && "bg-zinc-800 text-white"
              )}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
