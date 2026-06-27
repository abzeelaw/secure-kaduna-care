import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";

export const Route = createFileRoute("/_authenticated/queue")({
  head: () => ({ meta: [{ title: "Hospital Queue — KARE" }] }),
  component: QueuePage,
});

function QueuePage() {
  return (
    <PhoneShell>
      <TopBar title="Queue at Hospital" />
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">Barau Dikko Teaching Hospital</p>
          <p className="text-xs text-muted-foreground">General Outpatient Department</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Your Queue Number</p>
            <p className="mt-2 text-3xl font-bold text-primary">A 132</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground">People Ahead</p>
            <p className="mt-2 text-3xl font-bold">18</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-primary-soft p-5 text-center">
          <p className="text-xs text-muted-foreground">Estimated Waiting Time</p>
          <p className="mt-2 text-2xl font-bold text-primary">1h 20m</p>
        </div>

        <button className="mt-5 w-full rounded-xl bg-emergency py-3.5 text-sm font-semibold text-emergency-foreground">Leave Queue</button>
        <p className="mt-3 text-center text-xs text-muted-foreground">You will be notified when it's almost your turn.</p>
      </div>
    </PhoneShell>
  );
}
