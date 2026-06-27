import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { User, HeartPulse, Phone, Bell, Lock, Languages, HelpCircle, Info, LogOut, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — KARE" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<null | "personal" | "medical" | "emergency">(null);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });

  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => { if (profile) setForm({
    full_name: profile.full_name ?? "", phone: profile.phone ?? "", address: profile.address ?? "",
    blood_group: profile.blood_group ?? "", genotype: profile.genotype ?? "",
    emergency_contact_name: profile.emergency_contact_name ?? "", emergency_contact_phone: profile.emergency_contact_phone ?? "",
  }); }, [profile]);

  const save = useMutation({
    mutationFn: async (patch: Record<string, string>) => {
      const { error } = await supabase.from("profiles").update(patch as never).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["profile"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const fullName = profile?.full_name ?? user?.email ?? "";
  const initials = fullName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const groups = [
    { title: "Account", items: [
      { i: User, l: "Personal Information", onClick: () => setEditing("personal") },
      { i: HeartPulse, l: "Medical Information", onClick: () => setEditing("medical") },
      { i: Phone, l: "Emergency Contacts", onClick: () => setEditing("emergency") },
    ]},
    { title: "Preferences", items: [
      { i: Bell, l: "Notifications", onClick: () => toast.info("Notifications coming soon") },
      { i: Lock, l: "Privacy & Security", onClick: () => toast.info("Manage in account settings") },
      { i: Languages, l: "Language Preferences", onClick: () => toast.info("English / Hausa selector coming soon") },
    ]},
    { title: "Support", items: [
      { i: HelpCircle, l: "Help & Support", onClick: () => toast.info("Email support@kare.ng") },
      { i: Info, l: "About KARE", onClick: () => toast.info("KARE v1.0 — Kaduna State") },
    ]},
  ];

  return (
    <PhoneShell>
      <TopBar title="Profile & Settings" />
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">{initials}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className="text-xs text-muted-foreground">{profile?.phone ?? "Add your phone"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title} className="mt-5">
            <p className="px-1 text-xs font-semibold uppercase text-muted-foreground">{g.title}</p>
            <div className="mt-2 rounded-2xl border border-border bg-card divide-y divide-border">
              {g.items.map((it) => {
                const Icon = it.i;
                return (
                  <button key={it.l} onClick={it.onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{it.l}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={signOut} className="mt-6 mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-emergency py-3.5 text-sm font-semibold text-emergency">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[440px] items-end justify-center bg-black/40">
          <div className="w-full rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold capitalize">{editing} info</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              {editing === "personal" && (
                <>
                  <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                </>
              )}
              {editing === "medical" && (
                <>
                  <Field label="Blood group" value={form.blood_group} onChange={(v) => setForm({ ...form, blood_group: v })} placeholder="O+" />
                  <Field label="Genotype" value={form.genotype} onChange={(v) => setForm({ ...form, genotype: v })} placeholder="AA" />
                </>
              )}
              {editing === "emergency" && (
                <>
                  <Field label="Contact name" value={form.emergency_contact_name} onChange={(v) => setForm({ ...form, emergency_contact_name: v })} />
                  <Field label="Contact phone" value={form.emergency_contact_phone} onChange={(v) => setForm({ ...form, emergency_contact_phone: v })} />
                </>
              )}
            </div>
            <button onClick={() => save.mutate(form)} disabled={save.isPending} className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {save.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">{label}
      <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
    </label>
  );
}
