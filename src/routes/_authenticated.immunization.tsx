import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { Syringe, Plus, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/immunization")({
  head: () => ({ meta: [{ title: "Child Immunization — KARE" }] }),
  component: ImmunizationPage,
});

const SCHEDULE: { name: string; weeks: number }[] = [
  { name: "BCG", weeks: 0 }, { name: "OPV-0", weeks: 0 },
  { name: "Penta-1 / OPV-1", weeks: 6 }, { name: "Penta-2 / OPV-2", weeks: 10 },
  { name: "Penta-3 / OPV-3", weeks: 14 }, { name: "Measles-1", weeks: 39 },
  { name: "Yellow Fever", weeks: 39 }, { name: "Measles-2", weeks: 65 },
];

function ImmunizationPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const { data: children = [] } = useQuery({
    queryKey: ["children", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("children").select("*").order("date_of_birth")).data ?? [],
  });

  const [selectedId, setSelected] = useState<string | null>(null);
  const childId = selectedId ?? children[0]?.id ?? null;

  const { data: imms = [] } = useQuery({
    queryKey: ["imms", childId],
    enabled: !!childId,
    queryFn: async () => (await supabase.from("immunizations").select("*").eq("child_id", childId!).order("scheduled_date")).data ?? [],
  });

  const addChild = useMutation({
    mutationFn: async () => {
      if (!user || !name.trim() || !dob) throw new Error("Fill child details");
      const { data: c, error } = await supabase.from("children").insert({ user_id: user.id, full_name: name.trim(), date_of_birth: dob }).select().single();
      if (error) throw error;
      const dobDate = new Date(dob);
      const rows = SCHEDULE.map((s) => {
        const sched = new Date(dobDate); sched.setDate(sched.getDate() + s.weeks * 7);
        return { user_id: user.id, child_id: c.id, vaccine_name: s.name, scheduled_date: sched.toISOString().slice(0, 10) };
      });
      await supabase.from("immunizations").insert(rows);
    },
    onSuccess: () => { toast.success("Child added"); setOpen(false); setName(""); setDob(""); qc.invalidateQueries({ queryKey: ["children"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const markGiven = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("immunizations").update({ status: "given", given_date: new Date().toISOString().slice(0, 10) }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["imms"] }),
  });

  return (
    <PhoneShell>
      <TopBar title="Child Immunization" right={<button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>} />
      <div className="px-5 pt-5">
        {children.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
            <Syringe className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-sm font-semibold">Add your child</p>
            <p className="text-xs text-muted-foreground">We'll generate the full vaccine schedule.</p>
          </div>
        )}

        {children.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {children.map((c) => (
              <button key={c.id} onClick={() => setSelected(c.id)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${childId === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                {c.full_name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {imms.map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <Syringe className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{v.vaccine_name}</p>
                <p className="text-xs text-muted-foreground">Due {new Date(v.scheduled_date).toLocaleDateString()}</p>
              </div>
              {v.status === "given" ? (
                <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">Given</span>
              ) : (
                <button onClick={() => markGiven.mutate(v.id)} className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                  <Check className="inline h-3 w-3" /> Mark
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[440px] items-end justify-center bg-black/40">
          <div className="w-full rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Add child</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <label className="mt-4 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">Full name
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </label>
            <label className="mt-3 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">Date of birth
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </label>
            <button onClick={() => addChild.mutate()} disabled={addChild.isPending} className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {addChild.isPending ? "Saving…" : "Save child"}
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}
