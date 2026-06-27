import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Baby, Calendar, Check, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/maternal")({
  head: () => ({ meta: [{ title: "Maternal Health — KARE" }] }),
  component: MaternalPage,
});

function MaternalPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [lmp, setLmp] = useState("");

  const { data: pregnancy } = useQuery({
    queryKey: ["pregnancy", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("pregnancies").select("*").eq("active", true).maybeSingle()).data,
  });

  const { data: visits = [] } = useQuery({
    queryKey: ["anc", pregnancy?.id],
    enabled: !!pregnancy,
    queryFn: async () => (await supabase.from("anc_visits").select("*").eq("pregnancy_id", pregnancy!.id).order("visit_date")).data ?? [],
  });

  const startPregnancy = useMutation({
    mutationFn: async () => {
      if (!user || !lmp) throw new Error("Pick last period date");
      const due = new Date(lmp); due.setDate(due.getDate() + 280);
      const { data: preg, error } = await supabase.from("pregnancies").insert({
        user_id: user.id, last_period_date: lmp, due_date: due.toISOString().slice(0, 10),
      }).select().single();
      if (error) throw error;
      const visits = [4, 12, 20, 28, 32, 36].map((w) => {
        const d = new Date(lmp); d.setDate(d.getDate() + w * 7);
        return { user_id: user.id, pregnancy_id: preg.id, visit_date: d.toISOString().slice(0, 10) };
      });
      await supabase.from("anc_visits").insert(visits);
    },
    onSuccess: () => { toast.success("Pregnancy tracker started"); qc.invalidateQueries({ queryKey: ["pregnancy"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const toggle = useMutation({
    mutationFn: async (v: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("anc_visits").update({ completed: v.completed }).eq("id", v.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anc"] }),
  });

  if (!pregnancy) {
    return (
      <PhoneShell>
        <TopBar title="Maternal Health" />
        <div className="px-5 pt-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-info p-6 text-primary-foreground">
            <Baby className="h-10 w-10" />
            <h2 className="mt-3 text-xl font-bold">Start your pregnancy journey</h2>
            <p className="mt-1 text-xs opacity-80">We'll schedule your ANC visits automatically.</p>
          </div>
          <label className="mt-5 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">First day of last period
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-3 text-sm" />
          </label>
          <button onClick={() => startPregnancy.mutate()} disabled={startPregnancy.isPending} className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <Plus className="mr-2 inline h-4 w-4" /> Start tracking
          </button>
        </div>
      </PhoneShell>
    );
  }

  const lmpDate = new Date(pregnancy.last_period_date);
  const weeks = Math.floor((Date.now() - lmpDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

  return (
    <PhoneShell>
      <TopBar title="Maternal Health" />
      <div className="px-5 pt-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-info p-6 text-primary-foreground">
          <p className="text-xs opacity-80">You are</p>
          <p className="text-3xl font-extrabold">{weeks} weeks</p>
          <p className="mt-1 text-xs opacity-80">Due {new Date(pregnancy.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
          <div className="mt-4 h-2 w-full rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, (weeks / 40) * 100)}%` }} />
          </div>
        </div>

        <h3 className="mt-6 text-sm font-semibold">ANC Schedule</h3>
        <div className="mt-2 space-y-2">
          {visits.map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{new Date(v.visit_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                <p className="text-xs text-muted-foreground">{v.completed ? "Visit completed" : "Upcoming visit"}</p>
              </div>
              <button onClick={() => toggle.mutate({ id: v.id, completed: !v.completed })} className={`flex h-8 w-8 items-center justify-center rounded-full ${v.completed ? "bg-success text-success-foreground" : "border border-border"}`}>
                <Check className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
