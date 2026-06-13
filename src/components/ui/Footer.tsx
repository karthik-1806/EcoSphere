"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Assessment", href: "/assessment" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Integrations", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Methodology", href: "#" },
        { name: "API Docs", href: "#" },
        { name: "Community", href: "/" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security", href: "#" }
      ]
    }
  ];

  return (
    <footer className="mt-24 w-full border-t border-slate-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Upper Brand Grid & Navigation Map */}
        <div className="grid grid-cols-1 gap-10 border-b border-slate-100 pb-12 md:grid-cols-12">
          {/* Main Brand Section */}
          <div className="flex flex-col gap-4 md:col-span-4">
            <Link
              href="/"
              className="text-md flex items-center gap-2 font-bold tracking-tight text-slate-900"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              EcoSphere
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              Enterprise-grade platform engineered to track, evaluate, and offset carbon footprints
              through precise intelligence data structures.
            </p>
          </div>

          {/* Dynamic Link Menus Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-emerald-600"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Metadata Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] font-medium tracking-wide text-slate-500 sm:flex-row">
          <div className="order-2 flex items-center gap-1.5 sm:order-1">
            <span>&copy; {currentYear} EcoSphere Corp.</span>
            <span className="text-slate-300">&bull;</span>
            <span>Built for scale and global sustainability structures.</span>
          </div>

          <div className="order-1 flex items-center gap-5 text-slate-600 sm:order-2">
            <span className="flex items-center gap-1.5 transition-colors hover:text-slate-900">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Accessible
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-slate-900">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> Privacy-First
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-slate-900">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
