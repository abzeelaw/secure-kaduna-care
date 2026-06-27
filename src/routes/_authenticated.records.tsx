import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { FileText, Pill, FlaskConical, Syringe, AlertCircle, HeartPulse, Plus, X } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/records")({
  head: () => ({ meta: [{ title: "Medical Records — KARE" }] }),
  component: RecordsPage,
});

const types = [
  { key: "allergy", label: "Allergies", icon: AlertCircle, tint: "bg-emergency-soft text-emergency" },
  { key: "medication", label: "Medications", icon: Pill, tint: "bg-primary-soft text-primary" },
  { key: "diagnosis", label: "Diagnoses", icon: FileText, tint: "bg-secondary text-info" },
  { key: "lab", label: "Lab Results", icon: FlaskConical, tint: "bg-accent text-accent-foreground" },
  { key: "vaccine", label: "Immunizations", icon: Syringe, tint: "bg-primary-soft text-primary" },
  { key: "surgery", label: "Surgeries", icon: HeartPulse, tint: "bg-emergency-soft text-emergency" },
];

function RecordsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [recordType, setRecordType] = useState("medication");
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });

  const { data: records = [] } = useQuery({
    queryKey: ["records", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("medical_records").select("*").order("record_date", { ascending: false });
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!title.trim()) throw new Error("Title required");
      const { error } = await supabase.from("medical_records").insert({
        user_id: user.id, record_type: recordType, title: title.trim(), provider: provider.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Record saved"); setOpen(false); setTitle(""); setProvider(""); qc.invalidateQueries({ queryKey: ["records"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const counts = types.map((t) => ({ ...t, count: records.filter((r) => r.record_type === t.key).length }));
  const fullName = profile?.full_name ?? user?.email ?? "Patient";

  return (
    <PhoneShell>
      <TopBar title="Medical Records" right={<button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>} />
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.55_0.12_184)] p-5 text-primary-foreground shadow-lg">
          <p className="text-xs opacity-80">Emergency Access Card</p>
          <p className="mt-1 text-lg font-semibold">{fullName}</p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <div><p className="opacity-70">Blood Group</p><p className="text-base font-bold">{profile?.blood_group ?? "—"}</p></div>
            <div><p className="opacity-70">Genotype</p><p className="text-base font-bold">{profile?.genotype ?? "—"}</p></div>
            <div><p className="opacity-70">ID</p><p className="text-base font-bold">{(user?.id ?? "").slice(0, 8).toUpperCase()}</p></div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {counts.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.key} className="rounded-xl border border-border bg-card p-3.5">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${it.tint}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-sm font-semibold text-foreground">{it.label}</p>
                <p className="text-xs text-muted-foreground">{it.count} record{it.count === 1 ? "" : "s"}</p>
              </div>
            );
          })}
        </div>

        <h3 className="mt-5 text-sm font-semibold">Recent</h3>
        <div className="mt-2 space-y-2">
          {records.length === 0 && <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">No records yet — tap + to add one.</p>}
          {records.slice(0, 8).map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-3">
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.record_type} • {new Date(r.record_date).toLocaleDateString()} {r.provider ? `• ${r.provider}` : ""}</p>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[440px] items-end justify-center bg-black/40">
          <div className="w-full rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Add medical record</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <label className="mt-4 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">Type
              <select value={recordType} onChange={(e) => setRecordType(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
                {types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Amoxicillin 500mg" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </label>
            <label className="mt-3 flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">Provider / Hospital
              <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="optional" className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
            </label>
            <button onClick={() => add.mutate()} disabled={add.isPending} className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {add.isPending ? "Saving…" : "Save record"}
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}
