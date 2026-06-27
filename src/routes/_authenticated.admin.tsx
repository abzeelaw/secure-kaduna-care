import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Siren, Building2, Stethoscope, Users, MapPin, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Gov Dashboard — KARE" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [sos, hosp, doc, appt] = await Promise.all([
        supabase.from("sos_incidents").select("id,status,category,created_at,address"),
        supabase.from("hospitals").select("id"),
        supabase.from("doctors").select("id"),
        supabase.from("appointments").select("id,status"),
      ]);
      return { sos: sos.data ?? [], hosp: hosp.data ?? [], doc: doc.data ?? [], appt: appt.data ?? [] };
    },
    refetchInterval: 10_000,
  });

  const totalSOS = stats?.sos.length ?? 0;
  const pending = stats?.sos.filter((s) => s.status === "pending").length ?? 0;
  const resolved = stats?.sos.filter((s) => s.status === "resolved").length ?? 0;
  const recent = stats?.sos.slice().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 6) ?? [];

  const byCat: Record<string, number> = {};
  stats?.sos.forEach((s) => { byCat[s.category] = (byCat[s.category] ?? 0) + 1; });

  return (
    <PhoneShell>
      <TopBar title="Government Dashboard" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-info to-primary p-5 text-primary-foreground">
          <p className="text-xs opacity-80">Kaduna State • Live</p>
          <p className="mt-1 text-3xl font-extrabold">{totalSOS}</p>
          <p className="text-xs opacity-80">Total SOS incidents</p>
          <div className="mt-4 flex gap-4 text-xs">
            <div><p className="opacity-70">Pending</p><p className="text-base font-bold">{pending}</p></div>
            <div><p className="opacity-70">Resolved</p><p className="text-base font-bold">{resolved}</p></div>
            <div><p className="opacity-70">Avg ETA</p><p className="text-base font-bold">8m</p></div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={Building2} label="Hospitals" value={stats?.hosp.length ?? 0} />
          <Stat icon={Stethoscope} label="Doctors" value={stats?.doc.length ?? 0} />
          <Stat icon={Users} label="Appointments" value={stats?.appt.length ?? 0} />
          <Stat icon={TrendingUp} label="Active alerts" value={pending} />
        </div>

        <h3 className="mt-5 text-sm font-semibold">Incidents by category</h3>
        <div className="mt-2 space-y-2">
          {Object.entries(byCat).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-20 text-xs capitalize">{k}</span>
              <div className="flex-1 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (v / Math.max(1, totalSOS)) * 100)}%` }} />
              </div>
              <span className="text-xs font-semibold">{v}</span>
            </div>
          ))}
          {Object.keys(byCat).length === 0 && <p className="text-xs text-muted-foreground">No data yet.</p>}
        </div>

        <h3 className="mt-5 text-sm font-semibold">Recent SOS</h3>
        <div className="mt-2 space-y-2">
          {recent.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency-soft text-emergency"><Siren className="h-4 w-4" /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold capitalize">{s.category}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {s.address ?? "Unknown"}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${s.status === "pending" ? "bg-warning/20 text-foreground" : s.status === "resolved" ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}`}>{s.status}</span>
            </div>
          ))}
          {recent.length === 0 && <p className="text-xs text-muted-foreground">No incidents yet.</p>}
        </div>
      </div>
    </PhoneShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
