import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/symptom-checker")({
  head: () => ({ meta: [{ title: "AI Symptom Checker — KARE" }] }),
  component: SymptomPage,
});

function SymptomPage() {
  const [analyzed, setAnalyzed] = useState(false);
  return (
    <PhoneShell>
      <TopBar title="AI Symptom Checker" />
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold">Describe your symptoms</p>
        <textarea
          rows={5}
          defaultValue="I have fever, headache and body pain since yesterday."
          className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />

        <button onClick={() => setAnalyzed(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          <Sparkles className="h-4 w-4" /> Analyze Symptoms
        </button>

        {analyzed && (
          <>
            <p className="mt-5 text-sm font-semibold">Possible Causes</p>
            <div className="mt-2 space-y-2">
              {[
                { n: "Malaria", s: "High likelihood", t: "text-emergency bg-emergency-soft" },
                { n: "Typhoid Fever", s: "Moderate", t: "text-warning bg-accent" },
                { n: "Viral Fever", s: "Low", t: "text-primary bg-primary-soft" },
              ].map((c) => (
                <div key={c.n} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-semibold">{c.n}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.t}`}>{c.s}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-primary/30 bg-primary-soft p-4">
              <p className="text-xs font-semibold text-primary">Recommendation</p>
              <p className="mt-1 text-xs">Please consult a doctor for proper diagnosis and treatment. This tool does not provide medical diagnosis.</p>
            </div>

            <button className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Find Doctors</button>
          </>
        )}
      </div>
    </PhoneShell>
  );
}
