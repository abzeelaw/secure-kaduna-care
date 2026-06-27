import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Baby, Apple, AlertTriangle, Calendar, Siren } from "lucide-react";

export const Route = createFileRoute("/_authenticated/maternal")({
  head: () => ({ meta: [{ title: "Maternal Health — KARE" }] }),
  component: MaternalPage,
});

function MaternalPage() {
  return (
    <PhoneShell>
      <TopBar title="Pregnancy Tracker" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-emergency-soft to-primary-soft p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emergency text-emergency-foreground"><Baby className="h-6 w-6" /></span>
            <div>
              <p className="text-sm font-semibold">You are 24 weeks pregnant</p>
              <p className="text-xs text-muted-foreground">2nd Trimester · 16 weeks to go</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-background">
            <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { icon: Calendar, label: "ANC Appointments", desc: "Next: 12 July 2025", tint: "text-primary bg-primary-soft" },
            { icon: Apple, label: "Nutrition Guide", desc: "Trimester-based diet plan", tint: "text-info bg-secondary" },
            { icon: AlertTriangle, label: "Danger Signs", desc: "Warning signs to watch for", tint: "text-warning bg-accent" },
            { icon: Siren, label: "Emergency SOS", desc: "Maternal emergency response", tint: "text-emergency bg-emergency-soft" },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${r.tint}`}><Icon className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary-soft p-4">
          <p className="text-xs font-semibold text-primary">Next ANC Appointment</p>
          <p className="mt-1 text-sm font-semibold">12 July 2025 · 10:00 AM</p>
          <p className="text-xs text-muted-foreground">Barau Dikko Teaching Hospital</p>
        </div>
      </div>
    </PhoneShell>
  );
}
