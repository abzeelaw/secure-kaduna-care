import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { FileText, Pill, FlaskConical, Syringe, AlertCircle, HeartPulse, Download, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/records")({
  head: () => ({ meta: [{ title: "Medical Records — KARE" }] }),
  component: RecordsPage,
});

const items = [
  { icon: AlertCircle, label: "Allergies", count: "2 Records", tint: "bg-emergency-soft text-emergency" },
  { icon: Pill, label: "Medications", count: "3 Records", tint: "bg-primary-soft text-primary" },
  { icon: FileText, label: "Past Diagnoses", count: "5 Records", tint: "bg-secondary text-info" },
  { icon: FlaskConical, label: "Lab Results", count: "8 Records", tint: "bg-accent text-accent-foreground" },
  { icon: Syringe, label: "Immunizations", count: "6 Records", tint: "bg-primary-soft text-primary" },
  { icon: HeartPulse, label: "Surgeries", count: "1 Record", tint: "bg-emergency-soft text-emergency" },
  { icon: FileText, label: "Documents", count: "2 Files", tint: "bg-secondary text-info" },
];

function RecordsPage() {
  return (
    <PhoneShell>
      <TopBar title="Medical Records & Wallet" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.55_0.12_184)] p-5 text-primary-foreground shadow-lg">
          <p className="text-xs opacity-80">Emergency Access Card</p>
          <p className="mt-1 text-lg font-semibold">Habeeb Muhammad</p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <div><p className="opacity-70">Blood Group</p><p className="text-base font-bold">O+</p></div>
            <div><p className="opacity-70">Genotype</p><p className="text-base font-bold">AA</p></div>
            <div><p className="opacity-70">ID</p><p className="text-base font-bold">KARE-2487</p></div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Link key={it.label} to="/records" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${it.tint}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{it.label}</p>
                  <p className="text-xs text-muted-foreground">{it.count}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-3 text-sm font-semibold text-primary">
          <Download className="h-4 w-4" /> Download All Records
        </button>
      </div>
    </PhoneShell>
  );
}
