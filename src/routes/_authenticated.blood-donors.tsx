import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/blood-donors")({
  head: () => ({ meta: [{ title: "Blood Donors — KARE" }] }),
  component: DonorsPage,
});

const donors = [
  { n: "Ahmed Musa", g: "A+", d: "1.4km away", a: true },
  { n: "Fatima Bello", g: "A+", d: "2.1km away", a: true },
  { n: "Ibrahim Yakubu", g: "A+", d: "3.5km away", a: false },
];

function DonorsPage() {
  return (
    <PhoneShell>
      <TopBar title="Find Blood Donors" />
      <div className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] text-muted-foreground">Blood Group</p>
            <p className="text-sm font-semibold">A+</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] text-muted-foreground">Location</p>
            <p className="text-sm font-semibold">Barnawa, Kaduna</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {donors.map((d) => (
            <div key={d.n} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-emergency-soft text-emergency flex items-center justify-center font-bold">{d.g}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{d.n}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{d.d}</p>
                </div>
                <button disabled={!d.a} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">
                  <Phone className="h-3 w-3" /> Call
                </button>
              </div>
              <p className={`mt-2 text-[11px] font-semibold ${d.a ? "text-primary" : "text-muted-foreground"}`}>
                {d.a ? "Available" : "Not Available"}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-xl bg-emergency py-3.5 text-sm font-semibold text-emergency-foreground">Request Blood</button>
      </div>
    </PhoneShell>
  );
}
