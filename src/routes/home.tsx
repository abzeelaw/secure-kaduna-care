import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, KareLogo } from "@/components/kare/PhoneShell";
import {
  Search, Bell, Ambulance, Building2, Stethoscope, CalendarDays,
  Droplet, Pill, Video, Wallet, ChevronRight, MapPin, Star, Activity,
  Baby, Syringe, ShieldPlus, GraduationCap, AlertTriangle, Users,
  Brain, Truck, BarChart3, Siren, Sparkles
} from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — KARE" }] }),
  component: Home,
});

const quickActions = [
  { to: "/ambulance", label: "Ambulance", icon: Ambulance, color: "bg-emergency-soft text-emergency" },
  { to: "/hospitals", label: "Hospitals", icon: Building2, color: "bg-primary-soft text-primary" },
  { to: "/specialists", label: "Doctors", icon: Stethoscope, color: "bg-secondary text-info" },
  { to: "/appointments", label: "Appointments", icon: CalendarDays, color: "bg-accent text-accent-foreground" },
  { to: "/pharmacy", label: "Pharmacy", icon: Pill, color: "bg-primary-soft text-primary" },
  { to: "/blood-donors", label: "Blood Donors", icon: Droplet, color: "bg-emergency-soft text-emergency" },
  { to: "/records", label: "Medical Records", icon: Wallet, color: "bg-secondary text-info" },
  { to: "/telemedicine", label: "Telemedicine", icon: Video, color: "bg-accent text-accent-foreground" },
];

const moreModules = [
  { to: "/ai-symptoms", label: "AI Symptom Checker", icon: Sparkles },
  { to: "/maternal", label: "Maternal Health", icon: Baby },
  { to: "/immunization", label: "Child Immunization", icon: Syringe },
  { to: "/blood-bank", label: "Blood Bank", icon: Droplet },
  { to: "/insurance", label: "Health Insurance", icon: ShieldPlus },
  { to: "/education", label: "Health Education", icon: GraduationCap },
  { to: "/incident", label: "Report Incident", icon: AlertTriangle },
  { to: "/outreach", label: "Mobile Outreach", icon: Users },
  { to: "/queue", label: "Hospital Queue", icon: Activity },
  { to: "/mental-health", label: "Mental Health", icon: Brain },
  { to: "/transport", label: "Emergency Transport", icon: Truck },
  { to: "/admin", label: "Gov Dashboard", icon: BarChart3 },
];

function Home() {
  return (
    <PhoneShell>
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <KareLogo className="text-lg" />
        <Link to="/profile" aria-label="profile">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">HM</div>
        </Link>
      </div>

      <div className="px-5 pt-2">
        <p className="text-sm text-muted-foreground">Good morning,</p>
        <h1 className="text-xl font-bold">Habeeb Muhammad 👋</h1>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search doctor, hospital, service…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" />
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* SOS card */}
      <div className="px-5 pt-5">
        <Link to="/sos" className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-emergency p-5 text-emergency-foreground shadow-xl shadow-emergency/30">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Siren className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold">SOS Emergency</p>
            <p className="text-xs text-white/80">Tap for immediate assistance</p>
          </div>
          <ChevronRight className="h-5 w-5" />
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        </Link>
      </div>

      {/* Health summary */}
      <div className="px-5 pt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Heart rate", val: "78", unit: "bpm", color: "text-emergency" },
          { label: "Steps", val: "6.2k", unit: "today", color: "text-primary" },
          { label: "BP", val: "120/80", unit: "mmHg", color: "text-info" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-background p-3">
            <p className={`text-base font-bold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-muted-foreground">{m.unit}</p>
            <p className="mt-1 text-[11px] font-medium">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-2 px-5">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.to} to={a.to as never} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium leading-tight text-center">{a.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Nearby hospitals */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <h2 className="text-sm font-semibold">Nearby Hospitals</h2>
        <Link to="/hospitals" className="text-xs font-medium text-primary">View all</Link>
      </div>
      <div className="px-5 space-y-3">
        {[
          { name: "Barau Dikko Teaching Hospital", dist: "2.3 km", rating: 4.8, open: true },
          { name: "St. Gerald Catholic Hospital", dist: "3.7 km", rating: 4.6, open: true },
        ].map((h) => (
          <div key={h.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{h.name}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.dist}</span>
                <span className="text-success">• Open 24hrs</span>
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-[11px] font-semibold text-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" /> {h.rating}
            </span>
          </div>
        ))}
      </div>

      {/* More modules */}
      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">All Services</h2>
      <div className="grid grid-cols-3 gap-2 px-5">
        {moreModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.to} to={m.to as never} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3 text-center">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium leading-tight">{m.label}</span>
            </Link>
          );
        })}
      </div>
    </PhoneShell>
  );
}
