import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Search, Building2, Star, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals — KARE" }] }),
  component: Hospitals,
});

const tabs = ["Nearby", "Private", "Government", "Specialist"] as const;
const hospitals = [
  { name: "Barau Dikko Teaching Hospital", dist: "2.3 km", rating: 4.8, type: "Government" },
  { name: "St. Gerald Catholic Hospital", dist: "3.7 km", rating: 4.6, type: "Private" },
  { name: "Kaduna State Specialist Hospital", dist: "5.1 km", rating: 4.7, type: "Specialist" },
  { name: "Living Faith Hospital", dist: "6.2 km", rating: 4.5, type: "Private" },
  { name: "44 Nigerian Army Reference Hospital", dist: "7.8 km", rating: 4.4, type: "Government" },
];

function Hospitals() {
  const [tab, setTab] = useState<typeof tabs[number]>("Nearby");
  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Hospitals</h1>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search hospital…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pt-4">
        {hospitals.map((h) => (
          <Link key={h.name} to="/doctors/$id" params={{ id: "1" } as never} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{h.name}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.dist}</span>
                <span>•</span><span>{h.type}</span>
              </p>
              <p className="mt-1 text-[11px] text-success font-medium">Open • Accepting patients</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-[11px] font-semibold">
              <Star className="h-3 w-3 fill-warning text-warning" /> {h.rating}
            </span>
          </Link>
        ))}
      </div>
    </PhoneShell>
  );
}
