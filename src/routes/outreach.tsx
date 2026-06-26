import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Stethoscope, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/outreach")({
  head: () => ({ meta: [{ title: "Medical Outreach — KARE" }] }),
  component: OutreachPage,
});

const events = [
  { t: "Free Medical Checkup", loc: "Sabon Tasha Community", d: "14 June 2025", time: "9:00 AM" },
  { t: "Maternal Health Drive", loc: "Kawo Community Hall", d: "21 June 2025", time: "10:00 AM" },
];

function OutreachPage() {
  return (
    <PhoneShell>
      <TopBar title="Medical Outreach" />
      <div className="px-5 pt-5">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Upcoming Outreach</p>
        <div className="mt-3 space-y-3">
          {events.map((e) => (
            <div key={e.t} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary"><Stethoscope className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{e.t}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{e.loc}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{e.d} · {e.time}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-surface p-3 text-xs">
                <p className="font-semibold">Services</p>
                <p className="text-muted-foreground">General Checkup · Blood Pressure Test · Blood Sugar Test · Free Drugs</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">View All Outreach</button>
      </div>
    </PhoneShell>
  );
}
