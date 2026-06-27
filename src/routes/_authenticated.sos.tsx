import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { Siren, Ambulance, Flame, Shield, Car, Baby, MapPin, ChevronLeft, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/sos")({
  head: () => ({ meta: [{ title: "SOS Emergency — KARE" }] }),
  component: SOS,
});

const categories = [
  { label: "Medical Emergency", icon: Siren, color: "text-emergency bg-emergency-soft" },
  { label: "Ambulance", icon: Ambulance, color: "text-emergency bg-emergency-soft" },
  { label: "Fire Service", icon: Flame, color: "text-warning bg-warning/15" },
  { label: "Police", icon: Shield, color: "text-info bg-secondary" },
  { label: "Road Accident", icon: Car, color: "text-foreground bg-muted" },
  { label: "Maternal Emergency", icon: Baby, color: "text-primary bg-primary-soft" },
];

function SOS() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Medical Emergency");
  const [sent, setSent] = useState(false);

  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">SOS Emergency</h1>
      </div>

      <div className="flex flex-col items-center px-5 pt-6">
        <button
          onClick={() => setSent(true)}
          className="relative flex h-44 w-44 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-2xl shadow-emergency/40 animate-pulse-ring"
        >
          <div className="text-center">
            <p className="text-3xl font-extrabold">SOS</p>
            <p className="mt-1 text-[11px] font-medium tracking-wide">TAP TO ALERT</p>
          </div>
        </button>
        <p className="mt-5 max-w-xs text-center text-xs text-muted-foreground">
          Press and hold for 3 seconds to send your emergency alert with live location.
        </p>
      </div>

      <h2 className="px-5 pt-8 pb-3 text-sm font-semibold">I need help for</h2>
      <div className="px-5 space-y-2">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = c.label === selected;
          return (
            <button
              key={c.label}
              onClick={() => setSelected(c.label)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${active ? "border-primary bg-primary-soft" : "border-border bg-background"}`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-medium">{c.label}</span>
              <span className={`h-4 w-4 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`} />
            </button>
          );
        })}
      </div>

      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-muted-foreground">Your location</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-emergency" /> Barnawa, Kaduna
          </p>
        </div>
      </div>

      <div className="px-5 pt-5">
        <button
          onClick={() => { setSent(true); setTimeout(() => navigate({ to: "/ambulance" }), 800); }}
          className="w-full rounded-2xl bg-emergency py-4 text-sm font-bold text-emergency-foreground shadow-xl shadow-emergency/30"
        >
          {sent ? "Sending alert…" : "Send Emergency Alert"}
        </button>
        <a href="tel:112" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold">
          <Phone className="h-4 w-4" /> Call 112 directly
        </a>
      </div>
    </PhoneShell>
  );
}
