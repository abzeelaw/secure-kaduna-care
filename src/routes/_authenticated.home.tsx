import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PhoneShell, KareLogo } from "@/components/kare/PhoneShell";
import {
  Search, Bell, Ambulance, Building2, Stethoscope, CalendarDays,
  Droplet, Pill, Video, Wallet, ChevronRight, MapPin, Star,
  Baby, Syringe, ShieldPlus, GraduationCap, AlertTriangle, Users,
  Brain, Truck, BarChart3, Siren, Sparkles, Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "@/components/ThemeToggle";
import VoiceControlButton from "@/components/VoiceControlButton";

export const Route = createFileRoute("/_authenticated/home")({
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
  { to: "/records", label: "Records", icon: Wallet, color: "bg-secondary text-info" },
  { to: "/telemedicine", label: "Telemedicine", icon: Video, color: "bg-accent text-accent-foreground" },
];

const bannerSlides = [
  {
    title: "24/7 emergency care",
    body: "Get ambulances, hospitals and urgent support in seconds.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    cta: { label: "Call emergency", to: "/sos" },
  },
  {
    title: "Care that follows you",
    body: "Track appointments, records and specialist care in one place.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    cta: { label: "Open records", to: "/records" },
  },
  {
    title: "Health support for every family",
    body: "Maternal, child and mental health services all in one app.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    cta: { label: "Explore services", to: "/more" },
  },
];

const moreModules = [
  { to: "/symptom-checker", label: "AI Symptom Checker", icon: Sparkles },
  { to: "/maternal", label: "Maternal Health", icon: Baby },
  { to: "/immunization", label: "Child Immunization", icon: Syringe },
  { to: "/blood-bank", label: "Blood Bank", icon: Droplet },
  { to: "/insurance", label: "Health Insurance", icon: ShieldPlus },
  { to: "/education", label: "Health Education", icon: GraduationCap },
  { to: "/incident", label: "Report Incident", icon: AlertTriangle },
  { to: "/outreach", label: "Mobile Outreach", icon: Users },
  { to: "/queue", label: "Hospital Queue", icon: Activity },
  { to: "/mental", label: "Mental Health", icon: Brain },
  { to: "/transport", label: "Emergency Transport", icon: Truck },
  { to: "/admin", label: "Gov Dashboard", icon: BarChart3 },
];

function Home() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });
  const { data: hospitals = [] } = useQuery({
    queryKey: ["hospitals-nearby"],
    queryFn: async () => {
      const { data } = await supabase.from("hospitals").select("id,name,type,rating,address").order("rating", { ascending: false }).limit(3);
      return data ?? [];
    },
  });

  const [activeBanner, setActiveBanner] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((value) => (value + 1) % bannerSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredQuickActions = useMemo(() => {
    if (!search.trim()) return quickActions;
    const term = search.toLowerCase();
    return quickActions.filter((action) => action.label.toLowerCase().includes(term));
  }, [search]);

  const filteredMoreModules = useMemo(() => {
    if (!search.trim()) return moreModules;
    const term = search.toLowerCase();
    return moreModules.filter((module) => module.label.toLowerCase().includes(term));
  }, [search]);

  const name = profile?.full_name?.split(" ")[0] ?? "there";
  const initials = (profile?.full_name ?? user?.email ?? "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <PhoneShell>
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <KareLogo className="text-lg" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <VoiceControlButton />
          <Link to="/profile" aria-label="profile">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">{initials}</div>
          </Link>
        </div>
      </div>

      <div className="px-5 pt-2">
        <p className="text-sm text-muted-foreground">Good morning,</p>
        <h1 className="text-xl font-bold">{name} 👋</h1>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctor, hospital, service…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" />
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[28px] border border-border shadow-lg">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${index === activeBanner ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
          <div className="relative flex min-h-44 flex-col justify-between p-4 text-white">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">KARE spotlight</p>
              <h2 className="mt-2 text-xl font-semibold">{bannerSlides[activeBanner].title}</h2>
              <p className="mt-1 max-w-xs text-sm text-white/85">{bannerSlides[activeBanner].body}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Link to={bannerSlides[activeBanner].cta.to as never} className="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur">
                {bannerSlides[activeBanner].cta.label}
              </Link>
              <div className="flex gap-1.5">
                {bannerSlides.map((slide, index) => (
                  <button key={slide.title} onClick={() => setActiveBanner(index)} className={`h-2.5 rounded-full transition-all ${index === activeBanner ? "w-6 bg-white" : "w-2.5 bg-white/50"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <div className="px-5 pt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Heart rate", val: "78", unit: "bpm", color: "text-emergency" },
          { label: "Steps", val: "6.2k", unit: "today", color: "text-primary" },
          { label: "BP", val: profile?.blood_group ?? "120/80", unit: "blood", color: "text-info" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-background p-3">
            <p className={`text-base font-bold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-muted-foreground">{m.unit}</p>
            <p className="mt-1 text-[11px] font-medium">{m.label}</p>
          </div>
        ))}
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-2 px-5">
        {filteredQuickActions.length > 0 ? filteredQuickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.to} to={a.to as never} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium leading-tight text-center">{a.label}</span>
            </Link>
          );
        }) : <div className="col-span-4 rounded-2xl border border-dashed border-border bg-background/80 p-3 text-center text-sm text-muted-foreground">No services match your search yet.</div>}
      </div>

      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <h2 className="text-sm font-semibold">Top Hospitals</h2>
        <Link to="/hospitals" className="text-xs font-medium text-primary">View all</Link>
      </div>
      <div className="px-5 space-y-3">
        {hospitals.map((h) => (
          <Link key={h.id} to="/hospitals" className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{h.name}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.address ?? "Kaduna"}</span>
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-[11px] font-semibold text-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" /> {Number(h.rating).toFixed(1)}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">All Services</h2>
      <div className="grid grid-cols-3 gap-2 px-5 pb-6">
        {filteredMoreModules.length > 0 ? filteredMoreModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.to} to={m.to as never} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3 text-center">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-medium leading-tight">{m.label}</span>
            </Link>
          );
        }) : <div className="col-span-3 rounded-2xl border border-dashed border-border bg-background/80 p-3 text-center text-sm text-muted-foreground">Try a different service name.</div>}
      </div>
    </PhoneShell>
  );
}
