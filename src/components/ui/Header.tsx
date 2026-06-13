"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Assessment", href: "/assessment" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Community", href: "/" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo Identity */}
        <Link href="/" className="group flex items-center gap-3.5 transition-opacity duration-200 hover:opacity-90">
          <div className="relative w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-700 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="text-sm font-black tracking-wider text-white">
              EP
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold tracking-tight text-slate-800 group-hover:text-emerald-600 transition-colors duration-200">
              EcoSphere
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-slate-500">
              Sustain • Scale
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-1.5 rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-5 py-2 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 block ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm border border-emerald-700"
                        : "text-slate-600 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Premium CTA Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-emerald-600 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/assessment"
            className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Launch Platform
          </Link>
        </div>

      </div>
    </header>
  );
}