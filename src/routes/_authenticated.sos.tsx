import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { Siren, Ambulance, Flame, Shield, Car, Baby, MapPin, ChevronLeft, Phone } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/sos")({
  head: () => ({ meta: [{ title: "SOS Emergency — KARE" }] }),
  component: SOS,
});

const categories = [
  { key: "medical", label: "Medical Emergency", icon: Siren, color: "text-emergency bg-emergency-soft" },
  { key: "medical", label: "Ambulance", icon: Ambulance, color: "text-emergency bg-emergency-soft" },
  { key: "fire", label: "Fire Service", icon: Flame, color: "text-warning bg-warning/15" },
  { key: "security", label: "Police", icon: Shield, color: "text-info bg-secondary" },
  { key: "accident", label: "Road Accident", icon: Car, color: "text-foreground bg-muted" },
  { key: "maternal", label: "Maternal Emergency", icon: Baby, color: "text-primary bg-primary-soft" },
] as const;

function SOS() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<typeof categories[number]>(categories[0]);
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState("Barnawa, Kaduna");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });

  const { data: records = [] } = useQuery({
    queryKey: ["records", user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data } = await supabase.from("medical_records").select("*").eq("user_id", user?.id).order("record_date", { ascending: false });
        return data ?? [];
      } catch {
        return [];
      }
    },
  });

  async function send() {
    if (!user) return;
    setBusy(true);
    try {
      let lat: number | null = null, lng: number | null = null;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 })
        );
        lat = pos.coords.latitude; lng = pos.coords.longitude;
      } catch { /* ignore */ }

      const patientSnapshot = JSON.stringify({ profile, records });
      const { error } = await supabase.from("sos_incidents").insert({
        user_id: user.id,
        category: selected.key,
        lat,
        lng,
        address,
        notes: `${selected.label} alert`,
        patient_snapshot: patientSnapshot,
      });
      if (error) throw error;
      toast.success("Emergency alert sent — responders notified");
      setTimeout(() => navigate({ to: "/ambulance" }), 700);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send alert");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">SOS Emergency</h1>
      </div>

      <div className="flex flex-col items-center px-5 pt-6">
        <button onClick={send} disabled={busy} className="relative flex h-44 w-44 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-2xl shadow-emergency/40 animate-pulse-ring disabled:opacity-70">
          <div className="text-center">
            <p className="text-3xl font-extrabold">SOS</p>
            <p className="mt-1 text-[11px] font-medium tracking-wide">{busy ? "SENDING…" : "TAP TO ALERT"}</p>
          </div>
        </button>
        <p className="mt-5 max-w-xs text-center text-xs text-muted-foreground">
          Tap to send your emergency alert with live location to dispatchers.
        </p>
      </div>

      <h2 className="px-5 pt-8 pb-3 text-sm font-semibold">I need help for</h2>
      <div className="px-5 space-y-2">
        {categories.map((c) => {
          const Icon = c.icon;
          const active = c.label === selected.label;
          return (
            <button key={c.label} onClick={() => setSelected(c)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${active ? "border-primary bg-primary-soft" : "border-border bg-background"}`}>
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
          <p className="text-xs text-muted-foreground">Your location (editable)</p>
          <div className="mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emergency" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="flex-1 bg-transparent text-sm font-semibold outline-none" />
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <button onClick={send} disabled={busy} className="w-full rounded-2xl bg-emergency py-4 text-sm font-bold text-emergency-foreground shadow-xl shadow-emergency/30 disabled:opacity-70">
          {busy ? "Sending alert…" : "Send Emergency Alert"}
        </button>
        <a href="tel:112" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold">
          <Phone className="h-4 w-4" /> Call 112 directly
        </a>
      </div>
    </PhoneShell>
  );
}
