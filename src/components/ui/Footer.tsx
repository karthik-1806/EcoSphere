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
        { name: "Integrations", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Methodology", href: "#" },
        { name: "API Docs", href: "#" },
        { name: "Community", href: "/" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full mt-24 border-t border-slate-200 bg-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Upper Brand Grid & Navigation Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Main Brand Section */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-md font-bold text-slate-900 tracking-tight">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              EcoSphere
            </Link>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Enterprise-grade platform engineered to track, evaluate, and offset carbon footprints through precise intelligence data structures.
            </p>
          </div>

          {/* Dynamic Link Menus Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
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
                        className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-200"
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
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-500 tracking-wide">
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            <span>&copy; {currentYear} EcoSphere Corp.</span>
            <span className="text-slate-300">&bull;</span>
            <span>Built for scale and global sustainability structures.</span>
          </div>
          
          <div className="flex items-center gap-5 order-1 sm:order-2 text-slate-600">
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Accessible
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Privacy-First
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 99.9% Uptime
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}