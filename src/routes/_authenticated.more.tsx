import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar, KareLogo } from "@/components/kare/PhoneShell";
import {
  Pill, Baby, Syringe, Droplet, HeartHandshake, ShieldCheck, GraduationCap,
  AlertTriangle, Stethoscope, Clock, Brain, Truck, LayoutDashboard, User,
  Bell, Lock, Languages, HelpCircle, LogOut, ChevronRight, Sparkles, Video
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/more")({
  head: () => ({ meta: [{ title: "More — KARE" }] }),
  component: MorePage,
});

const services = [
  { to: "/pharmacy", label: "Pharmacy Finder", icon: Pill, tint: "bg-primary-soft text-primary" },
  { to: "/maternal", label: "Maternal Health", icon: Baby, tint: "bg-emergency-soft text-emergency" },
  { to: "/immunization", label: "Child Immunization", icon: Syringe, tint: "bg-secondary text-info" },
  { to: "/blood-donors", label: "Blood Donors", icon: Droplet, tint: "bg-emergency-soft text-emergency" },
  { to: "/blood-bank", label: "Community Blood Bank", icon: HeartHandshake, tint: "bg-primary-soft text-primary" },
  { to: "/insurance", label: "Health Insurance", icon: ShieldCheck, tint: "bg-secondary text-info" },
  { to: "/education", label: "Health Education", icon: GraduationCap, tint: "bg-accent text-accent-foreground" },
  { to: "/symptom-checker", label: "AI Symptom Checker", icon: Sparkles, tint: "bg-primary-soft text-primary" },
  { to: "/telemedicine", label: "Telemedicine", icon: Video, tint: "bg-secondary text-info" },
  { to: "/incident", label: "Report Incident", icon: AlertTriangle, tint: "bg-emergency-soft text-emergency" },
  { to: "/outreach", label: "Mobile Outreach", icon: Stethoscope, tint: "bg-primary-soft text-primary" },
  { to: "/queue", label: "Hospital Queue", icon: Clock, tint: "bg-accent text-accent-foreground" },
  { to: "/mental", label: "Mental Health", icon: Brain, tint: "bg-secondary text-info" },
  { to: "/transport", label: "Emergency Transport", icon: Truck, tint: "bg-emergency-soft text-emergency" },
  { to: "/admin", label: "Govt. Dashboard", icon: LayoutDashboard, tint: "bg-primary-soft text-primary" },
];

const settings = [
  { to: "/profile", label: "Personal Information", icon: User },
  { to: "/profile", label: "Emergency Contacts", icon: Bell },
  { to: "/profile", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Privacy & Security", icon: Lock },
  { to: "/profile", label: "Language Preferences", icon: Languages },
  { to: "/profile", label: "Help & Support", icon: HelpCircle },
];

function MorePage() {
  return (
    <PhoneShell>
      <TopBar title="More" right={<KareLogo />} />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">HM</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Habeeb Muhammad</p>
            <p className="text-xs text-muted-foreground">0803 123 4567</p>
          </div>
          <Link to="/profile" className="text-xs font-semibold text-primary">View</Link>
        </div>

        <h2 className="mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">All Services</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.to} to={s.to as never} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.tint}`}><Icon className="h-5 w-5" /></span>
                <span className="text-[11px] font-medium leading-tight text-foreground">{s.label}</span>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profile & Settings</h2>
        <div className="mt-3 rounded-2xl border border-border bg-card divide-y divide-border">
          {settings.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} to={s.to as never} className="flex items-center gap-3 px-4 py-3.5">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{s.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
          <Link to="/" className="flex items-center gap-3 px-4 py-3.5 text-emergency">
            <LogOut className="h-4 w-4" />
            <span className="flex-1 text-sm font-semibold">Logout</span>
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
