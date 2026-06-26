import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, HeartPulse, FileText, Menu, Siren } from "lucide-react";

interface PhoneShellProps {
  children: ReactNode;
  hideNav?: boolean;
  bg?: string;
}

type Tab = { to: string; label: string; icon: typeof Home; isSos?: boolean };
const tabs: Tab[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/sos", label: "SOS", icon: Siren, isSos: true },
  { to: "/records", label: "Records", icon: FileText },
  { to: "/more", label: "More", icon: Menu },
];

export function PhoneShell({ children, hideNav, bg }: PhoneShellProps) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen w-full bg-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between px-6 pt-3 text-[13px] font-semibold text-foreground">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            <span className="ml-1.5 text-xs">100%</span>
          </span>
        </div>
        <main className={`flex-1 pb-28 ${bg ?? ""}`}>{children}</main>
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur">
            <ul className="flex items-end justify-around px-2 pb-3 pt-2">
              {tabs.map((t) => {
                const active = path === t.to || (t.to === "/home" && path === "/home");
                const Icon = t.icon;
                if (t.isSos) {
                  return (
                    <li key={t.to} className="-mt-7">
                      <Link to={t.to} className="flex flex-col items-center gap-1">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-lg shadow-emergency/40 ring-4 ring-background">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="text-[11px] font-semibold text-emergency">SOS</span>
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={t.to}>
                    <Link to={t.to} className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                      <span>{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export function KareLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className="font-extrabold tracking-tight text-primary">KARE</span>
      <svg viewBox="0 0 40 16" className="h-3 w-8 text-emergency" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 8 H8 L11 2 L16 14 L21 5 L25 11 L29 8 H40" />
      </svg>
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

export function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {right}
    </div>
  );
}
