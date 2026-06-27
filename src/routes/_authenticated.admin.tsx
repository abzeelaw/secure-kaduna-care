import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { TrendingUp, Clock, Hospital, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Kaduna Health Dashboard — KARE" }] }),
  component: AdminPage,
});

const stats = [
  { l: "Total Emergencies", v: "1,245", d: "+12%", i: TrendingUp, t: "text-emergency bg-emergency-soft" },
  { l: "Avg Response Time", v: "8m 45s", d: "-8%", i: Clock, t: "text-primary bg-primary-soft" },
  { l: "Hospital Utilization", v: "72%", d: "+5%", i: Hospital, t: "text-info bg-secondary" },
  { l: "Active Appointments", v: "3,682", d: "+18%", i: CalendarCheck, t: "text-warning bg-accent" },
];

const issues = [
  { n: "Malaria", v: 35, c: "bg-emergency" },
  { n: "Typhoid", v: 22, c: "bg-warning" },
  { n: "Respiratory", v: 18, c: "bg-info" },
  { n: "Hypertension", v: 15, c: "bg-primary" },
  { n: "Others", v: 10, c: "bg-muted-foreground" },
];

function AdminPage() {
  return (
    <PhoneShell>
      <TopBar title="Kaduna Health Dashboard" />
      <div className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => {
            const Icon = s.i;
            return (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.t}`}><Icon className="h-4 w-4" /></span>
                  <span className="text-[11px] font-semibold text-primary">{s.d}</span>
                </div>
                <p className="mt-3 text-xl font-bold">{s.v}</p>
                <p className="text-[11px] text-muted-foreground">{s.l}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">Top Health Issues</p>
          <div className="mt-3 space-y-2">
            {issues.map((i) => (
              <div key={i.n}>
                <div className="flex justify-between text-xs">
                  <span>{i.n}</span><span className="font-semibold">{i.v}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-surface">
                  <div className={`h-full rounded-full ${i.c}`} style={{ width: `${i.v * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">Emergency Hotspots</p>
          <div className="relative mt-3 h-40 rounded-xl bg-gradient-to-br from-primary-soft to-secondary overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.06) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <span className="absolute left-12 top-10 h-6 w-6 rounded-full bg-emergency/60 animate-pulse" />
            <span className="absolute left-32 top-20 h-8 w-8 rounded-full bg-emergency/70 animate-pulse" />
            <span className="absolute right-10 bottom-8 h-5 w-5 rounded-full bg-warning/70 animate-pulse" />
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
