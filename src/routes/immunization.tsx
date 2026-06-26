import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/immunization")({
  head: () => ({ meta: [{ title: "Child Immunization — KARE" }] }),
  component: ImmunizationPage,
});

const schedule = [
  { v: "BCG", date: "At Birth", done: true },
  { v: "OPV 0", date: "At Birth", done: true },
  { v: "OPV 1", date: "6 Weeks", done: true },
  { v: "PCV (Pneumococcal)", date: "12 July 2025", done: false, next: true },
  { v: "Measles", date: "9 Months", done: false },
];

function ImmunizationPage() {
  return (
    <PhoneShell>
      <TopBar title="Immunization Schedule" />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold">MA</div>
          <div>
            <p className="text-sm font-semibold">Mohammed Ali</p>
            <p className="text-xs text-muted-foreground">2 Years, 3 Months</p>
          </div>
        </div>

        {schedule.find((s) => s.next) && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary-soft p-4">
            <p className="text-xs font-semibold text-primary">Next Vaccine</p>
            <p className="mt-1 text-sm font-semibold">PCV (Pneumococcal)</p>
            <p className="text-xs text-muted-foreground">12 July 2025</p>
          </div>
        )}

        <p className="mt-5 text-xs font-semibold uppercase text-muted-foreground">Vaccine Schedule</p>
        <div className="mt-3 space-y-2.5">
          {schedule.map((s) => (
            <div key={s.v} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${s.done ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                {s.done ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.date}</p>
              </div>
              <span className={`text-[11px] font-semibold ${s.done ? "text-primary" : "text-muted-foreground"}`}>
                {s.done ? "Completed" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
