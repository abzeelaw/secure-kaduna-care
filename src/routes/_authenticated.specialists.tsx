import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/kare/PhoneShell";
import { ChevronLeft, Search, Heart, Brain, Baby, Bone, Ear, User, Stethoscope, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/specialists")({
  head: () => ({ meta: [{ title: "Specialists — KARE" }] }),
  component: Specialists,
});

const cats = [
  { label: "Cardiologist", icon: Heart },
  { label: "Pediatrician", icon: Baby },
  { label: "Gynecologist", icon: User },
  { label: "Neurologist", icon: Brain },
  { label: "Dermatologist", icon: Stethoscope },
  { label: "Orthopedic", icon: Bone },
  { label: "ENT", icon: Ear },
  { label: "Psychiatrist", icon: Brain },
];

const docs = [
  { id: "1", name: "Dr. Musa Ibrahim", spec: "Cardiologist", exp: "15 yrs exp", rating: 4.9 },
  { id: "2", name: "Dr. Aisha Yusuf", spec: "Pediatrician", exp: "10 yrs exp", rating: 4.8 },
  { id: "3", name: "Dr. Fatima Bello", spec: "Gynecologist", exp: "12 yrs exp", rating: 4.9 },
];

function Specialists() {
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
          <input placeholder="Search by specialty or condition…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">Categories</h2>
      <div className="grid grid-cols-4 gap-2 px-5">
        {cats.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium text-center leading-tight">{c.label}</span>
            </div>
          );
        })}
      </div>

      <h2 className="px-5 pt-6 pb-3 text-sm font-semibold">Top Specialists</h2>
      <div className="space-y-3 px-5">
        {docs.map((d) => (
          <Link key={d.id} to="/doctors/$id" params={{ id: d.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-semibold">
              {d.name.split(" ")[1][0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.spec} • {d.exp}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
                <Star className="h-3 w-3 fill-warning text-warning" /> {d.rating}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PhoneShell>
  );
}
