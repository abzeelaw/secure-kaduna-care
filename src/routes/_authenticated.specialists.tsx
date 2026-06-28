import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Search, Heart, Brain, Baby, Bone, Stethoscope, User, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_DOCTORS } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/specialists")({
  head: () => ({ meta: [{ title: "Specialists — KARE" }] }),
  component: Specialists,
});

const cats = [
  { label: "Cardiology", icon: Heart },
  { label: "Pediatrics", icon: Baby },
  { label: "Obstetrics", icon: User },
  { label: "Psychiatry", icon: Brain },
  { label: "Dermatology", icon: Stethoscope },
  { label: "Orthopedics", icon: Bone },
  { label: "Internal", icon: Stethoscope },
  { label: "General", icon: User },
];

function Specialists() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const { data = DEFAULT_DOCTORS, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("doctors").select("*, hospital:hospitals(name)").order("rating", { ascending: false });
        if (error) throw error;
        return (data?.length ? data : DEFAULT_DOCTORS) as typeof DEFAULT_DOCTORS;
      } catch {
        return DEFAULT_DOCTORS;
      }
    },
  });

  const list = useMemo(
    () => data.filter((d) =>
      (!q || d.full_name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase())) &&
      (!cat || d.specialty.toLowerCase().includes(cat.toLowerCase()))
    ),
    [data, q, cat],
  );

  return (
    <PhoneShell>
      <div className="flex items-center gap-3 px-5 pt-4">
        <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Find a Specialist</h1>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by specialty or doctor…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">Categories</h2>
      <div className="grid grid-cols-4 gap-2 px-5">
        {cats.map((c) => {
          const Icon = c.icon;
          const active = cat === c.label;
          return (
            <button key={c.label} onClick={() => setCat(active ? null : c.label)} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 ${active ? "border-primary bg-primary-soft" : "border-border bg-background"}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-center leading-tight">{c.label}</span>
            </button>
          );
        })}
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">{cat ?? "All Specialists"}</h2>
      <div className="space-y-3 px-5">
        {isLoading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && list.length === 0 && <p className="text-center text-sm text-muted-foreground">No doctors match.</p>}
        {list.map((d) => (
          <Link key={d.id} to="/doctors/$id" params={{ id: d.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-semibold">
              {d.full_name.replace("Dr. ", "").split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{d.full_name}</p>
              <p className="text-xs text-muted-foreground">{d.specialty} • {d.years_experience} yrs exp</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
                <Star className="h-3 w-3 fill-warning text-warning" /> {Number(d.rating).toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PhoneShell>
  );
}
