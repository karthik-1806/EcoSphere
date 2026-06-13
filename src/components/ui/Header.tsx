"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Assessment", href: "/assessment" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Community", href: "/" }
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300"
      role="banner"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 transition-opacity duration-200 hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-600 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="text-sm font-black tracking-wider text-white">EP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold tracking-tight text-slate-800 transition-colors duration-200 group-hover:text-emerald-600">
              EcoSphere
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Sustain • Scale
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border border-emerald-700 bg-emerald-600 text-white shadow-sm"
                        : "border border-transparent text-slate-600 hover:text-slate-900"
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
            className="hidden text-xs font-semibold text-slate-600 transition duration-200 hover:text-emerald-600 sm:inline-block"
          >
            Sign In
          </Link>
          <Link
            href="/assessment"
            className="relative inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
          >
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
}
