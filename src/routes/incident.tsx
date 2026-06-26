import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Car, Flame, Droplets, Building2, AlertCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/incident")({
  head: () => ({ meta: [{ title: "Report Incident — KARE" }] }),
  component: IncidentPage,
});

const types = [
  { l: "Accident", i: Car }, { l: "Fire", i: Flame },
  { l: "Flood", i: Droplets }, { l: "Collapse", i: Building2 }, { l: "Other", i: AlertCircle },
];

function IncidentPage() {
  return (
    <PhoneShell>
      <TopBar title="Report Incident" />
      <div className="px-5 pt-5">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Incident Type</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {types.map((t, i) => {
            const Icon = t.i;
            return (
              <button key={t.l} className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 ${i === 1 ? "border-emergency bg-emergency-soft text-emergency" : "border-border bg-card text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{t.l}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">Location</p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-primary" />
          <input defaultValue="Barnawa, Kaduna" className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">Describe the Incident</p>
        <textarea rows={5} placeholder="Provide more details..." className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none" />

        <button className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Submit Report</button>
      </div>
    </PhoneShell>
  );
}
