import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Search, Building2, Star, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_HOSPITALS } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals — KARE" }] }),
  component: Hospitals,
});

const tabs = ["All", "Government", "Private", "Teaching", "Maternity"] as const;

function Hospitals() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [q, setQ] = useState("");
  const { data = DEFAULT_HOSPITALS, isLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("hospitals").select("*").order("rating", { ascending: false });
        if (error) throw error;
        return (data?.length ? data : DEFAULT_HOSPITALS) as typeof DEFAULT_HOSPITALS;
      } catch {
        return DEFAULT_HOSPITALS;
      }
    },
  });

  const list = useMemo(() => {
    return data.filter((h) => {
      const matchTab = tab === "All" || (h.type && h.type.toLowerCase().includes(tab.toLowerCase()));
      const matchQ = !q || h.name.toLowerCase().includes(q.toLowerCase());
      return matchTab && matchQ;
    });
  }, [data, tab, q]);

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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hospital…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pt-4">
        {isLoading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && list.length === 0 && <p className="text-center text-sm text-muted-foreground">No hospitals found.</p>}
        {list.map((h) => (
          <div key={h.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{h.name}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.lga ?? "Kaduna"}</span>
                <span>•</span><span>{h.type}</span>
              </p>
              {h.has_emergency && <p className="mt-1 text-[11px] text-success font-medium">Open 24/7 • Emergency</p>}
            </div>
            <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-[11px] font-semibold">
              <Star className="h-3 w-3 fill-warning text-warning" /> {Number(h.rating).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </PhoneShell>
  );
}
