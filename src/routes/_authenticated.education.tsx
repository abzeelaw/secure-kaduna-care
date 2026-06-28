import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { BookOpen, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { EDUCATION_ARTICLES } from "@/data/kare-content";

export const Route = createFileRoute("/_authenticated/education")({
  head: () => ({ meta: [{ title: "Health Education — KARE" }] }),
  component: EducationPage,
});

function EducationPage() {
  const tabs = ["All", "Articles", "Videos"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [selectedArticle, setSelectedArticle] = useState(EDUCATION_ARTICLES[0]);

  const articles = useMemo(() => {
    if (activeTab === "Videos") return [];
    return EDUCATION_ARTICLES;
  }, [activeTab]);

  return (
    <PhoneShell>
      <TopBar title="Health Education" />
      <div className="px-5 pt-4">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${activeTab === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        {activeTab === "Videos" ? (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Live video guides</p>
                <p className="text-xs text-muted-foreground">Watch short wellness tutorials from local clinicians.</p>
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Watch latest video</button>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {articles.map((a) => (
                <button key={a.id} onClick={() => setSelectedArticle(a)} className="flex w-full gap-3 rounded-xl border border-border bg-card p-3 text-left">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold uppercase text-primary">{a.category}</span>
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.summary}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary-soft p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Featured article</p>
              <h3 className="mt-2 text-base font-semibold">{selectedArticle.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{selectedArticle.summary}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{selectedArticle.content}</p>
            </div>
          </>
        )}
      </div>
    </PhoneShell>
  );
}
