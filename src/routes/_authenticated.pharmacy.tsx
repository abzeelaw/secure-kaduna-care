import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Search, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { DEFAULT_PHARMACIES } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/pharmacy")({
  head: () => ({ meta: [{ title: "Pharmacy Finder — KARE" }] }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const [search, setSearch] = useState("Paracetamol 500mg");

  const pharmacies = useMemo(() => {
    const term = search.toLowerCase();
    return DEFAULT_PHARMACIES.filter((item) =>
      !term || item.name.toLowerCase().includes(term) || item.area.toLowerCase().includes(term) || item.distance.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <PhoneShell>
      <TopBar title="Drug & Pharmacy Finder" />
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medication..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <p className="mt-4 text-sm font-semibold">Paracetamol 500mg</p>
        <p className="text-xs text-muted-foreground">Available in 3 pharmacies near you</p>

        <div className="mt-4 space-y-3">
          {pharmacies.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.distance} • {p.area}</p>
                </div>
                <p className="text-base font-bold text-primary">{p.price}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.stock ? "bg-primary-soft text-primary" : "bg-emergency-soft text-emergency"}`}>
                  {p.stock ? "In Stock" : "Out of Stock"}
                </span>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-border p-2"><Phone className="h-4 w-4 text-primary" /></button>
                  <button disabled={!p.stock} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">Reserve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
