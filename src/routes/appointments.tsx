import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — KARE" }] }),
  component: Appts,
});

const data = {
  Upcoming: [
    { doc: "Dr. Musa Ibrahim", spec: "Cardiologist", date: "28 Jun 2025", time: "10:00 AM", hospital: "Barau Dikko Teaching Hospital" },
    { doc: "Dr. Aisha Yusuf", spec: "Pediatrician", date: "02 Jul 2025", time: "10:00 AM", hospital: "St. Gerald Catholic Hospital" },
  ],
  Completed: [
    { doc: "Dr. Fatima Bello", spec: "Gynecologist", date: "10 Jun 2025", time: "09:30 AM", hospital: "Kaduna State Specialist" },
  ],
  Cancelled: [],
} as const;

function Appts() {
  const [tab, setTab] = useState<keyof typeof data>("Upcoming");
  return (
    <PhoneShell>
      <div className="flex items-center justify-between px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">My Appointments</h1>
        <Link to="/appointments/book" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 rounded-full bg-muted p-1">
        {(Object.keys(data) as Array<keyof typeof data>).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2 text-xs font-semibold ${tab === t ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pt-5">
        {data[tab].length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-background py-10 text-center text-sm text-muted-foreground">No appointments here.</p>
        )}
        {data[tab].map((a, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {a.doc.split(" ")[1][0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{a.doc}</p>
                <p className="text-xs text-muted-foreground">{a.spec}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tab === "Upcoming" ? "bg-primary-soft text-primary" : tab === "Completed" ? "bg-success/15 text-success" : "bg-emergency-soft text-emergency"}`}>
                {tab}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{a.hospital}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-semibold">{a.date} • {a.time}</p>
            </div>
            {tab === "Upcoming" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-border py-2 text-xs font-semibold">Reschedule</button>
                <button className="rounded-xl bg-emergency-soft py-2 text-xs font-semibold text-emergency">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </PhoneShell>
  );
}
