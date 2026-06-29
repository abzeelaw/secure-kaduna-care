import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/kare/PhoneShell";
import { useEffect, useState } from "react";
import { Plus, User, Users, Edit3, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({ meta: [{ title: "Family Records — KARE" }] }),
  component: FamilyRecords,
});

type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  dob?: string;
  records?: { id: string; title: string; record_type: string; provider?: string; record_date: string }[];
};

const STORAGE_KEY = "kare:family_records";

function FamilyRecords() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMembers(JSON.parse(raw));
    } catch {
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  function addMember() {
    if (!name.trim() || !relation.trim()) return;
    const m: FamilyMember = { id: `member-${Date.now()}`, name: name.trim(), relation: relation.trim(), records: [], dob: undefined };
    setMembers((s) => [m, ...s]);
    setName(""); setRelation(""); setOpen(false);
  }

  function removeMember(id: string) {
    setMembers((s) => s.filter((m) => m.id !== id));
  }

  return (
    <PhoneShell>
      <TopBar title="Family Records" right={<Link to="/records" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">R</Link>} />
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="text-sm font-semibold">Household</p>
          <p className="mt-2 text-xs text-muted-foreground">Add family members so clinicians can view household medical history.</p>
          <div className="mt-4 space-y-3">
            {members.length === 0 && <p className="text-sm text-muted-foreground">No family members yet — tap + to add one.</p>}
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.relation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeMember(m.id)} className="p-2"><Trash2 className="h-4 w-4 text-emergency" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-2xl bg-primary py-3 px-4 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add member</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[440px] rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Add family member</h3>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <label className="mt-3 text-xs font-medium text-muted-foreground">Full name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-input px-3 py-2.5 text-sm" />
            </label>
            <label className="mt-3 text-xs font-medium text-muted-foreground">Relation
              <input value={relation} onChange={(e) => setRelation(e.target.value)} className="mt-1 w-full rounded-xl border border-input px-3 py-2.5 text-sm" />
            </label>
            <div className="mt-4">
              <button onClick={addMember} className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Add</button>
            </div>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}
