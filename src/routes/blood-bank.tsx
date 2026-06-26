import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";

export const Route = createFileRoute("/blood-bank")({
  head: () => ({ meta: [{ title: "Community Blood Bank — KARE" }] }),
  component: BloodBankPage,
});

const inv = [
  { g: "A+", u: 25 }, { g: "A-", u: 8 },
  { g: "B+", u: 18 }, { g: "B-", u: 4 },
  { g: "O+", u: 32 }, { g: "O-", u: 6 },
  { g: "AB+", u: 7 }, { g: "AB-", u: 3 },
];

function BloodBankPage() {
  return (
    <PhoneShell>
      <TopBar title="Blood Bank" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-xs text-muted-foreground">Barau Dikko Hospital</p>
          <p className="text-sm font-semibold">Blood Bank Inventory</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {inv.map((b) => (
            <div key={b.g} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emergency-soft text-emergency font-bold text-sm">{b.g}</span>
                <span className={`text-xs font-semibold ${b.u < 10 ? "text-emergency" : "text-primary"}`}>{b.u < 10 ? "Low" : "Stocked"}</span>
              </div>
              <p className="mt-3 text-xl font-bold">{b.u}</p>
              <p className="text-xs text-muted-foreground">Units available</p>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Request for Hospital</button>
      </div>
    </PhoneShell>
  );
}
