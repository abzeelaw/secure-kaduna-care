import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/education")({
  head: () => ({ meta: [{ title: "Health Education — KARE" }] }),
  component: EducationPage,
});

const articles = [
  { t: "Preventing Malaria", d: "Tips to protect your family", c: "Malaria" },
  { t: "Managing Hypertension", d: "Keep your heart healthy", c: "Hypertension" },
  { t: "Child Nutrition", d: "Healthy food for children", c: "Child Health" },
  { t: "Diabetes Awareness", d: "Signs, symptoms and care", c: "Diabetes" },
];

function EducationPage() {
  const tabs = ["All", "Articles", "Videos"];
  return (
    <PhoneShell>
      <TopBar title="Health Education" />
      <div className="px-5 pt-4">
        <div className="flex gap-2">
          {tabs.map((t, i) => (
            <button key={t} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {articles.map((a) => (
            <div key={a.t} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-semibold uppercase text-primary">{a.c}</span>
                <p className="text-sm font-semibold">{a.t}</p>
                <p className="text-xs text-muted-foreground">{a.d}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-xl border border-primary py-3 text-sm font-semibold text-primary">View All Articles</button>
      </div>
    </PhoneShell>
  );
}
