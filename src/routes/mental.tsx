import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { MessageCircle, ClipboardCheck, Siren, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/mental")({
  head: () => ({ meta: [{ title: "Mental Health Support — KARE" }] }),
  component: MentalPage,
});

const moods = [
  { l: "Good", e: "😊", c: "bg-success/20" },
  { l: "Okay", e: "🙂", c: "bg-warning/20" },
  { l: "Not Good", e: "😟", c: "bg-info/20" },
  { l: "Bad", e: "😢", c: "bg-emergency-soft" },
];

function MentalPage() {
  return (
    <PhoneShell>
      <TopBar title="Mental Health Support" />
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold">How are you feeling today?</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {moods.map((m) => (
            <button key={m.l} className={`flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 ${m.c}`}>
              <span className="text-2xl">{m.e}</span>
              <span className="text-[11px] font-semibold">{m.l}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {[
            { i: MessageCircle, t: "Talk to a Counselor", d: "Chat or call with a professional", tint: "bg-primary-soft text-primary" },
            { i: ClipboardCheck, t: "Self Assessment", d: "Check your mental well-being", tint: "bg-secondary text-info" },
            { i: Siren, t: "Crisis Support", d: "Get immediate help", tint: "bg-emergency-soft text-emergency" },
          ].map((r) => {
            const Icon = r.i;
            return (
              <button key={r.t} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${r.tint}`}><Icon className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.t}</p>
                  <p className="text-xs text-muted-foreground">{r.d}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <button className="mt-5 w-full rounded-xl bg-emergency py-3.5 text-sm font-semibold text-emergency-foreground">Emergency Help</button>
      </div>
    </PhoneShell>
  );
}
