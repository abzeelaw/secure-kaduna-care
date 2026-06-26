import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { ShieldCheck, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/insurance")({
  head: () => ({ meta: [{ title: "Health Insurance — KARE" }] }),
  component: InsurancePage,
});

function InsurancePage() {
  return (
    <PhoneShell>
      <TopBar title="My Insurance" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-info to-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-xs opacity-80">NHIA</p>
          </div>
          <p className="mt-3 text-xs opacity-80">Membership No.</p>
          <p className="text-lg font-bold">NHIA-KD-25698</p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <div><p className="opacity-70">Coverage</p><p className="font-semibold">Active</p></div>
            <div><p className="opacity-70">Valid Until</p><p className="font-semibold">31 Dec 2025</p></div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {["Covered Services", "Partner Hospitals", "Claims History"].map((s) => (
            <button key={s} className="flex w-full items-center rounded-xl border border-border bg-card p-4">
              <span className="flex-1 text-left text-sm font-semibold">{s}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">View Insurance Card</button>
      </div>
    </PhoneShell>
  );
}
